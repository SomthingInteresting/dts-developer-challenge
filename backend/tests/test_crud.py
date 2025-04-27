import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

# Adjust imports based on your project structure
from backend.crud import crud_task
from backend.models.task import Task, TaskStatus
from backend.schemas.task import TaskCreate, TaskUpdateStatus

# Use the db fixture from conftest.py

def test_create_task(db: Session):
    """Test creating a new task."""
    title = "Test Task 1"
    description = "Description for test task 1"
    due_date = datetime.utcnow() + timedelta(days=1)
    task_in = TaskCreate(title=title, description=description, due_date=due_date)

    created_task = crud_task.create_task(db=db, task=task_in)

    assert created_task is not None
    assert created_task.title == title
    assert created_task.description == description
    assert created_task.due_date == due_date
    assert created_task.status == TaskStatus.PENDING # Default status
    assert created_task.id is not None

def test_get_task(db: Session):
    """Test retrieving a single task by ID."""
    # First, create a task to retrieve
    title = "Task to Get"
    due_date = datetime.utcnow() + timedelta(days=2)
    task_in = TaskCreate(title=title, due_date=due_date)
    created_task = crud_task.create_task(db=db, task=task_in)
    assert created_task.id is not None

    # Now, retrieve it
    retrieved_task = crud_task.get_task(db=db, task_id=created_task.id)

    assert retrieved_task is not None
    assert retrieved_task.id == created_task.id
    assert retrieved_task.title == title
    assert retrieved_task.due_date == due_date

def test_get_tasks(db: Session):
    """Test retrieving multiple tasks."""
    # Create multiple tasks
    task_in_1 = TaskCreate(title="Multi Task 1", due_date=datetime.utcnow())
    task_in_2 = TaskCreate(title="Multi Task 2", due_date=datetime.utcnow() + timedelta(hours=1))
    crud_task.create_task(db=db, task=task_in_1)
    crud_task.create_task(db=db, task=task_in_2)

    # Retrieve tasks
    tasks = crud_task.get_tasks(db=db)

    assert len(tasks) == 2
    assert tasks[0].title == "Multi Task 1"
    assert tasks[1].title == "Multi Task 2"

def test_update_task_status(db: Session):
    """Test updating the status of a task."""
    # Create a task
    task_in = TaskCreate(title="Task to Update Status", due_date=datetime.utcnow())
    created_task = crud_task.create_task(db=db, task=task_in)
    assert created_task.status == TaskStatus.PENDING

    # Update status
    status_update = TaskUpdateStatus(status=TaskStatus.IN_PROGRESS)
    updated_task = crud_task.update_task_status(
        db=db, task_id=created_task.id, task_update=status_update
    )

    assert updated_task is not None
    assert updated_task.id == created_task.id
    assert updated_task.status == TaskStatus.IN_PROGRESS

    # Verify in DB
    db.refresh(updated_task) # Ensure we have the latest from DB session
    assert updated_task.status == TaskStatus.IN_PROGRESS

def test_delete_task(db: Session):
    """Test deleting a task."""
    # Create a task
    task_in = TaskCreate(title="Task to Delete", due_date=datetime.utcnow())
    created_task = crud_task.create_task(db=db, task=task_in)
    task_id = created_task.id

    # Delete the task
    deleted_task = crud_task.delete_task(db=db, task_id=task_id)

    assert deleted_task is not None
    assert deleted_task.id == task_id

    # Verify it's gone
    task_after_delete = crud_task.get_task(db=db, task_id=task_id)
    assert task_after_delete is None

# Example structure for a CRUD test (adapt when implementing fully)
# def test_create_task(db: Session) -> None:
#     task_in = TaskCreate(title="Test Task", description="Test Desc", status=TaskStatus.PENDING, due_date=...)
#     created_task = crud_task.create_task(db=db, task=task_in)
#     assert created_task.title == task_in.title
#     assert created_task.description == task_in.description
#     assert created_task.status == task_in.status 