# Fact-Checking Backend API Implementation Overview

## Architecture and Design

The Fact-Checking API has been implemented as a comprehensive system for automated fact verification. The system follows a modular architecture with distinct components responsible for specific tasks:

1. **FastAPI Web Framework** - Handles HTTP requests, routing, response formatting, and provides automatic API documentation  
2. **NLP Processor** - Extracts factual claims from text using natural language processing techniques  
3. **Fact Checker** - Verifies claims using multiple verification methods  
4. **Database** - Stores verification results and enables semantic similarity search  
5. **Security Layer** - Implements authentication, rate limiting, and input validation  

## Core Components Breakdown

### 1. FastAPI Application (`app.py`)

The main application entry point implements:  
- API endpoints for text analysis, URL analysis, and token generation  
- CORS middleware for cross-origin requests  
- Error handling and response formatting  
- Health check endpoint to monitor system status  
- Authentication using JWT tokens  
- Rate limiting to prevent abuse  

### 2. NLP Processor (`nlp_processor.py`)

This component:  
- Uses spaCy to process and analyze text  
- Extracts sentences that likely contain factual claims  
- Identifies named entities and numerical information  
- Filters out non-factual content like questions and opinions  
- Performs sentiment analysis on the input text  

### 3. Fact Checker (`fact_checker.py`)

The fact verification engine:  
- Combines multiple verification methods for comprehensive results  
- Integrates with Google Fact Check Tools API for established fact checks  
- Uses the MiniCheck-Flan-T5-Large model for specialized fact-checking  
- Searches for evidence using the Serper API (Google search wrapper)  
- Implements Redis caching to avoid redundant verifications  
- Uses a weighted scoring system to determine final verdicts  

### 4. Database Layer (`database.py`)

The database component:  
- Provides a dual-database approach (PostgreSQL + vector database)  
- Stores verification results in PostgreSQL  
- Stores vector embeddings in Qdrant for semantic search  
- Enables finding similar claims to avoid redundant verification  
- Implements connection pooling and error handling  

### 5. Security (`security.py`)

The security layer:  
- Implements JWT token-based authentication  
- Provides rate limiting using Redis or in-memory implementation  
- Validates user credentials and API keys  
- Protects sensitive endpoints from unauthorized access  

### 6. Utilities (`utils.py`)

Helper functions for various tasks:  
- URL content extraction and processing  
- Text preprocessing and truncation  
- Embedding generation for vector search  
- Performance measurement and logging  
- Error handling and formatting  

## Implementation Details

### Claim Detection Process

1. Text is preprocessed to normalize formatting and remove irrelevant content  
2. spaCy NLP model processes the text to identify sentences and named entities  
3. Sentences containing named entities (PERSON, ORG, DATE, GPE) or numerical data are extracted as potential claims  
4. Short sentences, questions, and subjective statements are filtered out  
5. The resulting list of claims is returned for verification  

### Fact Verification Process

1. For each claim, the system first checks if a similar claim exists in the database  
2. If a highly similar claim is found, the cached result is used  
3. Otherwise, the claim is verified using multiple methods:  
   - Google Fact Check API searches for existing fact checks  
   - MiniCheck model analyzes the claim for factual accuracy  
   - Serper API searches for supporting evidence  
4. Results from different methods are combined using a weighted scoring system  
5. A final verdict (supported/refuted/neutral) is determined based on the score  
6. The result is stored in the database for future reference  

### Vector Similarity Search

1. Claims are converted to vector embeddings (768-dimensional vectors)  
2. Embeddings are stored in the Qdrant vector database  
3. When a new claim is submitted, its embedding is compared to existing claims  
4. Similar claims are retrieved using cosine similarity  
5. If a highly similar claim exists, its verification result is reused  

### Caching Strategy

The system implements multi-level caching:  
1. **Redis Caching**: Verification results are cached using claim text as the key  
2. **LRU Cache**: The ML model is cached in memory to avoid reloading  
3. **Database Caching**: Previous verification results are stored for future use  
4. **Vector Search**: Similar claims are found to avoid redundant verification  

## API Endpoints

The API provides the following endpoints:

1. **`GET /health`**: Health check endpoint  
   - Returns system status and component availability  

2. **`POST /token`**: Authentication endpoint  
   - Accepts username/password  
   - Returns JWT access token  

3. **`POST /analyze`**: Text analysis endpoint  
   - Accepts text input  
   - Returns extracted claims with verification results  

4. **`POST /analyze_url`**: URL analysis endpoint  
   - Accepts URL input  
   - Extracts text from the URL and verifies claims  

5. **`POST /similar_claims`**: Similar claims search  
   - Finds claims similar to the provided claim  
   - Uses vector similarity search  

6. **`GET /`**: Root endpoint  
   - Returns API information and available endpoints  

## Current Status and Issues

The API is currently operational with basic functionality, but there are several issues to address:

### Working Components:
- FastAPI application is running and accessible  
- Health check endpoint is working  
- API endpoints are defined and responding  

### Current Issues:

1. **Machine Learning Model Dependencies**:  
   - PyTorch/TensorFlow not installed, preventing ML model functionality  
   - MiniCheck model can't be loaded, limiting fact-checking capabilities  

2. **Vector Database Connection**:  
   - Connection to Qdrant vector database failing  
   - Vector similarity search functionality not available  

3. **HTTP Method Usage**:  
   - Endpoints designed for POST requests are being accessed with GET  
   - This causes 405 Method Not Allowed errors  

4. **API Key Configuration**:  
   - External API keys (Google, Serper) may not be configured  
   - Limited external verification capabilities  

5. **Database Setup**:  
   - PostgreSQL connection works but tables may not be properly initialized  
   - Vector database not available  

## Next Steps

To fully utilize the system, these steps should be taken:

1. **Install Machine Learning Dependencies**:
   ```shell
   pip install torch
