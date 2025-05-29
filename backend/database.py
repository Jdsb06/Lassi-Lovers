import os
from typing import Dict, List, Any, Optional
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import json
# import chromadb
# from chromadb.config import Settings
import numpy as np

# Load environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

# Initialize SQLAlchemy
Base = declarative_base()

class FactCheck(Base):
    """Model for storing fact check results"""
    __tablename__ = "fact_checks"
    
    id = Column(Integer, primary_key=True, index=True)
    claim = Column(Text, nullable=False)
    score = Column(Float, nullable=False)
    verdict = Column(String(20), nullable=False)
    explanation = Column(Text, nullable=True)
    sources = Column(Text, nullable=True)  # JSON string of sources
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with ClaimEvidence
    evidence = relationship("ClaimEvidence", back_populates="fact_check", cascade="all, delete-orphan")

class ClaimEvidence(Base):
    """Model for storing evidence for claims"""
    __tablename__ = "claim_evidence"
    
    id = Column(Integer, primary_key=True, index=True)
    fact_check_id = Column(Integer, ForeignKey("fact_checks.id"))
    title = Column(String(255), nullable=True)
    snippet = Column(Text, nullable=True)
    link = Column(String(512), nullable=True)
    
    # Relationship with FactCheck
    fact_check = relationship("FactCheck", back_populates="evidence")

class Database:
    """Database manager for PostgreSQL and vector database"""
    def __init__(self):
        """Initialize database connections"""
        # Connect directly to the factcheck database
        self.engine = create_engine("postgresql://postgres:postgres@localhost:5432/postgres")
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
        # Create tables if they don't exist
        Base.metadata.create_all(bind=self.engine)
        
        # Vector database connection (disabled)
        self.vector_client = None
        self.collection = None
    
    def store_fact_check(self, 
                        claim: str, 
                        score: float, 
                        verdict: str, 
                        explanation: Optional[str] = None,
                        sources: Optional[List[str]] = None,
                        evidence: Optional[List[Dict[str, Any]]] = None,
                        embedding: Optional[List[float]] = None) -> int:
        """Store fact check results in PostgreSQL"""
        # Store in PostgreSQL
        db = self.SessionLocal()
        try:
            # Create fact check record
            fact_check = FactCheck(
                claim=claim,
                score=score,
                verdict=verdict,
                explanation=explanation,
                sources=json.dumps(sources) if sources else None
            )
            db.add(fact_check)
            db.commit()
            db.refresh(fact_check)
            
            # Add evidence if provided
            if evidence:
                for item in evidence:
                    evidence_item = ClaimEvidence(
                        fact_check_id=fact_check.id,
                        title=item.get("title"),
                        snippet=item.get("snippet"),
                        link=item.get("link")
                    )
                    db.add(evidence_item)
                db.commit()
            
            return fact_check.id
        except Exception as e:
            db.rollback()
            print(f"Error storing fact check: {e}")
            return None
        finally:
            db.close()
    
    def find_similar_claims(self, embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """Dummy implementation for similar claims search"""
        return []
    
    def get_fact_check_by_id(self, fact_check_id: int) -> Dict[str, Any]:
        """Get fact check by ID from PostgreSQL"""
        db = self.SessionLocal()
        try:
            fact_check = db.query(FactCheck).filter(FactCheck.id == fact_check_id).first()
            if not fact_check:
                return None
                
            evidence_items = []
            for evidence in fact_check.evidence:
                evidence_items.append({
                    "title": evidence.title,
                    "snippet": evidence.snippet,
                    "link": evidence.link
                })
                
            return {
                "id": fact_check.id,
                "claim": fact_check.claim,
                "score": fact_check.score,
                "verdict": fact_check.verdict,
                "explanation": fact_check.explanation,
                "sources": json.loads(fact_check.sources) if fact_check.sources else None,
                "evidence": evidence_items
            }
        except Exception as e:
            print(f"Error retrieving fact check: {e}")
            return None
        finally:
            db.close()

# Create global database instance
db = Database()