import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

# Adjust imports based on your project structure
# Assumes db.base_class and models.task are accessible
from backend.db.base_class import Base
# Explicitly import models here to ensure they are registered with Base.metadata
from backend.models.task import Task

# Use SQLite in-memory database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

# Create a test engine
# connect_args is required for SQLite to allow shared connections across threads
engine = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a test session local bound EXPLICITLY to the test engine
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db() -> Session:
    """Pytest fixture to provide a test database session with table setup/teardown."""
    # Ensure tables are created using the same engine
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Ensure tables are dropped using the same engine
        Base.metadata.drop_all(bind=engine)

# You can add other fixtures here, e.g., for creating test data

# Import your CRUD functions and models here when ready
# from app.crud import crud_task
# from app.models import Task 