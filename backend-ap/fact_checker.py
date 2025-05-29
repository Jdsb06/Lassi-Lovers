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
gemini_model = None
if API_KEY:
    try:
        genai.configure(api_key=API_KEY)
        # Use gemini-2.0-flash which is the current stable model
        gemini_model = genai.GenerativeModel('gemini-2.0-flash')
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
        self.model = gemini_model
        self.generation_config = {
            "temperature": 0.3,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 1024,
        }

    async def verify_claim(self, claim: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Verify a claim using multiple verification methods and return a comprehensive result.
        """
        try:
            # Basic validation
            if not claim or len(claim.strip()) < 3:
                return {
                    "text": claim,
                    "score": 50.0,
                    "verdict": "neutral",
                    "explanation": "Claim too short or empty",
                    "sources": [],
                    "evidence": [],
                    "reviews": []
                }

            # Generate cache key
            cache_key = f"factcheck:{hashlib.md5((claim + (context or '')).encode()).hexdigest()}"

            # Try to get cached result
            if REDIS_AVAILABLE:
                cached_result = redis_client.get(cache_key)
                if cached_result:
                    return json.loads(cached_result)

            # Gather evidence first
            evidence = await self._search_for_evidence(claim)
            
            # Perform AI analysis with Gemini; if it fails, return neutral
            try:
                ai_result = await self._verify_with_llm(claim, evidence)
            except Exception as e:
                print(f"Gemini analysis failed: {str(e)}")
                ai_result = {
                    "score": 50,
                    "verdict": "neutral",
                    "explanation": f"Error in AI analysis: {str(e)}"
                }

            # Secondary check with GPT-3.5 Turbo
            try:
                gpt_res = await get_gpt_score(claim, ai_result.get("explanation", ""))
                gpt_score = gpt_res.get("gpt_score")
                gpt_explanation = gpt_res.get("gpt_explanation")
            except Exception as e:
                print(f"GPT secondary check failed: {str(e)}")
                gpt_score = None
                gpt_explanation = f"Error in GPT secondary check: {str(e)}"

            # Combine all results
            final_result = {
                "text": claim,
                "score": ai_result.get("score", 50),
                "verdict": ai_result.get("verdict", "neutral"),
                "explanation": ai_result.get("explanation", ""),
                "evidence": evidence,
                "sources": [e.get("link") for e in evidence if e.get("link")],
                "reviews": [],
                "gpt_score": gpt_score,
                "gpt_explanation": gpt_explanation
            }

            # Cache the result
            if REDIS_AVAILABLE:
                redis_client.setex(cache_key, 3600 * 24, json.dumps(final_result))

            return final_result

        except Exception as e:
            print(f"Error in verify_claim: {str(e)}")
            return {
                "text": claim,
                "score": 50.0,
                "verdict": "error",
                "explanation": f"Error verifying claim: {str(e)}",
                "sources": [],
                "evidence": [],
                "reviews": []
            }

    async def _verify_with_llm(self, claim: str, evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Use Gemini to analyze the claim and evidence."""
        if not self.model:
            raise Exception("Gemini model not available")

        try:
            # Format evidence for the model
            evidence_text = "\n".join([
                f"Source {i+1}: {e.get('title', 'Unknown')}\n{e.get('snippet', '')}"
                for i, e in enumerate(evidence[:5])  # Limit to top 5 pieces of evidence
            ])

            # Prompt for analysis
            prompt = f"""Analyze this claim and determine if it is true or false based on the evidence provided.

Claim: "{claim}"

Evidence:
{evidence_text}

Please analyze the claim carefully and provide:
1. A score from 0-100 (where 0 is completely false and 100 is completely true)
2. A detailed explanation of your reasoning
3. A clear verdict (true/false/partial)

Format your response exactly like this:
SCORE: [number 0-100]
VERDICT: [true/false/partial]
EXPLANATION: [your detailed analysis]"""

            # Get response from Gemini
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt,
                generation_config=self.generation_config,
                safety_settings=[
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            )

            # Parse response
            response_text = response.text
            lines = response_text.split('\n')
            
            score = 50
            verdict = "neutral"
            explanation = ""

            for line in lines:
                if line.startswith("SCORE:"):
                    try:
                        score = int(line.split(":")[1].strip())
                        score = max(0, min(100, score))  # Clamp between 0-100
                    except:
                        pass
                elif line.startswith("VERDICT:"):
                    v = line.split(":")[1].strip().lower()
                    if v in ["true", "false", "partial"]:
                        verdict = v
                elif line.startswith("EXPLANATION:"):
                    explanation = line.split(":", 1)[1].strip()

            if not explanation and len(lines) > 2:
                # If no explicit explanation found, use all lines after VERDICT
                explanation = "\n".join(lines[2:]).strip()

            return {
                "score": score,
                "verdict": verdict,
                "explanation": explanation or "No explanation provided"
            }

        except Exception as e:
            print(f"Error in Gemini verification: {str(e)}")
            raise  # Re-raise to trigger GPT fallback

    async def _search_for_evidence(self, claim: str) -> List[Dict[str, Any]]:
        """Search for evidence using Serper API."""
        if not SERPER_API_KEY:
            return []

        try:
            # Prepare search query - add fact check keywords
            search_query = f"fact check {claim}"
            
            headers = {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json'
            }
            
            payload = {
                "q": search_query,
                "num": 10,  # Get more results for better analysis
                "gl": "us",  # Set to US results for consistency
                "hl": "en"   # Set to English
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    'https://google.serper.dev/search',
                    headers=headers,
                    json=payload,
                    timeout=20.0
                )
                
            if response.status_code == 200:
                results = response.json()
                
                # Extract and clean evidence
                evidence = []
                seen_urls = set()  # To avoid duplicates
                
                # Process organic results
                for result in results.get('organic', []):
                    url = result.get('link', '')
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        evidence.append({
                            'title': result.get('title', '').strip(),
                            'link': url,
                            'snippet': result.get('snippet', '').strip(),
                            'source': 'web_search'
                        })
                
                return evidence
            
            return []

        except Exception as e:
            print(f"Error searching for evidence: {str(e)}")
            return []

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

# Export the instance
__all__ = ['async_fact_checker']