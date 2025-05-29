import os
import requests
import json
import time
from typing import Dict, List, Any, Optional, Tuple
import httpx
import redis
from functools import lru_cache
import hashlib
from huggingface_hub import AsyncInferenceClient
import logging
from minicheck.minicheck import MiniCheck
import nltk
from dotenv import load_dotenv
from pathlib import Path

# Ensure the NLTK data path is set correctly
# Replace with the actual path to your .venv/nltk_data directory
NLTK_VENV_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", ".venv", "nltk_data")
if NLTK_VENV_DATA_PATH not in nltk.data.path:
    nltk.data.path.append(NLTK_VENV_DATA_PATH)

# Load environment variables
from pathlib import Path

# Get the absolute path to the backend directory
BACKEND_DIR = Path(__file__).parent.absolute()
ENV_FILE = BACKEND_DIR / ".env"

# Load environment variables from the backend directory
load_dotenv(dotenv_path=ENV_FILE, override=True)

# Get API keys with explicit error handling
API_KEY = os.environ.get("GOOGLE_API_KEY")
if not API_KEY:
    logging.error("GOOGLE_API_KEY not found in environment variables")
else:
    logging.info("GOOGLE_API_KEY found (first 10 chars): " + API_KEY[:10] + "...")

SERPER_API_KEY = os.environ.get("SERPER_API_KEY")
if not SERPER_API_KEY:
    logging.error("SERPER_API_KEY not found in environment variables")
else:
    logging.info("SERPER_API_KEY found (first 10 chars): " + SERPER_API_KEY[:10] + "...")

FACT_CHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

# Log environment file status
logging.info(f"Loading environment variables from: {ENV_FILE}")
logging.info(f"Environment file exists: {ENV_FILE.exists()}")

# Log all environment variables for debugging
logging.debug("Environment variables:")
for key in ["GOOGLE_API_KEY", "SERPER_API_KEY", "OPENAI_API_KEY", "REDIS_URL"]:
    value = os.environ.get(key)
    if value:
        logging.debug(f"{key}: {'*' * len(value)}")  # Mask the actual values
    else:
        logging.debug(f"{key}: Not set")

# Initialize Redis client for caching if available
try:
    redis_client = redis.from_url(REDIS_URL)
    REDIS_AVAILABLE = True
except:
    REDIS_AVAILABLE = False
    print("Warning: Redis not available. Caching will be disabled.")

