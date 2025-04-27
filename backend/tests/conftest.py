import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os
import tempfile # Import tempfile
import shutil # Import shutil for directory removal

# Adjust imports based on project structure
from backend.db.base_class import Base
from backend.models.task import Task # Ensure model is imported

# --- Use a temporary directory for the test database file --- #
_TEMP_DIR = tempfile.mkdtemp()
TEST_DATABASE_FILE = os.path.join(_TEMP_DIR, "test_backend.db")
TEST_DATABASE_URL = f"sqlite:///{TEST_DATABASE_FILE}"
print(f"Using test database: {TEST_DATABASE_URL}") # Debug print
# ---------------------------------------------------------- #

# Create a test engine
engine = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a test session local bound EXPLICITLY to the test engine
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db() -> Session:
    """Pytest fixture using a temporary directory for the DB."""
    # No need to clean file before, temp dir is unique

    # Ensure tables are created using the same engine
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Error creating tables: {e}")
        raise

    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Ensure tables are dropped using the same engine
        Base.metadata.drop_all(bind=engine)
        # Clean up the temp directory after tests
        # No need to remove file explicitly, remove the whole dir
        # shutil.rmtree(_TEMP_DIR) # Careful with recursive delete

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