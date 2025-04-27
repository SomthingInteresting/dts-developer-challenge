from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Import the Enum from the models to reuse it
from ..models.task import TaskStatus


# Shared properties
class TaskBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    due_date: datetime
    status: TaskStatus = TaskStatus.PENDING

# Properties to receive via API on creation
class TaskCreate(TaskBase):
    # All fields from TaskBase are required for creation,
    # except description which is optional.
    # Status defaults to PENDING if not provided.
    pass

# Properties to receive via API on status update
class TaskUpdateStatus(BaseModel):
    status: TaskStatus

# Properties shared by models stored in DB
# (Currently same as TaskBase + id, but could differ later)
class TaskInDBBase(TaskBase):
    id: int

    model_config = {
        "from_attributes": True
    }

# Properties to return to client
class Task(TaskInDBBase):
    # Inherits id, title, description, due_date, status from TaskInDBBase
    pass

# Properties stored in DB
# (Currently same as Task, but could differ if we add sensitive fields)
class TaskInDB(TaskInDBBase):
    pass 