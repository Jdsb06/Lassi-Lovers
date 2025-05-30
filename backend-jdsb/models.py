from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from enum import Enum

class VerificationStatus(str, Enum):
    """Enum for verification status"""
    SUPPORTED = "supported"
    REFUTED = "refuted"
    NEUTRAL = "neutral"

class ClaimRequest(BaseModel):
    """Request model for claim verification"""
    text: str
    context: Optional[str] = None

class UrlRequest(BaseModel):
    """Request model for URL verification"""
    url: str

class Evidence(BaseModel):
    """Model for evidence items"""
    title: Optional[str] = Field(None, description="Title of the evidence")
    snippet: Optional[str] = Field(None, description="Snippet of the evidence")
    link: Optional[str] = Field(None, description="Link to the evidence")

class Review(BaseModel):
    """Model for fact check reviews"""
    publisher: str = Field(..., description="Publisher of the review")
    rating: str = Field(..., description="Rating given by the publisher")
    url: Optional[str] = Field(None, description="URL of the review")
    title: Optional[str] = Field(None, description="Title of the review")

class Claim(BaseModel):
    """Model for a verified claim"""
    text: str = Field(..., description="The claim text")
    score: float = Field(..., description="Verification score (0-100)", ge=0, le=100)
    verdict: VerificationStatus = Field(..., description="Verification verdict")
    explanation: Optional[str] = Field(None, description="Explanation of the verification")
    sources: List[str] = Field(default_factory=list, description="Sources for the verification")
    evidence: List[Evidence] = Field(default_factory=list, description="Evidence for the claim")
    reviews: List[Review] = Field(default_factory=list, description="Fact check reviews")

class SentimentResponse(BaseModel):
    sentiment: str
    score: float
    positive_words: Optional[int] = None
    negative_words: Optional[int] = None

class ClaimResponse(BaseModel):
    text: str
    score: float
    verdict: str
    explanation: Optional[str] = None
    sources: List[str] = []
    evidence: List[Dict[str, Any]] = []
    reviews: List[Dict[str, Any]] = []
    chatgpt_score: Optional[float] = Field(None, description="Score from ChatGPT comparison (0-100)")
    chatgpt_explanation: Optional[str] = Field(None, description="Explanation from ChatGPT comparison")
    gpt_score: Optional[float] = Field(None, description="Score from GPT scoring (0-100)")
    gpt_explanation: Optional[str] = Field(None, description="Explanation from GPT scoring")

class AnalysisResponse(BaseModel):
    """Response model for text analysis"""
    claims: List[ClaimResponse]
    sentiment: SentimentResponse
    processing_time: Optional[float] = None

class ErrorResponse(BaseModel):
    """Response model for errors"""
    error: str = Field(..., description="Error message")
    detail: str

class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    components: Dict[str, bool] = Field(..., description="Status of individual components")

class TokenRequest(BaseModel):
    """Request model for token generation"""
    username: str
    password: str

class TokenResponse(BaseModel):
    """Response model for token generation"""
    access_token: str
    token_type: str
    expires_in: int

class SimilarClaim(BaseModel):
    """Model for similar claims"""
    id: int = Field(..., description="ID of the claim")
    text: str = Field(..., description="The claim text")
    score: float = Field(..., description="Verification score")
    verdict: VerificationStatus = Field(..., description="Verification verdict")
    similarity: float = Field(..., description="Similarity score to the query")

class SimilarClaimsResponse(BaseModel):
    """Response model for similar claims search"""
    query: str
    results: List[Dict[str, Any]]