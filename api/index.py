"""Vercel Serverless Function entry point.

This file is the single entry point for all /api/* requests
when deployed on Vercel. It re-exports the FastAPI app instance.
"""

import sys
import os

# Add the Backend directory to the Python path so imports work
backend_dir = os.path.join(os.path.dirname(__file__), "..", "Backend")
sys.path.insert(0, backend_dir)

from app.main import app  # noqa: E402, F401

# Vercel automatically detects the `app` variable as a FastAPI/ASGI app
