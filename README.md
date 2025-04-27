# HMCTS Task Management System (Developer Challenge)

## Overview

[Briefly describe the project and its purpose... Mention tech stack: Python/FastAPI, React/TS, PostgreSQL]

## Repository Structure

- `backend/`: Contains the Python/FastAPI backend service.
- `frontend/`: Contains the React/TS frontend application.
- `docker-compose.yml`: Defines services, including the PostgreSQL database.
- `PLANNING.md`: Outlines the development plan and rationale.

## Setup & Running

### Prerequisites

- Git
- Docker & Docker Compose
- Node.js (Specify version, e.g., v18+)
- Python (Specify version, e.g., 3.10+)
- [Add package managers if specific ones are assumed, e.g., `pip`/`poetry`, `npm`/`yarn`]

### Installation & Startup

1.  **Clone the repository:**

    ```bash
    git clone [your-repo-url]
    cd [your-repo-directory]
    ```

2.  **Start Database:**

    ```bash
    docker-compose up -d db
    ```

    - [Add note about initial DB setup/waiting time if necessary]

3.  **Backend Setup & Run:**

    - Navigate to `backend` directory.
    - [Instructions for virtual env, installing deps, .env setup, migrations]
    - [Command to start backend server]

4.  **Frontend Setup & Run:**
    - Navigate to `frontend` directory.
    - [Instructions for installing deps, .env setup]
    - [Command to start frontend dev server]

### Accessing the Application

- **Frontend UI:** [http://localhost:PORT]
- **Backend API Base URL:** [http://localhost:PORT]
- **API Documentation (Swagger):** [http://localhost:PORT/docs]

## Planning

See [PLANNING.md](PLANNING.md) for details on the development approach and technical decisions.

## Running with Docker Compose

This is the recommended way to run the application for development. It ensures all services (frontend, backend, database) are started with the correct configuration and network settings.

### Prerequisites

- Docker Desktop or Docker Engine with Docker Compose installed.

### Setup

1.  **Clone the repository:**
    ```bash
    # git clone ...
    cd dts-developer-challenge
    ```
2.  **Backend Environment File:**
    - Create a `.env` file inside the `backend` directory (`backend/.env`).
    - Add the database connection string:
    ```dotenv
    DATABASE_URL=postgresql://taskuser:taskpassword@db:5432/taskdb
    ```
3.  **Database Initialization (First Run Only):**
    - Start the database service temporarily: `docker-compose up -d db`
    - Run the database initialization script using the backend service container:
    ```bash
    docker-compose run --rm backend python -m backend.init_db
    ```
    - You can stop the database service after initialization if desired: `docker-compose stop db`

### Running the Application

1.  **Build and Start:** From the project root directory, run:
    ```bash
    docker-compose up -d --build
    ```
    - This will build the images for the frontend and backend (if they don't exist or have changed) and start all services defined in `docker-compose.yml`.
2.  **Accessing Services:**
    - **Frontend:** `http://localhost:3000` (or whichever port the frontend service uses)
    - **Backend API Docs:** `http://localhost:8000/docs`
3.  **Viewing Logs:**
    ```bash
    docker-compose logs          # View logs for all services
    docker-compose logs -f backend # Follow logs for the backend
    docker-compose logs -f frontend # Follow logs for the frontend
    ```
4.  **Stopping the Application:**
    ```bash
    docker-compose down          # Stops and removes containers, networks
    docker-compose down -v       # Stops and removes containers, networks, AND volumes (deletes DB data)
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

## Manual Setup (Optional)

[Instructions for setting up backend and frontend manually without Docker, if desired]
