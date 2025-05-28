import spacy
from typing import List, Dict, Any
import re
from transformers import pipeline

# Add after imports:
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


# Load spaCy model (run `python -m spacy download en_core_web_md` to install)
nlp = spacy.load("en_core_web_sm")

def extract_claims(text: str) -> List[str]:
    """
    Extract sentences likely to be factual claims based on named entities or numbers.

    Args:
        text: The input text to analyze

    Returns:
        A list of extracted claims
    """
    doc = nlp(text)
    claims = []

    for sent in doc.sents:
        sent_text = sent.text.strip()

        # Skip sentences that are too short
        if len(sent_text.split()) < 3:
            continue

        # Skip questions
        if sent_text.endswith("?"):
            continue

        # Check for named entities (e.g., PERSON, ORG, DATE, GPE) or numbers
        if any(ent.label_ in ["PERSON", "ORG", "DATE", "GPE", "CARDINAL", "MONEY", "PERCENT"] 
               for ent in sent.ents) or any(token.pos_ == "NUM" for token in sent):
            claims.append(sent_text)

    return claims

def preprocess_text(text: str) -> str:
    """
    Preprocess text for analysis by removing extra whitespace and normalizing.

    Args:
        text: The input text to preprocess

    Returns:
        Preprocessed text
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)

    return text

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """
    Analyze the sentiment of the text to help contextualize claims.

    Args:
        text: The input text to analyze

    Returns:
        Dictionary with sentiment analysis results
    """
    doc = nlp(text)

    # Simple rule-based sentiment analysis
    positive_words = 0
    negative_words = 0

    for token in doc:
        if token.pos_ in ["ADJ", "ADV", "VERB"]:
            if token.is_stop:
                continue
            if token.has_vector:
                # Use spaCy's word vectors for simple sentiment detection
                similarity_to_good = token.similarity(nlp("good"))
                similarity_to_bad = token.similarity(nlp("bad"))

                if similarity_to_good > 0.5:
                    positive_words += 1
                if similarity_to_bad > 0.5:
                    negative_words += 1

    total = positive_words + negative_words
    if total == 0:
        sentiment = "neutral"
        score = 0.5
    else:
        score = positive_words / total
        if score > 0.6:
            sentiment = "positive"
        elif score < 0.4:
            sentiment = "negative"
        else:
            sentiment = "neutral"

    return {
        "sentiment": sentiment,
        "score": score,
        "positive_words": positive_words,
        "negative_words": negative_words
    }
