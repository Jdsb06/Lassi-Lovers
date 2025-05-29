# Simple script to test that imports work correctly
try:
    from app import app
    print("Imports successful!")
    print("App is ready to run with uvicorn app:app --reload --host 0.0.0.0 --port 5000")
except ImportError as e:
    print(f"Import error: {e}")