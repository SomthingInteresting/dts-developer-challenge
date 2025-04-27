# HMCTS Task Management System (Developer Challenge)

## Overview

This project is a simple task management application built for the DTS Developer Challenge. It features a React/TypeScript frontend styled with `govuk-react` and a Python/FastAPI backend API connected to a PostgreSQL database. The entire application stack is designed to be run using Docker Compose for ease of setup and development consistency.

## Repository Structure

- `backend/`: Contains the Python/FastAPI backend service (API, database models, CRUD operations). See `backend/README.md` for details.
- `frontend/`: Contains the React/Vite/TypeScript frontend application (UI components, API service). See `frontend/README.md` for details.
- `docker-compose.yml`: Defines the application services (frontend, backend, db) for Docker Compose.
- `.gitignore`: Standard Git ignore file.
- `README.md`: This file - provides overall project information and Docker Compose instructions.

## Running with Docker Compose (Recommended)

This is the primary method for running the application. It manages the database, backend, and frontend services together.

### Prerequisites

- Docker Desktop or Docker Engine with Docker Compose v2+ installed.
- Git (for cloning the repository).

### Setup

1.  **Clone the repository:**
    ```bash
    # Replace with your repository URL if applicable
    git clone https://github.com/somthinginteresting/dts-developer-challenge.git
    cd dts-developer-challenge
    ```
2.  **Backend Environment File:**
    - Create a `.env` file inside the `backend` directory (`backend/.env`).
    - Add the database connection string required by the backend service:
      ```dotenv
      DATABASE_URL=postgresql://taskuser:taskpassword@db:5432/taskdb
      ```
      _(Note: This uses the service name `db` which Docker Compose resolves internally)_
3.  **Database Initialization (First Run Only):**
    - The first time you run the application (or after clearing the database volume), the database tables need to be created.
    - Start the database service temporarily: `docker-compose up -d db`
    - Wait a few seconds for the database to initialize fully.
    - Run the database initialization script using the backend service container:
      ```bash
      docker-compose run --rm backend python -m backend.init_db
      ```
    - You can optionally stop the database service afterwards (`docker-compose stop db`) before starting the full stack.

### Running the Application

1.  **Build and Start:** From the project root directory (`dts-developer-challenge`), run:
    ```bash
    docker-compose up -d --build
    ```
    - This command builds the frontend and backend images (if they don't exist or have changed) and starts the database, backend, and frontend services in detached mode (`-d`).
2.  **Accessing Services:**
    - **Frontend:** `http://localhost:3000` (Served by Nginx)
    - **Backend API Docs (Swagger UI):** `http://localhost:8000/docs`
3.  **Viewing Logs:**
    ```bash
    docker-compose logs          # View logs for all services (Ctrl+C to stop)
    docker-compose logs -f       # Follow logs for all services (Ctrl+C to stop)
    docker-compose logs -f backend # Follow logs for the backend only
    docker-compose logs -f frontend # Follow logs for the frontend only
    ```
4.  **Stopping the Application:**
    ```bash
    docker-compose down          # Stops and removes containers, networks
    # Use with caution - deletes all database data:
    # docker-compose down -v       # Stops/removes containers, networks, AND volumes
    ```

### Inspecting the Database

The recommended way to inspect the database contents is to use the `psql` client inside the running database container via `docker exec`:

1.  **Ensure services are running:** `docker-compose up -d`
2.  **Connect using `docker exec`:**

    - **List tables:**
      ```bash
      docker exec -it dts-developer-challenge-db-1 psql -U taskuser -d taskdb -c "\dt"
      ```
    - **View all tasks:**
      ```bash
      docker exec -it dts-developer-challenge-db-1 psql -U taskuser -d taskdb -c "SELECT * FROM tasks;"
      ```
    - **Start an interactive `psql` session:**
      ```bash
      docker exec -it dts-developer-challenge-db-1 psql -U taskuser -d taskdb
      ```
      (Type `\q` to exit the interactive session)

3.  **Stopping the Application:**
    ```bash
    docker-compose down          # Stops and removes containers, networks
    ```

### Running Tests (Backend)

The backend tests use `pytest` and are configured to run against the database service within the Docker network.

1.  **Ensure services are up (especially `db`):**
    ```bash
    docker-compose up -d db
    # Or ensure all services are up: docker-compose up -d
    ```
2.  **Run tests:** Execute `pytest` inside a temporary backend container:
    ```bash
    docker-compose run --rm backend pytest
    ```
    - This connects to the `db` service using the `DATABASE_URL` from `backend/.env`.
    - The test database session creates and drops tables for each test function to ensure isolation.

## Manual Setup (Not Recommended)

Running the services manually outside of Docker Compose is possible but requires separate setup for Python/Node environments, manual database creation, and careful configuration of environment variables (e.g., ensuring `DATABASE_URL` points to `localhost:5432` for the backend). Refer to the individual `backend/README.md` and `frontend/README.md` before the Dockerization steps were added for potential guidance, but the Docker Compose method is strongly recommended for consistency.
