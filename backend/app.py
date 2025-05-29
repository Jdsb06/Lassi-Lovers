from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import time
import asyncio
from typing import List, Dict, Any, Optional
import uvicorn
import logging
from contextlib import asynccontextmanager
from pathlib import Path

# Import local modules
from .models import ClaimRequest, UrlRequest, AnalysisResponse, ErrorResponse, HealthResponse, TokenRequest, TokenResponse, SimilarClaimsResponse
from .nlp_processor import extract_claims, preprocess_text, analyze_sentiment
from .fact_checker import fact_checker
from .database import db
from .security import rate_limit, get_current_user, create_access_token, User, get_api_key, validate_api_key, RateLimitMiddleware
from .utils import extract_text_from_url, get_embedding, measure_execution_time, truncate_text, TimingMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Get the absolute path to the backend directory and .env file
BACKEND_DIR = Path(__file__).resolve().parent
ENV_FILE = BACKEND_DIR / ".env"

# Print detailed path information
logger.info("=== Environment File Path Information ===")
logger.info(f"__file__: {__file__}")
logger.info(f"Resolved __file__: {Path(__file__).resolve()}")
logger.info(f"Backend directory (parent): {BACKEND_DIR}")
logger.info(f"ENV file path: {ENV_FILE}")
logger.info(f"ENV file exists: {ENV_FILE.exists()}")
logger.info(f"ENV file is file: {ENV_FILE.is_file()}")
logger.info(f"ENV file is readable: {os.access(str(ENV_FILE), os.R_OK)}")
if ENV_FILE.exists():
    logger.info(f"ENV file size: {ENV_FILE.stat().st_size} bytes")
    logger.info(f"ENV file permissions: {oct(ENV_FILE.stat().st_mode)[-3:]}")
    logger.info(f"ENV file absolute path: {ENV_FILE.absolute()}")
    logger.info(f"ENV file real path: {ENV_FILE.resolve()}")
logger.info("=== End Environment File Path Information ===")

# Try to read the .env file directly to verify its contents
try:
    if ENV_FILE.exists():
        with open(ENV_FILE, 'r') as f:
            env_contents = f.read()
            logger.info(f"Successfully read .env file. First 100 chars: {env_contents[:100]}...")
    else:
        logger.error(f"Cannot read .env file: File does not exist at {ENV_FILE}")
except Exception as e:
    logger.error(f"Error reading .env file: {str(e)}")

# Load environment variables from the backend directory
load_dotenv(dotenv_path=str(ENV_FILE), override=True)

# Log environment variable status with more detail
logger.info("=== Environment Variables After Loading ===")
for key in ["GOOGLE_API_KEY", "SERPER_API_KEY", "OPENAI_API_KEY", "DATABASE_URL", "REDIS_URL"]:
    value = os.environ.get(key)
    if value:
        logger.info(f"{key}: Found (length: {len(value)})")
    else:
        logger.error(f"{key}: Not found in environment variables")
logger.info("=== End Environment Variables ===")

# API version
API_VERSION = "1.0.0"

# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load models and initialize components
    logger.info("Starting up the application...")
    yield
    # Shutdown: Clean up resources
    logger.info("Shutting down the application...")

