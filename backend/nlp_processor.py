import spacy
from typing import List, Dict, Any
import re

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If model is not installed, use small model
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_claims(text: str) -> List[str]:
    """
    Extract potential claims from text.
    
    Args:
        text: Input text to analyze
        
    Returns:
        List of extracted claims
    """
    # Basic preprocessing
    text = text.strip()
    
    # Convert questions to statements if possible
    text = convert_question_to_statement(text)
    
    # If text is too short, treat the whole text as one claim
    if len(text) < 50:
        return [text]
    
    # Process text with spaCy
    doc = nlp(text)
    
    # Split into sentences
    sentences = [sent.text.strip() for sent in doc.sents]
    
    # Filter sentences that are likely to be claims
    claims = []
    for sentence in sentences:
        if is_claim(sentence):
            claims.append(sentence)
    
    # If no claims found, return the original text as a claim
    if not claims:
        claims = [text]
    
    return claims

def convert_question_to_statement(text: str) -> str:
    """Convert a question to a statement if possible."""
    # Remove question marks
    text = text.replace("?", "")
    
    # Common question starters to remove
    question_starters = [
        "is ", "are ", "was ", "were ", "will ", "do ", "does ", "did ",
        "can ", "could ", "should ", "would ", "has ", "have ", "had "
    ]
    
    text_lower = text.lower()
    for starter in question_starters:
        if text_lower.startswith(starter):
            # Remove the starter and capitalize the first letter
            text = text[len(starter):].strip()
            text = text[0].upper() + text[1:] if text else text
            break
    
    return text

def is_claim(text: str) -> bool:
    """
    Check if a piece of text is likely to be a claim.
    
    Args:
        text: Text to check
        
    Returns:
        True if the text is likely to be a claim
    """
    # Process with spaCy
    doc = nlp(text)
    
    # Check for named entities (indicates factual content)
    has_entities = len(doc.ents) > 0
    
    # Check for numbers (often part of factual claims)
    has_numbers = bool(re.search(r'\d', text))
    
    # Check for common claim indicators
    claim_indicators = [
        "is", "are", "was", "were", "will be",
        "has", "have", "had",
        "can", "could", "should", "would",
        "must", "may", "might",
        "because", "therefore", "thus", "hence",
        "proves", "shows", "demonstrates",
        "always", "never", "every", "all", "none"
    ]
    
    has_indicators = any(indicator in text.lower() for indicator in claim_indicators)
    
    # Combine checks
    return has_entities or has_numbers or has_indicators

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """
    Analyze the sentiment of text.
    
    Args:
        text: Text to analyze
        
    Returns:
        Dictionary with sentiment analysis results
    """
    # Process with spaCy
    doc = nlp(text)
    
    # Simple rule-based sentiment analysis
    positive_words = ["good", "great", "excellent", "amazing", "wonderful", "best", "better", "positive", "true", "correct"]
    negative_words = ["bad", "terrible", "awful", "wrong", "false", "incorrect", "worst", "worse", "negative", "poor"]
    
    # Count positive and negative words
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    # Calculate sentiment
    if positive_count > negative_count:
        sentiment = "positive"
        score = min(1.0, 0.5 + (positive_count - negative_count) * 0.1)
    elif negative_count > positive_count:
        sentiment = "negative"
        score = max(0.0, 0.5 - (negative_count - positive_count) * 0.1)
    else:
        sentiment = "neutral"
        score = 0.5
    
    return {
        "sentiment": sentiment,
        "score": score,
        "positive_words": positive_count,
        "negative_words": negative_count
    }
