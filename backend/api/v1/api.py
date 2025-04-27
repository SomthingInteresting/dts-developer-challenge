from fastapi import APIRouter

# Adjust import based on project structure
from .endpoints import tasks

# Create the main API router
api_router = APIRouter()

# Include routers from endpoint files
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])

# Add other routers here later if needed, e.g.:
# api_router.include_router(users.router, prefix="/users", tags=["Users"]) 