# Create FastAPI app
app = FastAPI(
    title="Fact-Checking API",
    description="API for detecting and verifying factual claims in text",
    version=API_VERSION,
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(RateLimitMiddleware)
app.add_middleware(TimingMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Check the health of the API and its components."""
    # Check components
    components = {
        "database": db.engine is not None,
        "vector_db": db.vector_client is not None,
        "fact_checker": True,  # Assuming fact_checker is always available
    }

    return {
        "status": "healthy" if all(components.values()) else "degraded",
        "version": API_VERSION,
        "components": components
    }

# Authentication endpoint
@app.post("/token", response_model=TokenResponse, tags=["Authentication"])
async def login_for_access_token(form_data: TokenRequest):
    """Generate a JWT token for API access."""
    # In a real application, validate credentials against a database
    # For this example, we'll accept any username/password
    if not form_data.username or not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = 30 * 60  # 30 minutes
    access_token = create_access_token(
        data={"sub": form_data.username},
        expires_delta=None  # Use default expiration
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": access_token_expires
    }

# Main analysis endpoint
@app.post("/analyze", response_model=AnalysisResponse, tags=["Fact Checking"])
async def analyze_text(
    request: Request,
    claim_request: ClaimRequest,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Analyze text for factual claims and verify them.

    This endpoint extracts factual claims from the provided text,
    verifies each claim using multiple fact-checking methods,
    and returns the results with confidence scores and sources.
    """
    try:
        # Preprocess text
        text = preprocess_text(claim_request.text)

        # Extract claims
        claims = extract_claims(text)
        if not claims:
            return {"claims": [], "sentiment": analyze_sentiment(text)}

        # Verify each claim
        verified_claims = []
        for claim_text in claims:
            # Get claim embedding for vector search
            embedding = get_embedding(claim_text)

            # Check for similar claims in database
            similar_claims = []
            if embedding:
                similar_claims = db.find_similar_claims(embedding, limit=1)

            # If we found a very similar claim with high confidence, use cached result
            if similar_claims and similar_claims[0]["similarity"] > 0.95:
                # Get full details of the similar claim
                cached_result = db.get_fact_check_by_id(similar_claims[0]["id"])
                if cached_result:
                    verified_claims.append({
                        "text": claim_text,
                        "score": cached_result["score"],
                        "verdict": cached_result["verdict"],
                        "explanation": cached_result["explanation"],
                        "sources": cached_result["sources"],
                        "evidence": cached_result["evidence"],
                        "reviews": []  # No reviews for cached results
                    })
                    continue

            # Verify the claim
            verification_result = await fact_checker.verify_claim(
                claim_text, 
                context=claim_request.context
            )

            # Store the result in database
            if embedding:
                db.store_fact_check(
                    claim=claim_text,
                    score=verification_result["score"],
                    verdict=verification_result["verdict"],
                    explanation=verification_result["explanation"],
                    sources=verification_result["sources"],
                    evidence=verification_result["evidence"],
                    embedding=embedding
                )

            # Add to results
            verified_claims.append({
                "text": claim_text,
                "score": verification_result["score"],
                "verdict": verification_result["verdict"],
                "explanation": verification_result["explanation"],
                "sources": verification_result["sources"],
                "evidence": verification_result["evidence"],
                "reviews": verification_result.get("reviews", [])
            })

        # Return results
        return {
            "claims": verified_claims,
            "sentiment": analyze_sentiment(text)
        }
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing text: {str(e)}"
        )

# URL analysis endpoint
@app.post("/analyze_url", response_model=AnalysisResponse, tags=["Fact Checking"])
async def analyze_url(
    request: Request,
    url_request: UrlRequest,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Analyze a URL for factual claims and verify them.

    This endpoint extracts text from the provided URL,
    identifies factual claims, verifies each claim,
    and returns the results with confidence scores and sources.
    """
    try:
        # Extract text from URL
        text, metadata = await extract_text_from_url(str(url_request.url))

        # Truncate text if it's too long
        text = truncate_text(text, max_length=5000)

        # Extract claims
        claims = extract_claims(text)
        if not claims:
            return {"claims": [], "sentiment": analyze_sentiment(text)}

        # Verify each claim (similar to analyze_text)
        verified_claims = []
        for claim_text in claims:
            # Verify the claim
            verification_result = await fact_checker.verify_claim(claim_text)

            # Add to results
            verified_claims.append({
                "text": claim_text,
                "score": verification_result["score"],
                "verdict": verification_result["verdict"],
                "explanation": verification_result["explanation"],
                "sources": verification_result["sources"],
                "evidence": verification_result["evidence"],
                "reviews": verification_result.get("reviews", [])
            })

        # Return results
        return {
            "claims": verified_claims,
            "sentiment": analyze_sentiment(text)
        }
    except Exception as e:
        logger.error(f"Error analyzing URL: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing URL: {str(e)}"
        )

# Similar claims endpoint
@app.post("/similar_claims", response_model=SimilarClaimsResponse, tags=["Fact Checking"])
async def find_similar_claims(
    request: Request,
    claim_request: ClaimRequest,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Find claims similar to the provided claim.

    This endpoint uses vector similarity search to find claims
    that are semantically similar to the provided claim.
    """
    try:
        # Get claim embedding
        embedding = get_embedding(claim_request.text)
        if not embedding:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generating embedding for claim"
            )

        # Find similar claims
        similar_claims_data = db.find_similar_claims(embedding, limit=5)

        # Adjust data structure to match the SimilarClaimsResponse model
        similar_claims = []
        for item in similar_claims_data:
            similar_claims.append({
                "id": item.get("id"),
                "text": item.get("claim"), # Map 'claim' to 'text'
                "score": item.get("score"),
                "verdict": item.get("verdict"),
                "similarity": item.get("similarity"),
            })

        # Return results
        return {
            "query": claim_request.text,
            "results": similar_claims
        }
    except Exception as e:
        logger.error(f"Error finding similar claims: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error finding similar claims: {str(e)}"
        )

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions and return structured error responses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

# Add test endpoint for environment variables
@app.get("/test-env", tags=["System"])
async def test_env():
    """Test endpoint to check environment variables."""
    env_vars = {
        "GOOGLE_API_KEY": os.environ.get("GOOGLE_API_KEY"),
        "SERPER_API_KEY": os.environ.get("SERPER_API_KEY"),
        "OPENAI_API_KEY": os.environ.get("OPENAI_API_KEY"),
        "DATABASE_URL": os.environ.get("DATABASE_URL"),
        "REDIS_URL": os.environ.get("REDIS_URL")
    }
    
    # Get detailed path information
    backend_dir = Path(__file__).resolve().parent
    env_file = backend_dir / ".env"
    
    # Mask the actual values for security
    masked_vars = {k: f"{v[:10]}..." if v else None for k, v in env_vars.items()}
    
    return {
        "status": "success",
        "environment_variables": masked_vars,
        "path_information": {
            "current_working_dir": os.getcwd(),
            "backend_dir": str(backend_dir),
            "env_file_path": str(env_file),
            "env_file_exists": env_file.exists(),
            "env_file_is_file": env_file.is_file() if env_file.exists() else False,
            "env_file_is_readable": os.access(str(env_file), os.R_OK) if env_file.exists() else False,
            "env_file_size": env_file.stat().st_size if env_file.exists() else None,
            "env_file_permissions": oct(env_file.stat().st_mode)[-3:] if env_file.exists() else None,
            "__file__": __file__,
            "resolved_file": str(Path(__file__).resolve())
        }
    }

# Root endpoint
@app.get("/", tags=["System"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to the Fact-Checking API",
        "version": API_VERSION,
        "endpoints": {
            "analyze": "POST /analyze - Analyze text for factual claims",
            "analyze_url": "POST /analyze_url - Analyze URL for factual claims",
            "similar_claims": "POST /similar_claims - Find similar claims",
            "health": "GET /health - Check API health",
            "token": "POST /token - Get authentication token"
        }
    }

# Run the application
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
