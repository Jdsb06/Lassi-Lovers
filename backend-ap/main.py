from fastapi import FastAPI
from pydantic import BaseModel
import os
from fact_checker import async_fact_checker

app = FastAPI()

class ClaimRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_claim(claim: ClaimRequest):
    # Get fact checking results using Gemini
    result = await async_fact_checker.verify_claim(claim.text)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 