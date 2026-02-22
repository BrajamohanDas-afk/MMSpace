import requests
import json
import time

url = "http://localhost:8000/predict"

mock_student = {
    "DSA_Skill": 8.5,
    "GP": 3.8,
    "Internships": 2,
    "Active_Backlogs": 0,
    "Tenth_Marks": 92.5
}

print("Testing FastAPI Microservice endpoints...")
try:
    response = requests.post(url, json=mock_student)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body:\n{json.dumps(response.json(), indent=2)}")
except requests.exceptions.ConnectionError:
    print("Error: Could not connect to the server. Is `uvicorn app:app` running?")
except Exception as e:
    print(f"Error: {e}")
