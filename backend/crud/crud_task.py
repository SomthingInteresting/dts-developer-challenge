from sqlalchemy.orm import Session

from ..models.task import Task, TaskStatus
# We will define schemas later in schemas/task.py
# from ..schemas.task import TaskCreate, TaskUpdateStatus


def get_task(db: Session, task_id: int) -> Task | None:
    """Get a single task by ID."""
    # Placeholder implementation
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> list[Task]:
    """Get a list of tasks with pagination."""
    # Placeholder implementation
    return db.query(Task).offset(skip).limit(limit).all()


def create_task(db: Session, task: dict) -> Task:
    """Create a new task."""
    # Placeholder implementation - will use TaskCreate schema later
    db_task = Task(**task)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task_status(db: Session, task_id: int, status: TaskStatus) -> Task | None:
    """Update the status of an existing task."""
    # Placeholder implementation - will use TaskUpdateStatus schema later
    db_task = get_task(db, task_id=task_id)
    if db_task:
        db_task.status = status
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> Task | None:
    """Delete a task by ID."""
    db_task = get_task(db, task_id=task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task # Return the deleted task or None if not found


# Add other potential CRUD operations here if needed, e.g., update_task() 