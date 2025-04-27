from sqlalchemy.orm import Session
# Import Optional and List from typing
from typing import Optional, List

from ..models.task import Task, TaskStatus
# Import the schemas to use for type hinting and data handling
from ..schemas.task import TaskCreate, TaskUpdateStatus


def get_task(db: Session, task_id: int) -> Optional[Task]:
    """Get a single task by ID."""
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> List[Task]:
    """Get a list of tasks with pagination."""
    return db.query(Task).offset(skip).limit(limit).all()


def create_task(db: Session, task: TaskCreate) -> Task:
    """Create a new task using data from the TaskCreate schema."""
    # Use .model_dump() for Pydantic V2, or .dict() for V1
    task_data = task.model_dump() # Use task.dict() if using Pydantic V1
    db_task = Task(**task_data)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task_status(db: Session, task_id: int, task_update: TaskUpdateStatus) -> Optional[Task]:
    """Update the status of an existing task using data from TaskUpdateStatus schema."""
    db_task = get_task(db, task_id=task_id)
    if db_task:
        # Only update the status field from the input schema
        db_task.status = task_update.status
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> Optional[Task]:
    """Delete a task by ID."""
    db_task = get_task(db, task_id=task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task


# Potential function for full task update (if needed later)
# from ..schemas.task import TaskUpdate # Assuming a TaskUpdate schema exists
# def update_task(db: Session, task_id: int, task_in: TaskUpdate) -> Optional[Task]:
#     db_task = get_task(db, task_id=task_id)
#     if db_task:
#         update_data = task_in.model_dump(exclude_unset=True) # Use .dict(exclude_unset=True) for Pydantic V1
#         for key, value in update_data.items():
#             setattr(db_task, key, value)
#         db.commit()
#         db.refresh(db_task)
#     return db_task


# Add other potential CRUD operations here if needed, e.g., update_task() 