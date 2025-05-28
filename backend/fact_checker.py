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
import openai
import google.generativeai as genai
import asyncio
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# Load environment variables
API_KEY = os.getenv("GOOGLE_API_KEY")
FACT_CHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
SERPER_API_KEY = os.getenv("SERPER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Initialize Redis client for caching if available
try:
    redis_client = redis.from_url(REDIS_URL)
    REDIS_AVAILABLE = True
except:
    REDIS_AVAILABLE = False
    print("Warning: Redis not available. Caching will be disabled.")

# Configure OpenAI API key
openai.api_key = OPENAI_API_KEY

# Configure Google Generative AI
if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("Warning: GOOGLE_API_KEY not found. Gemini verification will be disabled.")

def fact_checker(claim: str) -> Dict[str, Any]:
    """
    Synchronous wrapper for fact checking functionality.
    
    Args:
        claim: The claim to verify
        
    Returns:
        Dictionary with verification results
    """
    try:
        # Basic validation
        if not claim or len(claim.strip()) < 10:
            return {
                "text": claim,
                "score": 50.0,
                "verdict": "neutral",
                "explanation": "Claim too short or empty",
                "sources": [],
                "evidence": [],
                "reviews": []
            }
            
        # For now, return a neutral result
        return {
            "text": claim,
            "score": 50.0,
            "verdict": "neutral",
            "explanation": "Claim requires manual verification",
            "sources": [],
            "evidence": [],
            "reviews": []
        }
        
    except Exception as e:
        return {
            "text": claim,
            "score": 50.0,
            "verdict": "error",
            "explanation": f"Error processing claim: {str(e)}",
            "sources": [],
            "evidence": [],
            "reviews": []
        }

class FactChecker:
    def __init__(self):
        """Initialize the fact checker with necessary components."""
        self.http_client = httpx.AsyncClient(timeout=30.0)
        # Initialize Gemini model
        try:
            self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
            self.generation_config = {
                "temperature": 0.3,
                "top_p": 0.8,
                "top_k": 40
            }
            print("Gemini model initialized successfully")
        except Exception as e:
            print(f"Error initializing Gemini model: {e}")
            self.model = None

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

        # Enhance scoring with AI analysis of evidence
        try:
            llm_result = await self._verify_with_llm(claim, results.get("evidence", []))
            final_result["score"] = llm_result.get("score", final_result.get("score", 50))
            final_result["verdict"] = llm_result.get("verdict", final_result.get("verdict", "neutral"))
            final_result["explanation"] = llm_result.get("explanation", final_result.get("explanation", ""))
        except Exception:
            pass

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
        Verify a claim using the MiniCheck model via Hugging Face Inference API.

        Args:
            claim: The claim to verify
            context: Optional context for the claim

        Returns:
            Dictionary with verification results from MiniCheck
        """
        hf_token = os.getenv("HF_TOKEN")
        if not hf_token:
            return {"score": 50, "explanation": "Hugging Face token not available", "available": False}

        try:
            client = AsyncInferenceClient(token=hf_token, timeout=30.0)
            input_text = f"Claim: {claim}"
            if context:
                input_text += f"\nContext: {context}"

            result = await client.text_generation(
                prompt=input_text,
                model="lytang/MiniCheck-Flan-T5-Large",
                max_new_tokens=100,
                do_sample=True,
                temperature=0.7
            )

            # Parse the generated result
            result_lower = result.lower()
            if "supported" in result_lower or "true" in result_lower:
                score = 90
                verdict = "supported"
            elif "refuted" in result_lower or "false" in result_lower:
                score = 10
                verdict = "refuted"
            else:
                score = 50
                verdict = "neutral"

            return {
                "score": score,
                "explanation": result,
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

    async def _verify_with_llm(self, claim: str, evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Use Gemini to analyze the claim and evidence for a trueness score."""
        if not self.model:
            return {"score": 50, "verdict": "neutral", "explanation": "LLM verification unavailable"}

        # Format evidence for analysis
        evidence_text = "\n".join([
            f"Source {i+1}: {e.get('snippet', 'No text')} (from {e.get('link', 'unknown source')})"
            for i, e in enumerate(evidence)
        ])

        prompt = f"""Analyze this claim based on the evidence provided and give a truthfulness score.

Claim: "{claim}"

Evidence:
{evidence_text}

Give your response in this exact format:
{{
    "score": [a number from 0-100],
    "explanation": [your detailed analysis explaining the score]
}}

Scoring guide:
0-20: Definitely false
21-40: Likely false
41-60: Uncertain/Mixed evidence
61-80: Likely true
81-100: Definitely true"""

        try:
            response = await self.model.generate_content_async(
                prompt,
                generation_config=self.generation_config,
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            
            # Clean and parse response
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            elif response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            try:
                result = json.loads(response_text)
                score = result.get("score", 50)
                if isinstance(score, str):
                    score = float(score)
                score = max(0, min(100, int(score)))
                
                # Determine verdict based on score
                if score >= 81:
                    verdict = "true"
                elif score >= 61:
                    verdict = "likely_true"
                elif score >= 41:
                    verdict = "uncertain"
                elif score >= 21:
                    verdict = "likely_false"
                else:
                    verdict = "false"
                
                return {
                    "score": score,
                    "verdict": verdict,
                    "explanation": result.get("explanation", "Analysis completed.")
                }
            except (json.JSONDecodeError, ValueError) as e:
                print(f"Error parsing response: {str(e)}")
                print(f"Raw response: {response_text}")
                return {
                    "score": 50,
                    "verdict": "uncertain",
                    "explanation": "Could not analyze the claim."
                }
                
        except Exception as e:
            print(f"Error with Gemini API: {str(e)}")
            return {
                "score": 50,
                "verdict": "neutral",
                "explanation": "Error analyzing the claim."
            }

# Create a singleton asynchronous fact checker instance
async_fact_checker = FactChecker()