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
    try:
        genai.configure(api_key=API_KEY)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.generation_config = {
            "temperature": 0.3,
            "top_p": 0.8,
            "top_k": 40
        }
        print("Gemini model initialized successfully")
    except Exception as e:
        print(f"Error configuring Google Generative AI: {str(e)}")
else:
    print("Warning: GOOGLE_API_KEY not found. Please set the GOOGLE_API_KEY environment variable.")

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
            self.model = genai.GenerativeModel('gemini-2.0-flash')
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

            # Add GPT scoring if we have an explanation
            if final_result.get("explanation"):
                gpt_result = await get_gpt_score(claim, final_result["explanation"])
                if gpt_result["gpt_score"] is not None:
                    final_result["gpt_score"] = gpt_result["gpt_score"]
                    final_result["gpt_explanation"] = gpt_result["gpt_explanation"]
        except Exception as e:
            print(f"Error in verification: {str(e)}")

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
            print("LLM verification unavailable - Gemini model not initialized")
            return {"score": 50, "verdict": "neutral", "explanation": "LLM verification unavailable - Gemini model not initialized"}

        # Format evidence for analysis
        evidence_text = "\n".join([
            f"Source {i+1}: {e.get('snippet', 'No text')} (from {e.get('link', 'unknown source')})"
            for i, e in enumerate(evidence)
        ])

        prompt = f"""Analyze this claim based on the evidence provided and determine its truthfulness.

Claim: "{claim}"

Evidence:
{evidence_text}

Please analyze the claim and evidence carefully. Compare the claim's content with the evidence and determine how well they align.

Give your response in this exact format:
{{
    "score": [a number from 0-100, where 0 means completely false and 100 means completely true],
    "claim_analysis": [detailed analysis of the claim's key points],
    "evidence_analysis": [analysis of how well the evidence supports or refutes each key point],
    "explanation": [your final conclusion explaining the score]
}}

Scoring guide:
0-20: Definitely false - Evidence directly contradicts the claim
21-40: Likely false - Evidence mostly contradicts the claim
41-60: Uncertain/Mixed - Evidence is inconclusive or contradictory
61-80: Likely true - Evidence mostly supports the claim
81-100: Definitely true - Evidence strongly supports all aspects of the claim"""

        try:
            print(f"Sending request to Gemini API with claim: {claim[:100]}...")  # Log first 100 chars of claim
            
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
            
            print("Received response from Gemini API")
            
            # Clean and parse response
            response_text = response.text.strip()
            print(f"Raw response from Gemini: {response_text[:200]}...")  # Log first 200 chars of response
            
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            elif response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            # Attempt to parse JSON, sanitize if necessary, or fallback to Python literal eval
            import ast, re
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e} - attempting to sanitize response")
                # Remove trailing commas that may break strict JSON parsing
                sanitized = re.sub(r',\s*([\]}])', r'\1', response_text)
                try:
                    result = json.loads(sanitized)
                except json.JSONDecodeError:
                    try:
                        # Fallback: treat response as Python literal
                        result = ast.literal_eval(response_text)
                    except Exception as e2:
                        print(f"Error parsing Gemini response: {e2}")
                        print(f"Raw response that couldn't be parsed: {response_text}")
                        return {
                            "score": 50,
                            "verdict": "uncertain",
                            "explanation": f"Could not analyze the claim. Error: {e2}"
                        }
            # Retrieve raw score
            score = result.get("score", 50)
            # Handle case where score is returned as a list
            if isinstance(score, list):
                score = score[0] if score else 50
            # Convert string scores to float
            if isinstance(score, str):
                try:
                    score = float(score)
                except ValueError:
                    score = 50
            # Clamp score to integer between 0 and 100
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
            
            # Construct a detailed explanation combining all analyses
            explanation = f"""Claim Analysis: {result.get('claim_analysis', '')}

Evidence Analysis: {result.get('evidence_analysis', '')}

Final Verdict: {result.get('explanation', '')}

Score: {score}/100 - {verdict.replace('_', ' ').title()}"""
            
            return {
                "score": score,
                "verdict": verdict,
                "explanation": explanation
            }
        except Exception as e:
            print(f"Error with Gemini API: {str(e)}")
            print(f"Full error details: {str(e.__class__.__name__)}: {str(e)}")
            return {
                "score": 50,
                "verdict": "neutral",
                "explanation": f"Error analyzing the claim: {str(e)}"
            }

async def compare_with_chatgpt(claim: str, gemini_explanation: str) -> Dict[str, Any]:
    """
    Compare Gemini's explanation with the claim using ChatGPT to generate a score.
    
    Args:
        claim: The original claim text
        gemini_explanation: The explanation provided by Gemini
        
    Returns:
        Dictionary with the comparison score and explanation
    """
    if not OPENAI_API_KEY:
        return {
            "score": 50,
            "explanation": "OpenAI API key not available for scoring"
        }
        
    try:
        prompt = f"""Compare this claim with Gemini's explanation and determine a truthfulness score.

Claim: "{claim}"

Gemini's Analysis: {gemini_explanation}

Based on how well Gemini's explanation supports or refutes the claim, provide a score from 0 to 100:
- 0: Completely false
- 100: Completely true

Respond in this exact JSON format:
{{
    "score": [number between 0-100],
    "explanation": [brief explanation of your scoring]
}}"""

        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a fact-checking scoring system. Your job is to compare claims with explanations and provide numerical scores."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=150
        )
        
        result = json.loads(response.choices[0].message.content)
        return {
            "score": min(100, max(0, int(result["score"]))),  # Ensure score is 0-100
            "explanation": result["explanation"]
        }
        
    except Exception as e:
        print(f"Error in ChatGPT comparison: {str(e)}")
        return {
            "score": 50,
            "explanation": f"Error comparing with ChatGPT: {str(e)}"
        }

async def get_gpt_score(claim: str, explanation: str) -> Dict[str, Any]:
    """Get a score from GPT by comparing the claim against the explanation."""
    if not OPENAI_API_KEY:
        return {
            "gpt_score": None,
            "gpt_explanation": "OpenAI API key not set"
        }

    try:
        prompt = f"""Analyze this claim and explanation to determine if the claim is true or false.

Claim: "{claim}"

Explanation from analysis: "{explanation}"

Based on how well the explanation proves or disproves the claim, give a score:
0 = Completely false
100 = Completely true

Respond in this exact JSON format:
{{
    "score": [number 0-100],
    "explanation": [brief explanation of why you gave this score]
}}"""

        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a fact-checking scoring system. Score claims based on their explanations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=150
        )

        try:
            result = json.loads(response.choices[0].message.content)
            return {
                "gpt_score": min(100, max(0, int(result["score"]))),
                "gpt_explanation": result["explanation"]
            }
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Error parsing GPT response: {e}")
            return {
                "gpt_score": None,
                "gpt_explanation": f"Error parsing GPT response: {e}"
            }

    except Exception as e:
        print(f"Error calling GPT API: {e}")
        return {
            "gpt_score": None,
            "gpt_explanation": f"Error calling GPT API: {e}"
        }

# Create a singleton asynchronous fact checker instance
async_fact_checker = FactChecker()