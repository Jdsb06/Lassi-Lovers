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

# Import local modules
from models import ClaimRequest, UrlRequest, AnalysisResponse, ErrorResponse, HealthResponse, TokenRequest, TokenResponse, SimilarClaimsResponse
from nlp_processor import extract_claims, analyze_sentiment
from fact_checker import async_fact_checker
from database import db
from security import rate_limit, get_current_user, create_access_token, User, get_api_key, validate_api_key, RateLimitMiddleware
from utils import extract_text_from_url, get_embedding, measure_execution_time, truncate_text, TimingMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

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
        # Extract claims from text
        claims = extract_claims(claim_request.text)
        
        # Analyze each claim
        analyzed_claims = []
        for claim in claims:
            # Verify the claim asynchronously
            result = await async_fact_checker.verify_claim(claim)
            # Map 'claim' field to 'text' for response
            result['text'] = result.pop('claim', claim)
            analyzed_claims.append(result)
        
        # Analyze sentiment
        sentiment = analyze_sentiment(claim_request.text)
        
        return AnalysisResponse(
            claims=analyzed_claims,
            sentiment=sentiment,
            processing_time=None
        )
        
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
        text = extract_text_from_url(str(url_request.url))
        
        # Extract claims from text
        claims = extract_claims(text)
        
        # Analyze each claim
        analyzed_claims = []
        for claim in claims:
            # Verify the claim asynchronously
            result = await async_fact_checker.verify_claim(claim)
            # Map 'claim' field to 'text' for response
            result['text'] = result.pop('claim', claim)
            analyzed_claims.append(result)
        
        # Analyze sentiment
        sentiment = analyze_sentiment(text)
        
        return AnalysisResponse(
            claims=analyzed_claims,
            sentiment=sentiment,
            processing_time=None
        )
        
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
        similar_claims = db.find_similar_claims(embedding, limit=5)

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
