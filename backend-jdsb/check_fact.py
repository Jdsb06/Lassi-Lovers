import requests
import json
import sys

def check_fact(text: str):
    """Check a fact using the API"""
    try:
        # First get the token
        token_response = requests.post(
            "http://localhost:5000/token",
            json={"username": "test", "password": "test"}
        )
        token = token_response.json()["access_token"]
        
        # Now analyze the fact
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Create the request payload according to ClaimRequest model
        payload = {
            "text": text,
            "context": None  # Optional context field
        }
        
        response = requests.post(
            "http://localhost:5000/analyze",
            headers=headers,
            json=payload
        )
        
        # Check if the request was successful
        response.raise_for_status()
        
        # Pretty print the results
        result = response.json()
        print("\nAnalysis Results:")
        print("-" * 50)
        print(f"Text analyzed: {text}")
        print("-" * 50)
        
        if "detail" in result:
            print(f"Error: {result['detail']}")
            return
            
        claims = result.get("claims", [])
        if not claims:
            print("No claims were detected in the text.")
            return
            
        for claim in claims:
            print(f"\nClaim: {claim.get('text', text)}")
            print(f"Verdict: {claim.get('verdict', 'unknown')}")
            print(f"Score: {claim.get('score', 0)}")
            print(f"Explanation: {claim.get('explanation', 'No explanation available')}")
            
            # Display GPT score
            gpt_score = claim.get('gpt_score')
            if gpt_score is not None:
                print("\nGPT Analysis:")
                print(f"Score: {gpt_score}/100")
                print(f"Reasoning: {claim.get('gpt_explanation', 'No explanation provided')}")
            
            if claim.get('sources'):
                print("\nSources:")
                for source in claim['sources']:
                    print(f"- {source}")
            if claim.get('evidence'):
                print("\nEvidence:")
                for evidence in claim['evidence']:
                    print(f"- {evidence.get('title')}")
                    print(f"  {evidence.get('snippet')}")
                    print(f"  Link: {evidence.get('link')}")

        sentiment = result.get("sentiment", {})
        if sentiment:
            print("\nSentiment Analysis:")
            print(f"Sentiment: {sentiment.get('sentiment', 'unknown')}")
            print(f"Score: {sentiment.get('score', 0)}")
            
    except requests.exceptions.RequestException as e:
        print(f"\nError connecting to the API: {str(e)}")
    except KeyError as e:
        print(f"\nError parsing API response: {str(e)}")
    except Exception as e:
        print(f"\nUnexpected error: {str(e)}")

if __name__ == "__main__":
    try:
        while True:
            # Example fact to check
            print("\nEnter the fact you want to check (or 'quit' to exit):")
            fact = input("> ")
            
            if fact.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
                
            if not fact.strip():
                print("Please enter a fact to check.")
                continue
                
            check_fact(fact)
            
    except KeyboardInterrupt:
        print("\nGoodbye!")
        sys.exit(0) 