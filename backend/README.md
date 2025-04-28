# Backend Service (Python/FastAPI)

## Overview

This service provides the backend API for the Task Management application. It is built using Python with the FastAPI framework and SQLAlchemy for database interaction. It exposes RESTful endpoints for creating, reading, updating, and deleting tasks, handling data validation using Pydantic schemas, and interacting with the PostgreSQL database container.

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose installed.

## Setup (Docker)

This service is designed to be run using Docker Compose from the project root.

1.  **Navigate to the project root directory:**
    ```bash
    cd ..
    ```
2.  **Environment Variables:**

    - An environment file named `.env.assessment` is included in this directory (`backend/.env.assessment`) for assessment visibility. Docker Compose will load it into the service container.
    - It must contain the following variable, pointing to the database service defined in `docker-compose.yml`:

    ```dotenv
    DATABASE_URL=postgresql://taskuser:taskpassword@db:5432/taskdb
    # Add other backend-specific variables if needed
    ```

    - **Note:** In a real project, this file would typically be named `.env` and added to `.gitignore`.

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

The backend tests use `pytest` and require a running database. Ensure the database service is running and initialized, then run the tests inside the backend container using `docker-compose run`:

1.  **Ensure services are up (especially `db`):**
    ```bash
    docker-compose up -d db
    # Or ensure all services are up: docker-compose up -d
    ```
2.  **Run tests:**
    ```bash
    docker-compose run --rm backend pytest
    ```
    - This command starts a temporary backend container.
    - It connects to the `db` service using the `DATABASE_URL` from `backend/.env.assessment`.
    - `pytest` discovers and runs the tests in the `backend/tests` directory.
    - Tables are created before each test function and dropped afterwards (based on the `conftest.py` fixture).

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
├── .env.assessment # Environment variables (visible for assessment)
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