class FactChecker:
    def __init__(self):
        """Initialize the fact checker with necessary components."""
        self.http_client = httpx.AsyncClient(timeout=30.0)
        
        # Initialize MiniCheck model locally
        self.minicheck_available = False
        self.minicheck_scorer = None
        
        try:
            logging.info("Initializing MiniCheck model...")
            # Initialize with one of the supported models
            self.minicheck_scorer = MiniCheck(
                model_name='flan-t5-large',  # Using the supported flan-t5-large model
                cache_dir='./ckpts'
            )
            
            # Test the model with a simple claim
            test_docs = ["This is a test context."]
            test_claims = ["This is a test claim."]
            try:
                _, _, _, _ = self.minicheck_scorer.score(docs=test_docs, claims=test_claims)
                self.minicheck_available = True
                logging.info("MiniCheck model initialized successfully")
            except Exception as test_error:
                logging.error(f"MiniCheck model test failed: {test_error}", exc_info=True)
                self.minicheck_available = False
                self.minicheck_scorer = None
                
        except Exception as e:
            logging.error(f"Error initializing MiniCheck model: {e}", exc_info=True)
            self.minicheck_available = False
            self.minicheck_scorer = None

    async def verify_claim(self, claim: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Verify a claim using multiple verification methods and return a comprehensive result.

        Args:
            claim: The claim to verify
            context: Optional context for the claim

        Returns:
            Dictionary with verification results including score, sources, and explanation
        """
        # Generate a cache key based on the claim and context
        cache_key = f"factcheck:{hashlib.md5((claim + (context or '')).encode()).hexdigest()}"

        # Try to get cached result
        if REDIS_AVAILABLE:
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)

        # Parallel verification using different methods
        results = await self._verify_with_multiple_sources(claim, context)

        # Combine results and calculate final score
        final_result = self._combine_verification_results(results, claim)

        # Cache the result
        if REDIS_AVAILABLE:
            redis_client.setex(cache_key, 3600 * 24, json.dumps(final_result))  # Cache for 24 hours

        return final_result

    async def _verify_with_multiple_sources(self, claim: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Verify a claim using multiple sources in parallel.

        Args:
            claim: The claim to verify
            context: Optional context for the claim

        Returns:
            Dictionary with results from different verification methods
        """
        # Verify with Google Fact Check API
        google_result = await self._verify_with_google_api(claim)

        # Verify with MiniCheck model
        minicheck_result = await self._verify_with_minicheck(claim, context)

        # Search for evidence
        evidence = await self._search_for_evidence(claim)

        return {
            "google": google_result,
            "minicheck": minicheck_result,
            "evidence": evidence
        }

    async def _verify_with_google_api(self, claim: str) -> Dict[str, Any]:
        """
        Verify a claim using Google Fact Check Tools API.

        Args:
            claim: The claim to verify

        Returns:
            Dictionary with verification results from Google API
        """
        if not API_KEY:
            logging.error("Google API Key is missing")
            return {"score": 50, "sources": [], "available": False}

        params = {
            "query": claim,
            "key": API_KEY,
            "pageSize": 5  # Limit to 5 results for simplicity
        }

        try:
            logging.info(f"Making Google Fact Check API request for claim: {claim[:100]}...")
            response = await self.http_client.get(FACT_CHECK_URL, params=params)
            logging.info(f"Google Fact Check API response status: {response.status_code}")
            
            if response.status_code != 200:
                logging.error(f"Google Fact Check API error: {response.text}")
                return {"score": 50, "sources": [], "available": False}

            data = response.json()
            if not data.get("claims"):
                logging.info("No claims found in Google Fact Check API response")
                return {"score": 50, "sources": [], "available": True, "found": False}

            scores = []
            sources = []
            reviews = []

            for claim_data in data["claims"]:
                for review in claim_data.get("claimReview", []):
                    rating = review.get("textualRating", "").lower()
                    url = review.get("url", "")
                    publisher = review.get("publisher", {}).get("name", "Unknown Source")

                    sources.append(url)
                    reviews.append({
                        "publisher": publisher,
                        "rating": review.get("textualRating", ""),
                        "url": url,
                        "title": claim_data.get("text", "")
                    })

                    if "true" in rating or "correct" in rating or "accurate" in rating:
                        scores.append(1)  # True = 100%
                    elif "false" in rating or "incorrect" in rating or "inaccurate" in rating:
                        scores.append(0)  # False = 0%
                    elif "mostly true" in rating or "partly true" in rating:
                        scores.append(0.75)  # Mostly true = 75%
                    elif "mostly false" in rating or "partly false" in rating:
                        scores.append(0.25)  # Mostly false = 25%
                    else:
                        scores.append(0.5)  # Other = 50%

            if not scores:
                return {"score": 50, "sources": sources, "reviews": reviews, "available": True, "found": True}

            average_score = sum(scores) / len(scores) * 100
            return {
                "score": average_score,
                "sources": sources,
                "reviews": reviews,
                "available": True,
                "found": True
            }
        except Exception as e:
            return {"score": 50, "sources": [], "error": str(e), "available": False}

    async def _verify_with_minicheck(self, claim: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Verify a claim using the MiniCheck model locally.

        Args:
            claim: The claim to verify
            context: Optional context for the claim (MiniCheck uses 'docs')

        Returns:
            Dictionary with verification results from MiniCheck
        """
        if not self.minicheck_available:
            return {"score": 50, "explanation": "MiniCheck model not available", "available": False}

        # Input validation
        if not claim or not isinstance(claim, str) or len(claim.strip()) == 0:
            return {
                "score": 50,
                "explanation": "Invalid claim provided",
                "available": False
            }

        try:
            # Ensure context is a non-empty string
            if not context or not isinstance(context, str) or len(context.strip()) == 0:
                context = "No additional context provided."  # Default context instead of empty string
            
            # MiniCheck expects a list of documents (context) and a list of claims
            docs = [context]
            claims = [claim]

            logging.info(f"Processing claim with MiniCheck: {claim[:100]}...")
            logging.debug(f"Context length: {len(context)}")

            # Use the locally loaded MiniCheck model
            try:
                pred_label, raw_prob, _, _ = self.minicheck_scorer.score(docs=docs, claims=claims)
                
                if pred_label is None or raw_prob is None:
                    raise ValueError("MiniCheck model returned None values")
                
                # MiniCheck returns results as lists, get the first element
                pred_label = pred_label[0]
                raw_prob = raw_prob[0]

            except Exception as model_error:
                logging.error(f"Error during MiniCheck model inference: {model_error}", exc_info=True)
                return {
                    "score": 50,
                    "explanation": f"Error during model inference: {str(model_error)}",
                    "available": False
                }

            # Map MiniCheck result to score and verdict
            if pred_label == 1:  # Supported
                # Scale probability from raw_prob (0-1) to score (50-100)
                # This means even low confidence starts at 50 and goes up to 100
                score = 50 + (raw_prob * 50)
                verdict = "supported"
                explanation = f"MiniCheck model found the claim supported with confidence {raw_prob:.2f}."
            elif pred_label == 0:  # Unsupported
                # Scale probability from raw_prob (0-1) to score (0-50)
                # This means high confidence in unsupported starts at 0 and goes up to 50
                score = 50 - (raw_prob * 50)
                verdict = "refuted"
                explanation = f"MiniCheck model found the claim unsupported with confidence {raw_prob:.2f}."
            else:
                score = 50
                verdict = "neutral"
                explanation = "MiniCheck model returned a neutral or unexpected result."

            # Ensure score is within 0-100 bounds
            score = max(0, min(100, score))

            return {
                "score": score,
                "explanation": explanation,
                "verdict": verdict,
                "available": True
            }

        except Exception as e:
            logging.error(f"Error during MiniCheck local inference: {e}", exc_info=True)
            return {
                "score": 50,
                "explanation": f"Error during local model inference: {str(e)}",
                "available": False
            }

    async def _search_for_evidence(self, claim: str) -> List[Dict[str, Any]]:
        """
        Search for evidence related to the claim using Serper API.

        Args:
            claim: The claim to search for

        Returns:
            List of evidence items with titles, snippets, and links
        """
        if not SERPER_API_KEY:
            logging.error("Serper API Key is missing")
            return []

        try:
            logging.info(f"Making Serper API request for claim: {claim[:100]}...")
            headers = {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json'
            }
            payload = json.dumps({
                "q": claim,
                "num": 5
            })

            response = await self.http_client.post(
                'https://google.serper.dev/search',
                headers=headers,
                content=payload
            )
            logging.info(f"Serper API response status: {response.status_code}")

            if response.status_code != 200:
                logging.error(f"Serper API error: {response.text}")
                return []

            data = response.json()
            evidence = []

            # Extract organic search results
            for result in data.get('organic', []):
                evidence.append({
                    "title": result.get('title', ''),
                    "snippet": result.get('snippet', ''),
                    "link": result.get('link', '')
                })

            logging.info(f"Found {len(evidence)} pieces of evidence from Serper API")
            return evidence
        except Exception as e:
            logging.error(f"Error in Serper API request: {str(e)}", exc_info=True)
            return []

    def _combine_verification_results(self, results: Dict[str, Any], claim: str) -> Dict[str, Any]:
        """
        Combine results from different verification methods into a final result.

        Args:
            results: Dictionary with results from different verification methods
            claim: The original claim

        Returns:
            Dictionary with combined verification results
        """
        google_result = results.get("google", {})
        minicheck_result = results.get("minicheck", {})
        evidence = results.get("evidence", [])

        # Calculate weighted score
        google_score = google_result.get("score", 50)
        minicheck_score = minicheck_result.get("score", 50)

        # If Google found fact checks, give them more weight
        if google_result.get("found", False):
            final_score = (google_score * 0.7) + (minicheck_score * 0.3)
        else:
            # Otherwise, rely more on MiniCheck
            final_score = (google_score * 0.3) + (minicheck_score * 0.7)

        # Determine verdict based on final score
        if final_score >= 70:
            verdict = "supported"
        elif final_score <= 30:
            verdict = "refuted"
        else:
            verdict = "neutral"

        # Combine sources
        sources = google_result.get("sources", [])

        # Generate explanation
        explanation = minicheck_result.get("explanation", "")
        if not explanation and google_result.get("reviews", []):
            explanation = f"Based on fact checks from {len(google_result['reviews'])} sources."

        return {
            "claim": claim,
            "score": final_score,
            "verdict": verdict,
            "explanation": explanation,
            "sources": sources,
            "evidence": evidence,
            "reviews": google_result.get("reviews", [])
        }

# Create a singleton instance
fact_checker = FactChecker()