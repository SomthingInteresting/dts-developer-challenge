import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os
# Remove tempfile/shutil if only using Docker DB for tests
# import tempfile
# import shutil

# Load environment variables potentially set by Docker Compose
from dotenv import load_dotenv
from pathlib import Path

# Define the path relative to this file to find the .env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path) # Load .env file

# Adjust imports based on project structure
from backend.db.base_class import Base
from backend.models.task import Task # Ensure model is imported

# --- Database Configuration --- #

# Use DATABASE_URL from environment if set (e.g., by docker-compose),
# otherwise fall back to default (or raise error if needed)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Option 1: Raise error if not running in Docker context
    raise EnvironmentError("DATABASE_URL environment variable not set. "
                           "Tests requiring the database should be run using Docker Compose.")
    # Option 2: Fallback to SQLite (if tests support it)
    # print("Warning: DATABASE_URL not set. Falling back to SQLite for tests.")
    # _TEMP_DIR = tempfile.mkdtemp()
    # TEST_DATABASE_FILE = os.path.join(_TEMP_DIR, "test_backend.db")
    # DATABASE_URL = f"sqlite:///{TEST_DATABASE_FILE}"

# Create a test engine based on the resolved DATABASE_URL
# Adjust connect_args based on DB type if needed (check_same_thread only for SQLite)
connect_args = {}
if DATABASE_URL and DATABASE_URL.startswith("sqlite"):
    connect_args={"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

# Create a test session local bound EXPLICITLY to the test engine
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db() -> Session:
    """Pytest fixture providing a transactional test database session."""
    # Create tables before each test function
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Drop tables after each test function to ensure isolation
        Base.metadata.drop_all(bind=engine)

# Optional: Cleanup the temp dir at the end of the session if needed,
# but function-scoped fixtures might recreate it anyway.
# def pytest_sessionfinish(session, exitstatus):
#     if os.path.exists(_TEMP_DIR):
#         print(f"Cleaning up temp dir: {_TEMP_DIR}")
#         shutil.rmtree(_TEMP_DIR)

# You can add other fixtures here, e.g., for creating test data

# Import your CRUD functions and models here when ready
# from app.crud import crud_task
# from app.models import Task 