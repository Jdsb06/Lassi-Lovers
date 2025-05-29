# Running the Backend Server

## Issue Resolution

If you encounter the following error when trying to run the backend server:

```
ImportError: attempted relative import with no known parent package
```

This is because the app.py file was using relative imports (e.g., `from .models import ...`), but the backend directory is not set up as a proper Python package.

## Solution

The issue has been fixed by changing the relative imports to absolute imports in app.py:

```python
# Changed from:
from .models import ...

# To:
from models import ...
```

## Running the Server

To run the backend server, navigate to the backend directory and run:

```bash
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 5000
```

Make sure you're running the command from the backend directory, not from the project root.

## Alternative Approach

If you want to run the server from the project root, you can create a Python module structure by:

1. Creating an `__init__.py` file in the backend directory
2. Running with the module name:

```bash
uvicorn backend.app:app --reload --host 0.0.0.0 --port 5000
```

However, this would require changing the imports back to relative imports and is not necessary with the current setup.