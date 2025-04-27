from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers later when they are created
# from .api.v1.api import api_router

# Create the FastAPI app instance
app = FastAPI(title="HMCTS Task Management API", version="0.1.0")

# Set up CORS (Cross-Origin Resource Sharing)
# Adjust origins as needed for production deployments
origins = [
    "http://localhost:5173",  # Default Vite dev server port
    "http://localhost:3000",  # Common alternative frontend port
    # Add any other origins if necessary
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include the API router (uncomment later)
# app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint to check if the API is running.
    """
    return {"message": "Welcome to the HMCTS Task Management API"}

# Add other app setup here if needed, e.g., exception handlers 