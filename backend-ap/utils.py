import os
import time
import httpx
from typing import Dict, List, Any, Optional, Tuple
from bs4 import BeautifulSoup
import re
from transformers import pipeline
from functools import lru_cache
import numpy as np
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import json

# Load environment variables
MODEL_PATH = os.getenv("MODEL_PATH", "lytang/MiniCheck-Flan-T5-Large")

@lru_cache(maxsize=1)
def get_embedding_model():
    """
    Load the embedding model with caching to avoid reloading.
    
    Returns:
        Embedding model pipeline
    """
    try:
        # Use a smaller model for embeddings to save resources
        return pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")
    except Exception as e:
        print(f"Error loading embedding model: {e}")
        return None

async def extract_text_from_url(url: str) -> Tuple[str, Dict[str, Any]]:
    """
    Extract text content from a URL
    
    Args:
        url: URL to extract text from
        
    Returns:
        Tuple of (extracted text, metadata)
    """
    metadata = {
        "title": "",
        "description": "",
        "url": url,
        "site_name": ""
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract metadata
            metadata["title"] = soup.title.string if soup.title else ""
            
            # Extract description from meta tags
            description_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
            if description_tag and description_tag.get("content"):
                metadata["description"] = description_tag["content"]
                
            # Extract site name
            site_name_tag = soup.find("meta", attrs={"property": "og:site_name"})
            if site_name_tag and site_name_tag.get("content"):
                metadata["site_name"] = site_name_tag["content"]
            
            # Extract main content
            # Remove script and style elements
            for script in soup(["script", "style", "header", "footer", "nav"]):
                script.extract()
                
            # Get text
            text = soup.get_text()
            
            # Break into lines and remove leading and trailing space on each
            lines = (line.strip() for line in text.splitlines())
            
            # Break multi-headlines into a line each
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            
            # Remove blank lines
            text = '\n'.join(chunk for chunk in chunks if chunk)
            
            # Clean up text
            text = re.sub(r'\n+', '\n', text)  # Remove multiple newlines
            text = re.sub(r'\s+', ' ', text)   # Remove multiple spaces
            
            return text, metadata
    except Exception as e:
        return f"Error extracting text from URL: {str(e)}", metadata

def get_embedding(text: str) -> Optional[List[float]]:
    """
    Get vector embedding for text
    
    Args:
        text: Text to get embedding for
        
    Returns:
        Vector embedding as list of floats
    """
    model = get_embedding_model()
    if model is None:
        return None
        
    try:
        # Get embedding
        embedding = model(text)
        
        # Extract and average the embeddings
        # The model returns a list with one item, which is a tensor of shape [1, sequence_length, embedding_dim]
        # We average over the sequence_length dimension to get a single vector of shape [embedding_dim]
        embedding_array = np.mean(embedding[0], axis=0)
        
        # Convert to list for storage
        return embedding_array.tolist()
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return None

def measure_execution_time(func):
    """
    Decorator to measure execution time of a function
    
    Args:
        func: Function to measure
        
    Returns:
        Wrapped function that measures execution time
    """
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        end_time = time.time()
        
        # Add execution time to result if it's a dict
        if isinstance(result, dict):
            result["processing_time"] = end_time - start_time
            
        return result
    return wrapper

def clean_html(html_text: str) -> str:
    """
    Clean HTML from text
    
    Args:
        html_text: Text with HTML to clean
        
    Returns:
        Cleaned text
    """
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', html_text)
    
    # Remove extra whitespace
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    
    return clean_text

def truncate_text(text: str, max_length: int = 1000) -> str:
    """
    Truncate text to maximum length while preserving whole sentences
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
        
    # Find the last sentence boundary before max_length
    truncated = text[:max_length]
    last_period = truncated.rfind('.')
    
    if last_period > 0:
        return truncated[:last_period + 1]
    else:
        return truncated

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Add timing header
        response.headers["X-Process-Time"] = str(process_time)
        
        # If response is JSON, add timing to the response body
        if hasattr(response, "body"):
            try:
                body = json.loads(response.body)
                if isinstance(body, dict):
                    body["processing_time"] = process_time
                    response.body = json.dumps(body).encode()
            except:
                pass
                
        return response