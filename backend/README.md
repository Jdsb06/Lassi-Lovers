# Fact-Checking Backend API

This is a comprehensive backend system for automated fact-checking, built according to modern best practices. The system uses FastAPI, Python, and specialized language models to detect claims, verify their accuracy, and provide educational feedback to users.

## Features

- **Claim Detection**: Identifies factual statements within user-submitted text using spaCy NLP
- **Fact Verification**: Cross-references claims against reliable sources using multiple verification methods
- **Result Presentation**: Formats results with trust scores, explanations, and evidence
- **URL Analysis**: Extracts and analyzes text content from web pages
- **Vector Similarity Search**: Finds semantically similar claims using vector embeddings
- **Caching**: Reduces redundant API calls and improves performance
- **Rate Limiting**: Prevents abuse and manages operational costs
- **Authentication**: Secures API access with JWT tokens

## Architecture

The backend follows a modular design with these primary components:

1. **FastAPI Application**: Handles HTTP requests, input validation, and response formatting
2. **NLP Processor**: Extracts and preprocesses claims from text
3. **Fact Checker**: Verifies claims using multiple sources
4. **Database**: Stores verification results and enables similarity search
5. **Security**: Implements authentication and rate limiting
6. **Utilities**: Provides helper functions for various tasks

## Technology Stack

- **FastAPI**: High-performance web framework
- **spaCy**: Natural language processing
- **MiniCheck-Flan-T5-Large**: Specialized fact-checking model
- **PostgreSQL**: Relational database for metadata
- **Qdrant**: Vector database for semantic search
- **Redis**: Caching and rate limiting
- **JWT**: Authentication tokens

## Setup and Installation

### Prerequisites

- Python 3.8+
- PostgreSQL
- Redis (optional, but recommended)
- Qdrant (optional, but recommended for vector search)

### Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Install spaCy model:
   ```
   python -m spacy download en_core_web_sm
   ```
5. Configure environment variables in `.env` file:
   ```
   SERPER_API_KEY="your-serper-api-key"
   OPENAI_API_KEY="your-openai-api-key"
   GOOGLE_API_KEY="your-google-api-key"
   DATABASE_URL="postgresql://user:password@localhost:5432/factcheck"
   REDIS_URL="redis://localhost:6379/0"
   VECTOR_DB_URL="http://localhost:6333"
   RATE_LIMIT_PER_MINUTE=60
   JWT_SECRET="your-secret-key-for-jwt-tokens"
   MODEL_PATH="lytang/MiniCheck-Flan-T5-Large"
   ```

### Running the API

Start the API server:

```
python app.py
```

Or with Uvicorn directly:

```
uvicorn app:app --host 0.0.0.0 --port 5000 --reload
```

The API will be available at http://localhost:5000

### Testing

Run the test script to verify the API is working correctly:

```
python test_api.py
```

## API Endpoints

### Authentication

- `POST /token`: Generate JWT token for API access

### Fact Checking

- `POST /analyze`: Analyze text for factual claims
- `POST /analyze_url`: Analyze URL for factual claims
- `POST /similar_claims`: Find claims similar to the provided claim

### System

- `GET /health`: Check API health
- `GET /`: API information

## API Documentation

Once the API is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

## Implementation Details

### Claim Detection

The system uses spaCy to identify sentences that are likely to contain factual claims based on the presence of named entities (PERSON, ORG, DATE, GPE) or numerical information. It filters out questions and short sentences that are unlikely to be verifiable claims.

### Fact Verification

Claims are verified using multiple methods:

1. **Google Fact Check Tools API**: Queries Google's database of fact checks from reputable organizations
2. **MiniCheck-Flan-T5-Large**: A specialized model for fact-checking that achieves GPT-4-level performance at much lower cost
3. **Evidence Search**: Uses Serper API to find relevant evidence for claims

The results from these methods are combined using a weighted scoring system to produce a final verdict and confidence score.

### Vector Similarity Search

The system stores vector embeddings of verified claims in a vector database (Qdrant), enabling semantic similarity search. This allows the system to find previously verified claims that are semantically similar to new claims, reducing redundant verification and improving response times.

### Caching

The system implements caching at multiple levels:

1. **Redis**: Caches verification results to avoid redundant API calls
2. **LRU Cache**: Caches model loading to improve performance
3. **Vector Database**: Enables fast retrieval of similar claims

### Rate Limiting

The system implements rate limiting to prevent abuse and manage operational costs. It supports both Redis-based and in-memory rate limiting, with configurable limits per time window.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Backend Documentation

## Overview
The backend is a FastAPI application designed for fact-checking claims. It provides endpoints for analyzing text, verifying claims, and searching for similar claims.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   Create a `.env` file in the `backend` directory with the following variables:
   ```
   SERPER_API_KEY="your-serper-api-key"
   OPENAI_API_KEY="your-openai-api-key"
   GOOGLE_API_KEY="your-google-api-key"
   DATABASE_URL="postgresql://user:password@localhost:5432/factcheck"
   REDIS_URL="redis://localhost:6379/0"
   VECTOR_DB_URL="http://localhost:6333"
   RATE_LIMIT_PER_MINUTE=60
   JWT_SECRET="your-secret-key-for-jwt-tokens"
   MODEL_PATH="lytang/MiniCheck-Flan-T5-Large"
   ```

5. Start the server:
   ```bash
   uvicorn backend.app:app --host 0.0.0.0 --port 5000 --reload
   ```

## API Endpoints

### Authentication
- **POST /token**: Generate a JWT token for API access.
  - Request Body:
    ```json
    {
      "username": "your-username",
      "password": "your-password"
    }
    ```
  - Response:
    ```json
    {
      "access_token": "your-jwt-token",
      "token_type": "bearer",
      "expires_in": 1800
    }
    ```

### Fact Checking
- **POST /analyze**: Analyze text for factual claims.
  - Request Body:
    ```json
    {
      "text": "Your text to analyze"
    }
    ```
  - Response:
    ```json
    {
      "claims": [],
      "sentiment": {
        "sentiment": "positive",
        "score": 1.0,
        "positive_words": 1,
        "negative_words": 0
      },
      "processing_time": null
    }
    ```

- **POST /analyze_url**: Analyze a URL for factual claims.
  - Request Body:
    ```json
    {
      "url": "https://example.com"
    }
    ```
  - Response:
    ```json
    {
      "claims": [],
      "sentiment": {
        "sentiment": "neutral",
        "score": 0.5,
        "positive_words": 0,
        "negative_words": 0
      },
      "processing_time": null
    }
    ```

- **POST /similar_claims**: Find claims similar to the provided claim.
  - Request Body:
    ```json
    {
      "text": "Your claim to find similar claims for"
    }
    ```
  - Response:
    ```json
    {
      "query": "Your claim to find similar claims for",
      "results": []
    }
    ```

### System
- **GET /health**: Check the health of the API.
  - Response:
    ```json
    {
      "status": "healthy",
      "version": "1.0.0",
      "components": {
        "database": true,
        "vector_db": true,
        "fact_checker": true
      }
    }
    ```

## Usage Examples
- Use the `/token` endpoint to obtain a JWT token for authentication.
- Use the `/analyze` endpoint to verify claims in text.
- Use the `/analyze_url` endpoint to verify claims from a URL.
- Use the `/similar_claims` endpoint to find similar claims.

## Additional Information
- The backend uses FastAPI for routing and request handling.
- It integrates with Hugging Face for text generation and fact-checking.
- Redis is used for caching results to improve performance.

For more details, refer to the codebase and inline documentation.