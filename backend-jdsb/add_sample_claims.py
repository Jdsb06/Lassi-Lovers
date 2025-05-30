from database import db, FactCheck
import json
from datetime import datetime
import traceback

# Sample claims data
sample_claims = [
    {
        "claim": "Drinking water helps maintain the balance of body fluids.",
        "verdict": "true",
        "explanation": "Scientific research confirms that adequate water consumption is essential for maintaining proper body function, including regulating temperature, transporting nutrients, and removing waste.",
        "score": 0.95,
        "sources": json.dumps([
            {"name": "Mayo Clinic", "url": "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256"},
            {"name": "Harvard Health", "url": "https://www.health.harvard.edu/staying-healthy/how-much-water-should-you-drink"}
        ])
    },
    {
        "claim": "The Great Wall of China is visible from space with the naked eye.",
        "verdict": "false",
        "explanation": "According to NASA and multiple astronaut accounts, the Great Wall of China is not visible from space with the naked eye. It's too narrow and blends with the surrounding landscape.",
        "score": 0.92,
        "sources": json.dumps([
            {"name": "NASA", "url": "https://www.nasa.gov/vision/space/workinginspace/great_wall.html"},
            {"name": "Scientific American", "url": "https://www.scientificamerican.com/article/is-chinas-great-wall-visible-from-space/"}
        ])
    },
    {
        "claim": "Regular exercise can improve mental health and reduce symptoms of depression and anxiety.",
        "verdict": "true",
        "explanation": "Numerous studies have shown that physical activity releases endorphins, improves sleep, reduces stress, and can significantly decrease symptoms of depression and anxiety.",
        "score": 0.97,
        "sources": json.dumps([
            {"name": "Harvard Health", "url": "https://www.health.harvard.edu/mind-and-mood/exercise-is-an-all-natural-treatment-to-fight-depression"},
            {"name": "Mayo Clinic", "url": "https://www.mayoclinic.org/diseases-conditions/depression/in-depth/depression-and-exercise/art-20046495"}
        ])
    },
    {
        "claim": "5G networks cause COVID-19.",
        "verdict": "false",
        "explanation": "There is no scientific evidence linking 5G networks to COVID-19. COVID-19 is caused by the SARS-CoV-2 virus, which spreads through respiratory droplets, not by radio waves.",
        "score": 0.99,
        "sources": json.dumps([
            {"name": "World Health Organization", "url": "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters"},
            {"name": "CDC", "url": "https://www.cdc.gov/coronavirus/2019-ncov/your-health/need-to-know.html"}
        ])
    },
    {
        "claim": "Eating carrots improves night vision.",
        "verdict": "neutral",
        "explanation": "While carrots contain vitamin A which is important for eye health, they don't specifically improve night vision beyond normal levels. This claim originated from British propaganda during WWII to hide radar technology.",
        "score": 0.75,
        "sources": json.dumps([
            {"name": "Smithsonian Magazine", "url": "https://www.smithsonianmag.com/arts-culture/a-wwii-propaganda-campaign-popularized-the-myth-that-carrots-help-you-see-in-the-dark-28812484/"},
            {"name": "American Academy of Ophthalmology", "url": "https://www.aao.org/eye-health/tips-prevention/carrots-myth"}
        ])
    }
]

def add_sample_claims():
    # Create a new session
    print("Creating database session...")
    session = db.SessionLocal()

    try:
        # Check if we already have claims
        print("Checking for existing claims...")
        existing_count = session.query(FactCheck).count()
        print(f"Found {existing_count} existing claims.")

        if existing_count > 0:
            print(f"Database already contains {existing_count} claims. No sample claims added.")
            return

        # Add each sample claim to the database
        print(f"Adding {len(sample_claims)} sample claims to the database...")
        for i, claim_data in enumerate(sample_claims):
            print(f"Processing claim {i+1}: {claim_data['claim'][:30]}...")

            # Create a new FactCheck object
            new_claim = FactCheck(
                claim=claim_data["claim"],
                score=claim_data["score"],
                verdict=claim_data["verdict"],
                explanation=claim_data["explanation"],
                sources=claim_data["sources"],
                created_at=datetime.utcnow()
            )

            # Add to session
            session.add(new_claim)
            print(f"Claim {i+1} added to session.")

        # Commit all changes
        print("Committing changes to database...")
        session.commit()
        print(f"Successfully added {len(sample_claims)} sample claims to the database.")

    except Exception as e:
        session.rollback()
        print(f"Error adding sample claims: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()

    finally:
        session.close()
        print("Database session closed.")

if __name__ == "__main__":
    print("Starting sample claims addition...")
    add_sample_claims()
    print("Process completed.")

