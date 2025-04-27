# Backend Service (Python/FastAPI)

## Overview

[Describe the role of this backend service... handles task CRUD operations, validation, interacts with DB]

## Prerequisites

- Python [Specify version, e.g., 3.10+]
- [pip/poetry]
- Access to a running PostgreSQL database (see root README for Docker setup).

## Setup

1.  **Navigate to this directory:**
    ```bash
    cd backend
    ```
2.  **Create & Activate Virtual Environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    # venv\Scripts\activate  # Windows
    ```
3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    # or poetry install
    ```
4.  **Environment Variables:**
    - Create a `.env` file in this directory (`backend/.env`).
    - Add the following, adjusting values as needed:
      ```dotenv
      DATABASE_URL=postgresql://taskuser:taskpassword@localhost:5432/taskdb
      # Add other variables if needed (e.g., SECRET_KEY)
      ```
5.  **Database Migrations:**
    - [Instructions for running Alembic migrations, e.g., `alembic upgrade head`]
    - [Or instructions for initial table creation if not using Alembic]

## Running the Service

- **Start Development Server:**
  ```bash
  uvicorn main:app --reload --port 8000
  ```
- **API Base URL:** `http://localhost:8000`
- **API Documentation (Swagger UI):** `http://localhost:8000/docs`

## Running Tests

```bash
pip install pytest httpx  # If not already in requirements
pytest
```

## Project Structure

```
backend/
├── api/            # API endpoints (routers)
├── core/           # Core components (config)
├── crud/           # Database CRUD functions
├── db/             # Database session setup, base model
├── models/         # SQLAlchemy ORM models
├── schemas/        # Pydantic schemas (data validation/serialisation)
├── tests/          # Unit and integration tests
├── venv/           # Virtual environment
├── .env            # Environment variables (ignored by git)
├── main.py         # FastAPI application entry point
├── requirements.txt # Dependencies (or pyproject.toml for Poetry)
└── README.md       # This file
```

## Key Dependencies

- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- Psycopg2 (PostgreSQL driver)
- Alembic (if used for migrations)
- Pytest
- HTTPX
- [Add others as needed]
