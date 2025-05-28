import os
from typing import Dict, List, Any, Optional
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import json
import chromadb
from chromadb.config import Settings
import numpy as np

# Load environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/factcheck")
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
        # PostgreSQL connection
        self.engine = create_engine(DATABASE_URL)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
        # Create tables if they don't exist
        Base.metadata.create_all(bind=self.engine)
        
        # Vector database connection
        try:
            self.vector_client = chromadb.PersistentClient(
                path=CHROMA_PERSIST_DIR,
                settings=Settings(
                    anonymized_telemetry=False,
                    allow_reset=True
                )
            )
            # Create collection if it doesn't exist
            self._create_vector_collection()
        except Exception as e:
            print(f"Warning: Vector database connection failed: {e}")
            self.vector_client = None
    
    def _create_vector_collection(self):
        """Create vector collection if it doesn't exist"""
        if self.vector_client is None:
            return
            
        try:
            # Get or create collection
            self.collection = self.vector_client.get_or_create_collection(
                name="fact_checks",
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            print(f"Error creating vector collection: {e}")
    
    def store_fact_check(self, 
                        claim: str, 
                        score: float, 
                        verdict: str, 
                        explanation: Optional[str] = None,
                        sources: Optional[List[str]] = None,
                        evidence: Optional[List[Dict[str, Any]]] = None,
                        embedding: Optional[List[float]] = None) -> int:
        """
        Store fact check results in PostgreSQL and vector database
        
        Args:
            claim: The verified claim
            score: The verification score (0-100)
            verdict: The verification verdict (supported, refuted, neutral)
            explanation: Optional explanation of the verification
            sources: Optional list of source URLs
            evidence: Optional list of evidence items
            embedding: Optional vector embedding of the claim
            
        Returns:
            ID of the stored fact check
        """
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
            
            # Store in vector database if embedding is provided
            if embedding and self.vector_client:
                try:
                    self.collection.add(
                        ids=[str(fact_check.id)],
                        embeddings=[embedding],
                        metadatas=[{
                            "claim": claim,
                            "score": score,
                            "verdict": verdict
                        }]
                    )
                except Exception as e:
                    print(f"Error storing in vector database: {e}")
            
            return fact_check.id
        except Exception as e:
            db.rollback()
            print(f"Error storing fact check: {e}")
            return None
        finally:
            db.close()
    
    def find_similar_claims(self, embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """
        Find similar claims using vector similarity search
        
        Args:
            embedding: Vector embedding of the query claim
            limit: Maximum number of results to return
            
        Returns:
            List of similar claims with scores and verdicts
        """
        if self.vector_client is None:
            return []
            
        try:
            search_result = self.collection.query(
                query_embeddings=[embedding],
                n_results=limit
            )
            
            results = []
            for i in range(len(search_result['ids'][0])):
                results.append({
                    "id": int(search_result['ids'][0][i]),
                    "claim": search_result['metadatas'][0][i]["claim"],
                    "score": search_result['metadatas'][0][i]["score"],
                    "verdict": search_result['metadatas'][0][i]["verdict"],
                    "similarity": 1 - search_result['distances'][0][i]  # Convert distance to similarity
                })
            
            return results
        except Exception as e:
            print(f"Error searching vector database: {e}")
            return []
    
    def get_fact_check_by_id(self, fact_check_id: int) -> Dict[str, Any]:
        """
        Get fact check by ID from PostgreSQL
        
        Args:
            fact_check_id: ID of the fact check to retrieve
            
        Returns:
            Fact check data with evidence
        """
        db = self.SessionLocal()
        try:
            fact_check = db.query(FactCheck).filter(FactCheck.id == fact_check_id).first()
            if not fact_check:
                return None
                
            # Get evidence
            evidence_items = db.query(ClaimEvidence).filter(ClaimEvidence.fact_check_id == fact_check_id).all()
            evidence = []
            for item in evidence_items:
                evidence.append({
                    "title": item.title,
                    "snippet": item.snippet,
                    "link": item.link
                })
                
            return {
                "id": fact_check.id,
                "claim": fact_check.claim,
                "score": fact_check.score,
                "verdict": fact_check.verdict,
                "explanation": fact_check.explanation,
                "sources": json.loads(fact_check.sources) if fact_check.sources else [],
                "evidence": evidence,
                "created_at": fact_check.created_at.isoformat()
            }
        except Exception as e:
            print(f"Error retrieving fact check: {e}")
            return None
        finally:
            db.close()

# Create a singleton instance
db = Database()