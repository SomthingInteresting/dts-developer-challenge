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
