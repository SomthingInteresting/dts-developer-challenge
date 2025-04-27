import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Use os.getenv to fetch the variable, providing a default is good practice
# though for DATABASE_URL, we might want it to fail if not set.
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # In a real app, you might provide a default SQLite URL for local dev
    # or raise a more specific configuration error.
    print("Warning: DATABASE_URL environment variable not set.")
    # Example fallback (not recommended for production):
    # DATABASE_URL = "sqlite:///./test.db"

# You can add other configurations here later, e.g.:
# API_V1_STR: str = "/api/v1"
# SECRET_KEY: str = os.getenv("SECRET_KEY", "a_default_secret_key") 