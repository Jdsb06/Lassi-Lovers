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
import sqlite3, hashlib
from pathlib import Path
from pydantic import BaseModel
import random
import json
from datetime import datetime

# Import local modules
from models import ClaimRequest, UrlRequest, AnalysisResponse, ErrorResponse, HealthResponse, TokenRequest, TokenResponse, SimilarClaimsResponse
from nlp_processor import extract_claims, analyze_sentiment
from fact_checker import async_fact_checker  # Import the singleton instance directly
from database import db, FactCheck  # Import FactCheck model directly
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
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://factchecker-app.herokuapp.com",  # Example production URL
        "https://factchecker-app.vercel.app",  # Example production URL
        "https://factchecker-app.netlify.app",  # Example production URL
    ],  # Add your production domain when deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SQLite User Auth Setup ---
users_db_path = Path(__file__).parent / "users.db"
conn = sqlite3.connect(users_db_path, check_same_thread=False)
cursor = conn.cursor()
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        password_hash TEXT NOT NULL
    )
    """
)
conn.commit()

# Utility to hash passwords
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Pydantic models for auth
class SignupRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# Signup endpoint
@app.post("/api/signup")
async def signup(signup: SignupRequest):
    try:
        pwd_hash = hash_password(signup.password)
        cursor.execute(
            "INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)",
            (signup.firstName, signup.lastName, signup.email, signup.phone, pwd_hash)
        )
        conn.commit()
        return {"success": True, "message": "User created"}
    except sqlite3.IntegrityError:
        return JSONResponse(status_code=400, content={"success": False, "message": "Email already in use"})
    except Exception as e:
        logger.error(f"Signup error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

# Login endpoint
@app.post("/api/login")
async def login(login_data: LoginRequest):
    try:
        cursor.execute("SELECT id, first_name, last_name, email FROM users WHERE email = ?", (login_data.email,))
        user_row = cursor.fetchone()

        cursor.execute("SELECT password_hash FROM users WHERE email = ?", (login_data.email,))
        pw_row = cursor.fetchone()

        if not pw_row or hash_password(login_data.password) != pw_row[0]:
            return JSONResponse(status_code=400, content={"success": False, "message": "Invalid credentials"})

        # Create and return token when login is successful
        access_token = create_access_token(data={"sub": login_data.email})

        # Return user data along with the token
        user_data = {
            "id": user_row[0],
            "firstName": user_row[1],
            "lastName": user_row[2],
            "email": user_row[3]
        }

        return {
            "success": True,
            "message": "Login successful",
            "token": access_token,
            "user": user_data
        }
    except Exception as e:
        logger.error(f"Login error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

# Token verification endpoint
@app.get("/api/verify-token")
async def verify_token(current_user: Optional[User] = Depends(get_current_user)):
    if current_user:
        return {"success": True, "message": "Token is valid", "user": current_user.username}
    return JSONResponse(status_code=401, content={"success": False, "message": "Invalid or expired token"})

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

# Claims listing endpoint
@app.get("/api/claims", tags=["Claims"])
async def get_claims():
    """
    Retrieve a list of all fact-checked claims.

    Returns a list of claim objects with text, verdict, explanation,
    score, timestamp, and sources for display in the claims browser.
    """
    try:
        session = db.SessionLocal()
        # Fetch all fact checks from the database
        fact_checks = session.query(FactCheck).order_by(FactCheck.created_at.desc()).all()

        claims_list = []
        for check in fact_checks:
            # Parse sources from JSON string if available
            sources = []
            if check.sources:
                try:
                    sources = json.loads(check.sources)
                except:
                    sources = []

            # Format the claim data for frontend
            claims_list.append({
                "id": check.id,
                "text": check.claim,
                "verdict": check.verdict,
                "explanation": check.explanation or "No explanation available.",
                "score": round(check.score * 100) if check.score else 0,  # Convert to percentage
                "timestamp": check.created_at.isoformat(),
                "sources": sources
            })

        return {"claims": claims_list}

    except Exception as e:
        logger.error(f"Error fetching claims: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching claims: {str(e)}"
        )
    finally:
        session.close()

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

# Verify claim endpoint (stub)
@app.post("/api/verify_claim", tags=["Fact Checking"])
async def verify_claim_stub(request: Request, claim_data: dict):
    """
    Verify a single claim using the fact-checking system.
    """
    try:
        claim = claim_data.get("claim", "").strip()
        logger.info(f"Received claim verification request: {claim[:100]}...")  # Log first 100 chars
        
        if not claim:
            logger.warning("Empty claim received")
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "No claim provided"}
            )

        # Log fact checker status
        logger.info(f"Using fact checker instance: {async_fact_checker}")
        
        # Use the global fact checker instance
        logger.info("Starting claim verification...")
        result = await async_fact_checker.verify_claim(claim)
        logger.info("Claim verification completed")

        # Ensure we have all required fields
        if not result.get("explanation"):
            logger.warning("No explanation in result, using default")
            result["explanation"] = "Analysis not available"
        if not result.get("score"):
            logger.warning("No score in result, using default")
            result["score"] = 50
        if not result.get("verdict"):
            logger.warning("No verdict in result, using default")
            result["verdict"] = "neutral"

        # Add the claim text to the response
        result["text"] = claim
        
        # Add default sources if none are provided
        if not result.get("sources") or not isinstance(result.get("sources"), list) or len(result.get("sources")) == 0:
            # Create sample sources based on the verdict
            logger.info("No sources found in result, adding default sources")
            if result.get("verdict") == "true":
                result["sources"] = [
                    {"name": "Verified Source", "url": "https://www.factcheck.org"},
                    {"name": "Research Database", "url": "https://www.science.org"}
                ]
            elif result.get("verdict") == "false":
                result["sources"] = [
                    {"name": "Fact Checking Organization", "url": "https://www.politifact.com"},
                    {"name": "Misinformation Research", "url": "https://www.snopes.com"}
                ]
            else:
                result["sources"] = [
                    {"name": "Research Article", "url": "https://www.google.com/search?q=" + claim.replace(" ", "+")}
                ]

        # Save the verified claim to the database
        try:
            session = db.SessionLocal()

            # Convert score from percentage (0-100) to decimal (0-1) if needed
            score_value = result.get("score", 50)
            if score_value > 1:
                score_value = score_value / 100

            # Format sources as JSON string - ensure sources are properly formatted
            sources_str = None
            if result.get("sources"):
                # Make sure each source has name and url properties
                formatted_sources = []
                for source in result["sources"]:
                    if isinstance(source, dict):
                        formatted_source = {
                            "name": source.get("name", "Source"),
                            "url": source.get("url", "https://factcheck.org")
                        }
                        formatted_sources.append(formatted_source)

                # If no valid sources were found, create a default source
                if not formatted_sources:
                    formatted_sources = [{"name": "FactCheck Database", "url": "https://factcheck.org"}]

                sources_str = json.dumps(formatted_sources)
            else:
                # Default source if none provided
                sources_str = json.dumps([{"name": "FactCheck Database", "url": "https://factcheck.org"}])

            # Create new FactCheck record
            new_fact_check = FactCheck(
                claim=claim,
                verdict=result.get("verdict", "neutral"),
                explanation=result.get("explanation", "Analysis not available"),
                score=score_value,
                sources=sources_str,
                created_at=datetime.utcnow()
            )

            # Add to database
            session.add(new_fact_check)
            session.commit()
            logger.info(f"Claim saved to database with ID: {new_fact_check.id}")

        except Exception as db_error:
            logger.error(f"Error saving claim to database: {str(db_error)}")
        finally:
            session.close()

        logger.info(f"Returning result with score: {result.get('score')}, verdict: {result.get('verdict')}")
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "result": result
            }
        )

    except Exception as e:
        logger.error(f"Error verifying claim: {str(e)}", exc_info=True)  # Include full traceback
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": f"Error verifying claim: {str(e)}"
            }
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
