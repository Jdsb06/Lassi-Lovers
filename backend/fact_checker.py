import os
import requests
import json
import time
from typing import Dict, List, Any, Optional, Tuple
import httpx
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import redis
from functools import lru_cache
import hashlib

# Load environment variables
API_KEY = os.getenv("GOOGLE_API_KEY")
FACT_CHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
SERPER_API_KEY = os.getenv("SERPER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL_PATH = os.getenv("MODEL_PATH", "lytang/MiniCheck-Flan-T5-Large")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Initialize Redis client for caching if available
try:
    redis_client = redis.from_url(REDIS_URL)
    REDIS_AVAILABLE = True
except:
    REDIS_AVAILABLE = False
    print("Warning: Redis not available. Caching will be disabled.")

# Initialize the MiniCheck model
@lru_cache(maxsize=1)
def get_model_and_tokenizer():
    """
    Load the MiniCheck model and tokenizer with caching to avoid reloading.
    """
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)
        return model, tokenizer
    except Exception as e:
        print(f"Error loading model: {e}")
        return None, None

class FactChecker:
    def __init__(self):
        """Initialize the fact checker with necessary components."""
        self.http_client = httpx.AsyncClient(timeout=30.0)

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
            return {"score": 50, "sources": [], "available": False}

        params = {
            "query": claim,
            "key": API_KEY,
            "pageSize": 5  # Limit to 5 results for simplicity
        }

        try:
            response = await self.http_client.get(FACT_CHECK_URL, params=params)
            if response.status_code != 200:
                return {"score": 50, "sources": [], "available": False}

            data = response.json()
            if not data.get("claims"):
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
        Verify a claim using the MiniCheck model.

        Args:
            claim: The claim to verify
            context: Optional context for the claim

        Returns:
            Dictionary with verification results from MiniCheck
        """
        model, tokenizer = get_model_and_tokenizer()
        if model is None or tokenizer is None:
            return {"score": 50, "explanation": "Model not available", "available": False}

        try:
            # Prepare input for the model
            input_text = f"Claim: {claim}"
            if context:
                input_text += f"\nContext: {context}"

            # Tokenize and generate prediction
            inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)
            outputs = model.generate(
                inputs.input_ids, 
                max_length=100, 
                num_beams=4,
                early_stopping=True
            )

            # Decode the prediction
            prediction = tokenizer.decode(outputs[0], skip_special_tokens=True)

            # Parse the prediction
            if "supported" in prediction.lower() or "true" in prediction.lower():
                score = 90  # Supported claim
                verdict = "supported"
            elif "refuted" in prediction.lower() or "false" in prediction.lower():
                score = 10  # Refuted claim
                verdict = "refuted"
            else:
                score = 50  # Neutral or unclear
                verdict = "neutral"

            return {
                "score": score,
                "explanation": prediction,
                "verdict": verdict,
                "available": True
            }
        except Exception as e:
            return {"score": 50, "explanation": f"Error: {str(e)}", "available": False}

    async def _search_for_evidence(self, claim: str) -> List[Dict[str, Any]]:
        """
        Search for evidence related to the claim using Serper API.

        Args:
            claim: The claim to search for

        Returns:
            List of evidence items with titles, snippets, and links
        """
        if not SERPER_API_KEY:
            return []

        try:
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

            if response.status_code != 200:
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

            return evidence
        except Exception:
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
