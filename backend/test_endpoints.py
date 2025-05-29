import requests
import json

BASE_URL = "http://localhost:5000"

def test_endpoints():
    # 1. Get JWT token
    token_response = requests.post(
        f"{BASE_URL}/token",
        json={"username": "test", "password": "test"}
    )
    print("\nToken Response:", token_response.json())
    
    token = token_response.json()["access_token"]
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 2. Test analyze endpoint
    analyze_response = requests.post(
        f"{BASE_URL}/analyze",
        headers=headers,
        json={"text": "Barack Obama was the 44th president of the United States."}
    )
    print("\nAnalyze Response:", json.dumps(analyze_response.json(), indent=2))
    
    # 3. Test analyze_url endpoint
    url_response = requests.post(
        f"{BASE_URL}/analyze_url",
        headers=headers,
        json={"url": "https://en.wikipedia.org/wiki/Barack_Obama"}
    )
    print("\nURL Analysis Response:", json.dumps(url_response.json(), indent=2))

if __name__ == "__main__":
    test_endpoints() 