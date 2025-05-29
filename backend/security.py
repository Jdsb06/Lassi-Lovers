import os
from typing import Dict, Optional
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
import time
import redis
from functools import wraps
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware

# Load environment variables
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-for-jwt-tokens")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Initialize Redis client for rate limiting if available
try:
    redis_client = redis.from_url(REDIS_URL)
    REDIS_AVAILABLE = True
except:
    REDIS_AVAILABLE = False
    print("Warning: Redis not available. Rate limiting will be memory-based.")
    # Simple in-memory rate limiting as fallback
    rate_limit_store = {}

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

class Token(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Token data model"""
    username: Optional[str] = None

class User(BaseModel):
    """User model"""
    username: str
    email: Optional[str] = None
    disabled: Optional[bool] = None

def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Data to encode in the token
        expires_delta: Optional expiration time
        
    Returns:
        JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Optional[User]:
    """
    Get current user from JWT token
    
    Args:
        token: JWT token
        
    Returns:
        User object if token is valid, None otherwise
    """
    if not token:
        return None
        
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            return None
        token_data = TokenData(username=username)
    except JWTError:
        return None
        
    # In a real application, you would look up the user in a database
    # For this example, we'll just create a user object with the username
    user = User(username=token_data.username, email=f"{token_data.username}@example.com")
    return user

def rate_limit(max_requests: int = RATE_LIMIT_PER_MINUTE, window: int = 60):
    """
    Rate limiting decorator
    
    Args:
        max_requests: Maximum number of requests allowed in the time window
        window: Time window in seconds
        
    Returns:
        Decorator function
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            # Get client IP
            client_ip = request.client.host
            
            # Check rate limit
            if REDIS_AVAILABLE:
                # Redis-based rate limiting
                current_time = int(time.time())
                key = f"rate_limit:{client_ip}:{current_time // window}"
                
                # Increment counter
                current = redis_client.incr(key)
                
                # Set expiration if this is the first request in this window
                if current == 1:
                    redis_client.expire(key, window)
                    
                # Check if rate limit exceeded
                if current > max_requests:
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Rate limit exceeded. Please try again later."
                    )
            else:
                # In-memory rate limiting
                current_time = int(time.time())
                key = f"{client_ip}:{current_time // window}"
                
                if key not in rate_limit_store:
                    rate_limit_store[key] = 1
                else:
                    rate_limit_store[key] += 1
                    
                # Clean up old entries
                for k in list(rate_limit_store.keys()):
                    if k.split(":")[1] != str(current_time // window):
                        rate_limit_store.pop(k, None)
                        
                # Check if rate limit exceeded
                if rate_limit_store[key] > max_requests:
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Rate limit exceeded. Please try again later."
                    )
            
            # Call the original function
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

def get_api_key(request: Request) -> Optional[str]:
    """
    Extract API key from request headers
    
    Args:
        request: FastAPI request object
        
    Returns:
        API key if present, None otherwise
    """
    api_key = request.headers.get("X-API-Key")
    return api_key

def validate_api_key(api_key: str) -> bool:
    """
    Validate API key
    
    Args:
        api_key: API key to validate
        
    Returns:
        True if valid, False otherwise
    """
    # In a real application, you would validate against a database
    # For this example, we'll accept any non-empty string
    return bool(api_key)

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = int(time.time())
        window = 60  # 1 minute window
        max_requests = RATE_LIMIT_PER_MINUTE
        
        if REDIS_AVAILABLE:
            key = f"rate_limit:{client_ip}:{current_time // window}"
            current = redis_client.incr(key)
            if current == 1:
                redis_client.expire(key, window)
            if current > max_requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again later."
                )
        else:
            key = f"{client_ip}:{current_time // window}"
            if key not in rate_limit_store:
                rate_limit_store[key] = 1
            else:
                rate_limit_store[key] += 1
            for k in list(rate_limit_store.keys()):
                if k.split(":")[1] != str(current_time // window):
                    rate_limit_store.pop(k, None)
            if rate_limit_store[key] > max_requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again later."
                )
        
        response = await call_next(request)
        return response