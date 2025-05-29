# FactCheck: Full-Stack Automated Fact-Checking Platform

A modern, production-ready system for automated fact-checking, claim verification, and trust scoring.
Built with **FastAPI** (Python) for the backend and **React** for the frontend.

---

## Project Structure & File Roles

```
Lassi-Lovers/
├── backend/         # FastAPI backend (APIs, ML, DB, logic)
│   ├── app.py            # Main FastAPI app, API endpoints, server entry
│   ├── fact_checker.py   # Fact-checking logic, integrates models/APIs
│   ├── nlp_processor.py  # NLP claim extraction, sentiment analysis
│   ├── database.py       # PostgreSQL & vector DB logic
│   ├── models.py         # Pydantic models for API/data
│   ├── utils.py          # Helper functions (text, embeddings, etc)
│   ├── security.py       # Auth, JWT, rate limiting
│   ├── requirements.txt  # Python dependencies
│   ├── .env.example      # Example environment config
│   ├── README.md         # Backend-specific docs
│   └── ...
├── frontend/        # React frontend (UI, UX)
│   ├── src/                 # React components, pages, services
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies/scripts
│   ├── README.md            # Frontend-specific docs
│   └── ...
├── README.md        # (This file)
└── ...
```

---

## Quick Start: How to Run Locally

### Prerequisites
- **Python 3.8+**
- **Node.js 14+** (for frontend)
- **PostgreSQL** (for backend DB)
- **Redis** (optional, for caching/rate limiting)
- **Qdrant** (optional, for vector search)

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m spacy download en_core_web_md
cp .env.example .env  # Fill in your API keys and DB URLs
```
- Edit `backend/.env` with your keys:
  ```
  SERPER_API_KEY=...
  OPENAI_API_KEY=...
  GOOGLE_API_KEY=...
  DATABASE_URL=postgresql://user:password@localhost:5432/factcheck
  REDIS_URL=redis://localhost:6379/0
  JWT_SECRET=...
  MODEL_PATH=lytang/MiniCheck-Flan-T5-Large
  ```
- **Start PostgreSQL** and create a database named `factcheck`.
- **Run the backend:**
  ```bash
  uvicorn backend.app:app --host 0.0.0.0 --port 5000 --reload
  ```
- **Test the backend:**
  ```bash
  curl http://localhost:5000/health
  curl http://localhost:5000/test-env
  ```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Common Errors & Troubleshooting
- **.env not found:** Ensure your `.env` is in `backend/` and filled out. Use `/test-env` endpoint to debug environment loading.
- **Database errors:** Make sure PostgreSQL is running and the `DATABASE_URL` is correct.
- **Model errors:** If you see errors about `MiniCheck` or `torch`, ensure you have the right model path and have installed all dependencies.
- **Frontend API errors:** Make sure the backend is running on port 5000 and the frontend is configured to use that port.
- **Port conflicts:** Change the port in the run command if 5000 or 3000 is in use.
- **CORS errors:** Update allowed origins in backend/app.py for production.

---

## API Documentation
Once the backend is running, see:
- **Swagger UI:** [http://localhost:5000/docs](http://localhost:5000/docs)
- **ReDoc:** [http://localhost:5000/redoc](http://localhost:5000/redoc)

### Main Endpoints
| Endpoint            | Method | Description                                 |
|---------------------|--------|---------------------------------------------|
| `/analyze`          | POST   | Analyze text for factual claims             |
| `/analyze_url`      | POST   | Analyze a URL for factual claims            |
| `/similar_claims`   | POST   | Find claims similar to the provided claim   |
| `/token`            | POST   | Get authentication token                    |
| `/health`           | GET    | Check API health                            |
| `/test-env`         | GET    | Debug environment variable loading          |

**See `backend/about-api.md` for detailed request/response examples.**

---

## How It Works
- **Frontend:** Users submit claims or URLs. The UI is fully responsive (mobile/tablet/desktop).
- **Backend:**
  1. Extracts factual claims using spaCy.
  2. Verifies claims using:
     - Google Fact Check API
     - MiniCheck AI model
     - Evidence search (Serper API)
  3. Combines results, stores in DB, and returns verdict, score, and sources.
- **Database:**
  - PostgreSQL for metadata/results.
  - Qdrant for vector similarity search (optional).
  - Redis for caching/rate limiting (optional).

---

## Deployment
- **Frontend:**
  ```bash
  cd frontend
  npm run build
  # Serve build/ with Nginx, Vercel, Netlify, etc.
  ```
- **Backend:**
  ```bash
  cd backend
  source .venv/bin/activate
  gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.app:app
  ```
- **Production Tips:**
  - Set CORS to your frontend domain in `backend/app.py`.
  - Use HTTPS.
  - Store secrets securely.

---

## Contributing
- Fork the repo, create a branch, and submit a PR.
- Please document any new endpoints or features in this README.

---

## License
MIT License

---

## Maintainers
- [Your Name] (add your contact/github here)
- [Teammate Name(s)]

---

## Additional Docs
- See `backend/README.md` and `backend/about-api.md` for backend details.
- See `frontend/README.md` for frontend-specific scripts and troubleshooting.

**Happy Fact-Checking!**