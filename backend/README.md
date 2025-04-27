# Backend Service (Python/FastAPI)

## Overview

[Describe the role of this backend service... handles task CRUD operations, validation, interacts with DB]

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose installed.

## Setup (Docker)

This service is designed to be run using Docker Compose from the project root.

1.  **Navigate to the project root directory:**
    ```bash
    cd ..
    ```
2.  **Environment Variables:**
    - Ensure a `.env` file exists in this directory (`backend/.env`). Docker Compose will automatically load it into the service container.
    - It must contain the following variable, pointing to the database service defined in `docker-compose.yml`:
    ```dotenv
    DATABASE_URL=postgresql://taskuser:taskpassword@db:5432/taskdb
    # Add other backend-specific variables if needed
    ```
3.  **Database Initialization (First Run):**
    - The database container (`db`) needs to be running.
    - To create the necessary database tables defined by the SQLAlchemy models, run the following command from the project root:
    ```bash
    docker-compose run --rm backend python -m backend.init_db
    ```

## Running the Service (Docker)

1.  **Start Services:** From the project root, run:
    ```bash
    docker-compose up -d --build
    ```
    - The `--build` flag ensures the backend image is built if it doesn't exist or if the `Dockerfile` or source code has changed.
    - The `-d` flag runs the services in detached mode (in the background).
2.  **API Access:**
    - The backend API will be accessible on your host machine at `http://localhost:8000`.
    - API Documentation (Swagger UI): `http://localhost:8000/docs`.
3.  **View Logs:**
    ```bash
    docker-compose logs backend
    # Use -f to follow logs: docker-compose logs -f backend
    ```
4.  **Stop Services:**
    ```bash
    docker-compose down
    ```

## Running Tests

[TODO: Update test running instructions for Docker setup]

## Project Structure

```
backend/
├── api/            # API endpoints (routers)
├── core/           # Core components (config)
├── crud/           # Database CRUD functions
├── db/             # Database session setup, base model, init script
├── models/         # SQLAlchemy ORM models
├── schemas/        # Pydantic schemas (data validation/serialisation)
├── tests/          # Unit and integration tests
├── .env            # Environment variables (loaded by Docker Compose)
├── main.py         # FastAPI application entry point
├── requirements.txt # Dependencies
├── Dockerfile      # Docker build instructions
└── README.md       # This file
```

## Key Dependencies

- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- Psycopg2-binary (PostgreSQL driver)
- [Add others as needed]
