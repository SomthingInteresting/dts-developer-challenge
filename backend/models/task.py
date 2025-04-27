from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

# Assuming Base is imported from db.base_class or similar
# We'll define Base properly when setting up db/session.py
from ..db.base_class import Base


class TaskStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(TaskStatus), nullable=False, default=TaskStatus.PENDING)
    # Using DateTime(timezone=True) is often recommended for handling timezones properly
    # but requires the database/driver to support it. Sticking to basic DateTime for now.
    due_date = Column(DateTime, nullable=False)

    # Relationships can be added here later if needed, e.g.:
    # owner_id = Column(Integer, ForeignKey("users.id"))
    # owner = relationship("User", back_populates="tasks") 