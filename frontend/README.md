# Frontend Service (React/Vite + TypeScript)

## Overview

This service provides the user interface for the Task Management application. It is built using React (with Vite) and TypeScript. Users can view, create, update the status of, and delete tasks. It interacts with the backend API service to fetch and manipulate task data.

Styling is implemented using the official **`govuk-frontend`** library (processed via Sass) and standard HTML elements to align with the GOV.UK Design System.

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose installed.
- Node.js and npm/yarn (only required for manual setup/development outside Docker).

## Setup & Running (Docker - Recommended)

This service is designed to be run using Docker Compose from the project root directory (`dts-developer-challenge`). Please refer to the main `README.md` in the root directory for detailed instructions on:

1.  Cloning the repository.
2.  Setting up the backend environment (`backend/.env`).
3.  Initializing the database (`docker-compose run --rm backend python -m backend.init_db`).
4.  Building and starting all services (`docker-compose up -d --build`).

Once the services are running, the frontend will be accessible at:
`http://localhost:3000`

## Development Notes

- **Styling:** `govuk-frontend` styles are imported and processed via Sass in `src/styles/main.scss`. Components use standard HTML elements with the appropriate `govuk-*` CSS classes.
- **GOV.UK JavaScript:** Essential JavaScript from `govuk-frontend` (for components like the header menu, error summary focusing, etc.) is initialised in `src/App.tsx` using `initAll()`.
- **API Interaction:** The frontend communicates with the backend API (running on port 8000 within the Docker network) via Axios. The base URL is configured in `src/services/api.ts`.
- **Docker Serving:** Within the Docker Compose setup, the built frontend assets are served by an Nginx container.

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Frontend-specific assets (if any)
│   ├── components/   # React components (TaskList, TaskItem, AddTaskForm)
│   ├── services/     # API interaction logic (api.ts)
│   ├── styles/       # SCSS files (main.scss)
│   ├── types/        # TypeScript type definitions (task.ts, govuk-frontend.d.ts)
│   ├── App.tsx       # Main application component
│   ├── main.tsx      # Application entry point
│   └── index.css     # Basic global styles
├── .gitignore
├── Dockerfile        # Docker build instructions (multi-stage)
├── index.html        # HTML entry point for Vite
├── nginx.conf        # Nginx configuration for serving
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md         # This file
```

## Key Dependencies

- React
- TypeScript
- Vite
- Axios
- @tanstack/react-query
- govuk-frontend
- sass

## Stopping the Application

From the project root directory, run:

```bash
docker-compose down
```
