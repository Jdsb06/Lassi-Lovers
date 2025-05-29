import requests
import json
import time
import sys

# Configuration
API_URL = "http://localhost:5000"
TEST_TEXT = """
Apple Inc. was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976. 
The company's first product was the Apple I personal computer. 
Today, Apple is one of the world's largest technology companies with a market capitalization of over $2 trillion.
The iPhone was released in 2007 and revolutionized the smartphone industry.
"""

TEST_URL = "https://en.wikipedia.org/wiki/Artificial_intelligence"

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{API_URL}/health")
    if response.status_code == 200:
        print("✅ Health check successful")
        print(f"Status: {response.json().get('status')}")
        print(f"Components: {response.json().get('components')}")
    else:
        print(f"❌ Health check failed: {response.status_code}")
        print(response.text)
    print()

def test_analyze_text():
    """Test the analyze text endpoint"""
    print("Testing analyze text endpoint...")
    payload = {"text": TEST_TEXT}
    response = requests.post(f"{API_URL}/analyze", json=payload)
    if response.status_code == 200:
        print("✅ Text analysis successful")
        data = response.json()
        print(f"Found {len(data.get('claims', []))} claims")
        for i, claim in enumerate(data.get('claims', []), 1):
            print(f"  Claim {i}: {claim.get('text')}")
            print(f"    Verdict: {claim.get('verdict')}")
            print(f"    Score: {claim.get('score')}")
    else:
        print(f"❌ Text analysis failed: {response.status_code}")
        print(response.text)
    print()

def test_analyze_url():
    """Test the analyze URL endpoint"""
    print("Testing analyze URL endpoint...")
    payload = {"url": TEST_URL}
    response = requests.post(f"{API_URL}/analyze_url", json=payload)
    if response.status_code == 200:
        print("✅ URL analysis successful")
        data = response.json()
        print(f"Found {len(data.get('claims', []))} claims")
        for i, claim in enumerate(data.get('claims', []), 1):
            if i > 3:  # Limit output to first 3 claims
                print(f"  ... and {len(data.get('claims', [])) - 3} more claims")
                break
            print(f"  Claim {i}: {claim.get('text')}")
            print(f"    Verdict: {claim.get('verdict')}")
            print(f"    Score: {claim.get('score')}")
    else:
        print(f"❌ URL analysis failed: {response.status_code}")
        print(response.text)
    print()

def test_token():
    """Test the token endpoint"""
    print("Testing token endpoint...")
    payload = {"username": "testuser", "password": "testpassword"}
    response = requests.post(f"{API_URL}/token", json=payload)
    if response.status_code == 200:
        print("✅ Token generation successful")
        print(f"Token type: {response.json().get('token_type')}")
        print(f"Expires in: {response.json().get('expires_in')} seconds")
    else:
        print(f"❌ Token generation failed: {response.status_code}")
        print(response.text)
    print()

def main():
    """Run all tests"""
    print("🔍 Starting API tests...\n")
    
    # Check if API is running
    try:
        requests.get(f"{API_URL}/")
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to API at {API_URL}")
        print("Make sure the API is running with 'python app.py' or 'uvicorn app:app --host 0.0.0.0 --port 5000'")
        sys.exit(1)
    
    # Run tests
    test_health()
    test_token()
    test_analyze_text()
    test_analyze_url()
    
    print("🎉 All tests completed!")

if __name__ == "__main__":
    main()