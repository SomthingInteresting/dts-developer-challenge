# Frontend Service (React/Vite + TypeScript)

## Overview

This service provides the user interface for the Task Management application. It is built using React (with Vite) and TypeScript. Users can view, create, update the status of, and delete tasks. It interacts with the backend API service to fetch and manipulate task data. Styling is implemented using the `govuk-react` component library to align with the GOV.UK Design System.

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose installed.

## Setup & Running (Docker)

This service is designed to be run using Docker Compose from the project root.

1.  **Navigate to the project root directory:**
    ```bash
    cd ..
    ```
2.  **Ensure Backend Environment:** Make sure the `backend/.env` file is configured correctly as described in the root `README.md`.
3.  **Ensure Database Initialization:** Make sure the database has been initialized as described in the root `README.md` (`docker-compose run --rm backend python -m backend.init_db`).
4.  **Build and Start All Services:** From the project root, run:
    ```bash
    docker-compose up -d --build
    ```
    - This command builds both the frontend and backend images (if needed) and starts the database, backend, and frontend services.
5.  **Accessing the Frontend:** Open your web browser to:
    `http://localhost:3000`

## Development Notes

- The frontend is served via Nginx in the Docker container for production-like deployment.
- API calls are proxied to the backend service running on port 8000 (handled automatically by using the correct `API_BASE_URL` in `src/services/api.ts` which points to the backend service within the Docker network or the exposed port).
- Styling is implemented using `govuk-react`.

## Stopping the Application

From the project root:

```bash
docker-compose down
```
