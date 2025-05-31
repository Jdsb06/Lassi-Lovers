# 🎯 FactChecker Backend

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> A powerful and intelligent fact-checking API that leverages advanced NLP and AI to verify claims and statements.

## 📋 Table of Contents
- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Environment Setup](#-environment-setup)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔍 **Intelligent Fact Checking**: Powered by Google's Gemini AI and advanced NLP models
- 🔐 **Secure Authentication**: JWT-based authentication system
- 📊 **Claim Verification**: Score-based verification system with detailed analysis
- 🌐 **RESTful API**: FastAPI-powered endpoints for seamless integration
- 🔄 **Real-time Processing**: Asynchronous claim verification
- 📝 **Incognito Mode**: Private verification without saving to database
- 🗄️ **Database Integration**: PostgreSQL and ChromaDB for efficient data storage
- 🔍 **NLP Processing**: Advanced text analysis using spaCy and transformers

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FactChecker.git
   cd FactChecker/backend
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

The server will start at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/login` - User authentication
- `GET /api/verify-token` - Token verification

### Claim Management

- `GET /api/claims` - List all claims
- `POST /api/verify_claim` - Verify a new claim

### Example Usage

```python
import requests

# Login
response = requests.post('http://localhost:5000/api/login', 
    json={'username': 'user', 'password': 'pass'})
token = response.json()['access_token']

# Verify a claim
headers = {'Authorization': f'Bearer {token}'}
response = requests.post('http://localhost:5000/api/verify_claim',
    json={'claim': 'Your claim here'},
    headers=headers)
```

## 🏗️ Architecture

The backend follows a modular, layered architecture designed for scalability and maintainability:

### System Overview

```mermaid
graph TB
    subgraph Client Layer
        A[Web Client]
        B[Mobile App]
        C[API Client]
    end

    subgraph API Gateway
        D[FastAPI Server]
        E[Rate Limiter]
        F[Auth Middleware]
    end

    subgraph Core Services
        G[Fact Checker]
        H[NLP Processor]
        I[Evidence Search]
    end

    subgraph Data Layer
        J[(PostgreSQL)]
        K[(ChromaDB)]
        L[(Redis)]
    end

    A & B & C --> D
    D --> E
    E --> F
    F --> G & H & I
    G & H & I --> J & K & L
```

### Process Flows

#### 1. User Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant S as Security
    participant D as Database
    
    U->>A: Login Request
    A->>S: Validate Credentials
    S->>D: Check User
    D-->>S: User Data
    S->>S: Generate JWT
    S-->>A: Token
    A-->>U: Auth Response
```

#### 2. Claim Verification Process
```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant FC as Fact Checker
    participant G as Gemini AI
    participant N as NLP
    participant DB as Database
    
    U->>A: Submit Claim
    A->>FC: Process Claim
    FC->>N: Extract Entities
    N-->>FC: Entities
    FC->>G: Verify Claim
    G-->>FC: Analysis
    FC->>DB: Store Result
    DB-->>FC: Confirmation
    FC-->>A: Verification Result
    A-->>U: Response
```

#### 3. Data Flow Architecture
```mermaid
graph TB
    subgraph Input Layer
        A[User Input]
        B[API Requests]
        C[Web Scraping]
    end
    
    subgraph Processing Layer
        D[Text Preprocessing]
        E[Entity Extraction]
        F[Claim Analysis]
    end
    
    subgraph Storage Layer
        G[(PostgreSQL)]
        H[(ChromaDB)]
        I[(Redis Cache)]
    end
    
    subgraph Output Layer
        J[API Response]
        K[Web Interface]
        L[Analytics]
    end
    
    A & B & C --> D
    D --> E
    E --> F
    F --> G & H
    G & H --> I
    I --> J & K & L
```

#### 4. Caching Strategy
```mermaid
graph TD
    subgraph Cache Management
        A[Request] --> B{Cache Check}
        B -->|Hit| C[Return Cached]
        B -->|Miss| D[Process Request]
        D --> E[Update Cache]
        E --> F[Return Response]
    end
    
    subgraph Cache Invalidation
        G[Data Update] --> H[Invalidate Cache]
        H --> I[Update Database]
        I --> J[Refresh Cache]
    end
```

#### 5. Error Handling Flow
```mermaid
graph TD
    subgraph Error Processing
        A[Error Occurs] --> B{Error Type}
        B -->|Validation| C[400 Bad Request]
        B -->|Auth| D[401 Unauthorized]
        B -->|Permission| E[403 Forbidden]
        B -->|Not Found| F[404 Not Found]
        B -->|Server| G[500 Internal Error]
    end
    
    subgraph Error Recovery
        C & D & E & F & G --> H[Log Error]
        H --> I[Notify Admin]
        I --> J[User Response]
    end
```

#### 6. Rate Limiting Process
```mermaid
sequenceDiagram
    participant C as Client
    participant R as Rate Limiter
    participant Redis
    participant A as API
    
    C->>R: Request
    R->>Redis: Check Limit
    alt Under Limit
        Redis-->>R: Allow
        R->>A: Process Request
        A-->>C: Response
    else Over Limit
        Redis-->>R: Block
        R-->>C: 429 Too Many Requests
    end
```

#### 7. Database Operations Flow
```mermaid
graph TD
    subgraph Read Operations
        A[Read Request] --> B{Check Cache}
        B -->|Hit| C[Return Cached]
        B -->|Miss| D[Query DB]
        D --> E[Update Cache]
        E --> F[Return Data]
    end
    
    subgraph Write Operations
        G[Write Request] --> H[Validate]
        H --> I[Update DB]
        I --> J[Invalidate Cache]
        J --> K[Confirm Write]
    end
```

#### 8. NLP Processing Pipeline
```mermaid
graph TD
    subgraph Text Processing
        A[Raw Text] --> B[Tokenization]
        B --> C[Entity Recognition]
        C --> D[Claim Extraction]
    end
    
    subgraph Analysis
        D --> E[Evidence Search]
        E --> F[Verification]
        F --> G[Confidence Scoring]
    end
    
    subgraph Output
        G --> H[Result Formatting]
        H --> I[Response]
    end
```

#### 9. Security Flow
```mermaid
graph TD
    subgraph Authentication
        A[Login Request] --> B[Validate Credentials]
        B --> C[Generate Token]
        C --> D[Store Session]
    end
    
    subgraph Authorization
        E[API Request] --> F[Validate Token]
        F --> G[Check Permissions]
        G --> H[Process Request]
    end
    
    subgraph Protection
        I[Input] --> J[Sanitize]
        J --> K[Validate]
        K --> L[Process]
    end
```

#### 10. Monitoring and Logging Flow
```mermaid
graph TD
    subgraph Metrics Collection
        A[System Events] --> B[Collect Metrics]
        B --> C[Process Data]
        C --> D[Store Metrics]
    end
    
    subgraph Logging
        E[Application Logs] --> F[Format Logs]
        F --> G[Store Logs]
        G --> H[Analyze Logs]
    end
    
    subgraph Alerting
        I[Threshold Check] --> J{Alert Needed?}
        J -->|Yes| K[Send Alert]
        J -->|No| L[Continue Monitoring]
    end
```

### Core Components

1. **API Layer** (`app.py`)
   - FastAPI application handling HTTP requests
   - Request validation and response formatting
   - Authentication middleware
   - Rate limiting and security measures
   
   **Technical Details:**
   ```python
   # Example route implementation
   @app.post("/api/verify_claim")
   async def verify_claim(
       claim: ClaimRequest,
       current_user: User = Depends(get_current_user)
   ):
       result = await fact_checker.verify(claim.text)
       return ClaimResponse(
           score=result.score,
           verdict=result.verdict,
           evidence=result.evidence
       )
   ```

2. **Fact Checking Engine** (`fact_checker.py`)
   - Google's Gemini AI integration for claim verification
   - NLP-based claim extraction and analysis
   - Evidence gathering and verification
   - Confidence scoring system

   **Verification Process:**
   ```mermaid
   sequenceDiagram
       participant C as Claim
       participant FC as Fact Checker
       participant G as Gemini AI
       participant DB as Database
       
       C->>FC: Submit claim
       FC->>G: Verify claim
       G->>FC: Return analysis
       FC->>DB: Store result
       DB->>FC: Confirm storage
       FC->>C: Return verdict
   ```

3. **Data Layer**
   - **PostgreSQL** (`database.py`): User data and claim storage
   - **ChromaDB**: Vector database for semantic search
   - **Redis**: Caching layer for performance optimization

   **Database Schema:**
   ```sql
   -- Example table structure
   CREATE TABLE claims (
       id SERIAL PRIMARY KEY,
       text TEXT NOT NULL,
       score FLOAT,
       verdict BOOLEAN,
       evidence JSONB,
       created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Security Layer** (`security.py`)
   - JWT token management
   - Password hashing and verification
   - Rate limiting implementation
   - API key management

   **Security Flow:**
   ```mermaid
   graph LR
       A[Request] --> B{Has Token?}
       B -->|No| C[401 Unauthorized]
       B -->|Yes| D{Valid Token?}
       D -->|No| E[403 Forbidden]
       D -->|Yes| F[Process Request]
   ```

5. **NLP Processing** (`nlp_processor.py`)
   - Text preprocessing and normalization
   - Claim extraction and analysis
   - Entity recognition and relationship mapping

   **Processing Pipeline:**
   ```mermaid
   graph TD
       A[Raw Text] --> B[Tokenization]
       B --> C[Entity Recognition]
       C --> D[Claim Extraction]
       D --> E[Evidence Matching]
       E --> F[Verification]
   ```

6. **Utility Layer** (`utils.py`)
   - Helper functions and common utilities
   - Logging and monitoring
   - Error handling and formatting

### Performance Optimization

1. **Caching Strategy**
   ```mermaid
   graph TD
       A[Request] --> B{Cache Hit?}
       B -->|Yes| C[Return Cached]
       B -->|No| D[Process Request]
       D --> E[Cache Result]
       E --> F[Return Response]
   ```

2. **Rate Limiting**
   - Token bucket algorithm
   - Per-user and global limits
   - Redis-backed implementation

3. **Database Optimization**
   - Connection pooling
   - Query optimization
   - Index management

### Error Handling

```mermaid
graph TD
    A[Error] --> B{Error Type}
    B -->|Validation| C[400 Bad Request]
    B -->|Auth| D[401 Unauthorized]
    B -->|Permission| E[403 Forbidden]
    B -->|Not Found| F[404 Not Found]
    B -->|Server| G[500 Internal Error]
```

### Monitoring and Logging

1. **Metrics Collection**
   - Request latency
   - Error rates
   - Cache hit/miss ratios
   - Database performance

2. **Logging Levels**
   ```python
   # Example logging configuration
   LOGGING = {
       'version': 1,
       'handlers': {
           'console': {
               'class': 'logging.StreamHandler',
               'level': 'INFO'
           }
       },
       'root': {
           'level': 'INFO',
           'handlers': ['console']
       }
   }
   ```

### Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design
   - Load balancing ready
   - Database sharding support

2. **Vertical Scaling**
   - Connection pooling
   - Resource optimization
   - Memory management

### Security Measures

1. **Authentication**
   - JWT-based authentication
   - Token refresh mechanism
   - Password hashing with bcrypt

2. **Authorization**
   - Role-based access control
   - Resource-level permissions
   - API key management

3. **Data Protection**
   - Input sanitization
   - SQL injection prevention
   - XSS protection

## 📁 Project Structure

```
backend/
├── app.py                 # Main FastAPI application
├── fact_checker.py        # Core fact-checking logic
├── nlp_processor.py       # NLP processing utilities
├── database.py           # Database models and operations
├── security.py           # Authentication and security
├── utils.py              # Helper functions
├── models.py             # Data models and schemas
├── check_fact.py         # Fact verification utilities
├── add_sample_claims.py  # Sample data generation
├── test_api.py           # API tests
├── test_endpoints.py     # Endpoint tests
├── requirements.txt      # Project dependencies
├── about-api.md          # API documentation
├── chroma_db/            # Vector database storage
├── templates/            # Template files
└── __init__.py          # Package initialization
```

### Key Files and Their Purposes

- **`app.py`**: Main application entry point, route definitions, and API endpoints
- **`fact_checker.py`**: Core fact-checking logic using Gemini AI
- **`nlp_processor.py`**: Natural language processing for claim analysis
- **`database.py`**: Database models, migrations, and query operations
- **`security.py`**: Authentication, authorization, and security measures
- **`utils.py`**: Common utilities and helper functions
- **`models.py`**: Pydantic models for request/response validation
- **`check_fact.py`**: Fact verification utilities and helpers
- **`test_api.py`**: API integration tests
- **`test_endpoints.py`**: Endpoint-specific tests

### Database Schema

The system uses multiple databases for different purposes:

1. **PostgreSQL** (`factcheck.db`)
   - User accounts and authentication
   - Claim history and verification results
   - System configuration and settings

2. **ChromaDB** (`chroma_db/`)
   - Vector embeddings of claims
   - Semantic search index
   - Similar claim matching

3. **Redis**
   - Session management
   - Rate limiting
   - Caching layer

## 🔧 Environment Setup

Required environment variables:

```env
GOOGLE_API_KEY=your_google_api_key
DATABASE_URL=postgresql://user:pass@localhost:5432/factcheck
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
```

## 💻 Development

### Prerequisites

- Python 3.8+
- PostgreSQL
- Redis
- Google Cloud API Key

### Development Setup

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   .\venv\Scripts\activate  # Windows
   ```

2. **Install development dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run development server**
   ```bash
   uvicorn app:app --reload
   ```

## 🧪 Testing

Run the test suite:

```bash
python -m pytest test_api.py test_endpoints.py
```

## 🚢 Deployment

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t factchecker-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 factchecker-backend
   ```

### Heroku Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Deploy**
   ```bash
   git push heroku main
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Additional Resources

- [API Documentation](about-api.md)
- [Fact Checking Algorithm](fact_checker.py)
- [Database Schema](database.py)

## 📞 Support

For support, email support@factchecker.com or open an issue in the repository.

---

Made with ❤️ by the FactChecker Team
