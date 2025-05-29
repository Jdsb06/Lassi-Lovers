import os
import subprocess

# Change to the backend directory
os.chdir('backend')

# Run the uvicorn command
try:
    print("Starting backend server...")
    subprocess.run(["uvicorn", "app:app", "--reload", "--host", "0.0.0.0", "--port", "5000"])
except Exception as e:
    print(f"Error running backend server: {e}")