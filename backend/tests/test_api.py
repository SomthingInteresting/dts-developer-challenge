import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime

# Adjust imports based on project structure
from backend.main import app # Import the FastAPI app instance
from backend.db.base_class import Base # Needed for table creation/deletion
# Import TestingSessionLocal and test_engine from conftest
from .conftest import TestingSessionLocal, engine as test_engine
from backend.api.v1.endpoints.tasks import get_db # Import the original dependency
from backend.schemas.task import TaskStatus # Import enum if needed

# We don't need the db fixture imported directly if client fixture uses it
# from .conftest import db as db_fixture

# Override the get_db dependency for testing
def override_get_db():
    """Dependency override to use the test database session AND ensure tables exist."""
    # Ensure tables are created for this specific override instance
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Optional: Drop tables here too, though conftest fixture might still do it
        # Base.metadata.drop_all(bind=test_engine) # Maybe redundant if conftest works

# Apply the dependency override to the app before creating the client
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def client(db: Session): # <--- Make client depend on db again
    """Pytest fixture to provide a TestClient instance. Depends on db fixture for setup."""
    # db fixture (from conftest) handles setup/teardown
    yield TestClient(app)

def test_read_root(client: TestClient):
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the HMCTS Task Management API"}

def test_create_task_api(client: TestClient): # Use the client fixture
    """Test creating a task via the API."""
    test_due_date = datetime.utcnow().isoformat() # Use ISO format string for JSON
    task_data = {
        "title": "API Test Task",
        "description": "Testing task creation via API",
        "due_date": test_due_date, # Send as string
        # Status will use default PENDING
    }
    response = client.post("/api/v1/tasks/", json=task_data)

    assert response.status_code == 201, response.text
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    # Compare only date part if timezone issues arise, or parse properly
    assert data["due_date"].startswith(test_due_date[:10]) # Consider better date parsing/comparison
    assert data["status"] == TaskStatus.PENDING.value
    assert "id" in data

def test_read_tasks_api(client: TestClient):
    """Test retrieving multiple tasks via API."""
    # Create a couple of tasks first
    task_data_1 = {"title": "API Read Multi 1", "due_date": datetime.utcnow().isoformat()}
    task_data_2 = {"title": "API Read Multi 2", "due_date": datetime.utcnow().isoformat()}
    client.post("/api/v1/tasks/", json=task_data_1)
    client.post("/api/v1/tasks/", json=task_data_2)

    response = client.get("/api/v1/tasks/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Check if at least the two created tasks are in the list (could be more if tests run in parallel/state persists)
    # A more robust check might filter by title or involve clearing the DB completely
    assert len(data) >= 2
    titles = [item["title"] for item in data]
    assert task_data_1["title"] in titles
    assert task_data_2["title"] in titles

def test_read_single_task_api(client: TestClient):
    """Test retrieving a single task by ID via API."""
    # Create a task
    task_data = {"title": "API Read Single", "due_date": datetime.utcnow().isoformat()}
    create_response = client.post("/api/v1/tasks/", json=task_data)
    assert create_response.status_code == 201
    created_id = create_response.json()["id"]

    response = client.get(f"/api/v1/tasks/{created_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_id
    assert data["title"] == task_data["title"]

def test_read_single_task_not_found_api(client: TestClient):
    """Test retrieving a non-existent task by ID via API."""
    non_existent_id = 99999
    response = client.get(f"/api/v1/tasks/{non_existent_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}

def test_update_task_status_api(client: TestClient):
    """Test updating task status via API."""
    # Create a task
    task_data = {"title": "API Update Status", "due_date": datetime.utcnow().isoformat()}
    create_response = client.post("/api/v1/tasks/", json=task_data)
    assert create_response.status_code == 201
    created_id = create_response.json()["id"]
    assert create_response.json()["status"] == TaskStatus.PENDING.value

    update_data = {"status": TaskStatus.COMPLETED.value}
    response = client.patch(f"/api/v1/tasks/{created_id}/status", json=update_data)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == created_id
    assert data["status"] == TaskStatus.COMPLETED.value

    # Optional: Verify with a GET request
    get_response = client.get(f"/api/v1/tasks/{created_id}")
    assert get_response.status_code == 200
    assert get_response.json()["status"] == TaskStatus.COMPLETED.value

def test_delete_task_api(client: TestClient):
    """Test deleting a task via API."""
    # Create a task
    task_data = {"title": "API Delete Task", "due_date": datetime.utcnow().isoformat()}
    create_response = client.post("/api/v1/tasks/", json=task_data)
    assert create_response.status_code == 201
    created_id = create_response.json()["id"]

    # Delete the task
    delete_response = client.delete(f"/api/v1/tasks/{created_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["id"] == created_id # Check if deleted task is returned

    # Verify task is gone
    get_response = client.get(f"/api/v1/tasks/{created_id}")
    assert get_response.status_code == 404

# --- Add more tests below for other endpoints --- #
# def test_read_tasks_api(client: TestClient):
# def test_read_single_task_api(client: TestClient):
# def test_update_task_status_api(client: TestClient):
# def test_delete_task_api(client: TestClient): 