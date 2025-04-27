from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Adjust imports based on project structure
from ....schemas import task as task_schema
from ....crud import crud_task
from ....db.session import SessionLocal # Or a dependency function to get session

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=task_schema.Task, status_code=status.HTTP_201_CREATED)
def create_task(
    *, # Forces keyword arguments
    db: Session = Depends(get_db),
    task_in: task_schema.TaskCreate
):
    """
    Create a new task.
    """
    return crud_task.create_task(db=db, task=task_in)

@router.get("/", response_model=List[task_schema.Task])
def read_tasks(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve a list of tasks.
    """
    tasks = crud_task.get_tasks(db=db, skip=skip, limit=limit)
    return tasks

@router.get("/{task_id}", response_model=task_schema.Task)
def read_task(
    *,
    db: Session = Depends(get_db),
    task_id: int
):
    """
    Retrieve a single task by ID.
    """
    db_task = crud_task.get_task(db=db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return db_task

@router.patch("/{task_id}/status", response_model=task_schema.Task)
def update_task_status(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    task_in: task_schema.TaskUpdateStatus
):
    """
    Update the status of a task.
    """
    updated_task = crud_task.update_task_status(db=db, task_id=task_id, task_update=task_in)
    if updated_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return updated_task

@router.delete("/{task_id}", response_model=task_schema.Task)
def delete_task(
    *,
    db: Session = Depends(get_db),
    task_id: int
):
    """
    Delete a task by ID.
    """
    deleted_task = crud_task.delete_task(db=db, task_id=task_id)
    if deleted_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return deleted_task 