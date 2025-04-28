# HMCTS Task Management System - Development Plan

## 1. Introduction

This document outlines the plan for developing the Task Management System as part of the HMCTS technical test. It details the chosen technology stack, architectural approach, and implementation steps.

## 2. Requirements Summary

The core objective is to build a full-stack application allowing caseworkers to manage tasks.

**Functional Requirements:**

- **Backend API:** Create, Read (all/by ID), Update (status), Delete tasks.
- **Task Properties:** Title (required), Description (optional), Status, Due Date/Time.
- **Frontend:** Interface for all CRUD operations, user-friendly display.

**Technical Requirements:**

- Backend & Frontend: Language/framework flexible.
- Database: Required for persistence.
- Unit Tests: Mandatory.
- Validation & Error Handling: Required.
- API Documentation: Required.
- Best Coding Practices & Helpful READMEs.

## 3. Technology Stack Choice & Rationale

Based on the flexibility offered ("Any language or framework of your choice") and aiming to showcase proficiency and best practices effectively, the following stack has been chosen:

- **Backend:** Python with FastAPI framework.
- **Frontend:** React with TypeScript, built using Vite.
- **Styling:** Standard HTML with **`govuk-frontend`** library (SCSS/CSS and JavaScript).
- **Database:** PostgreSQL.
- **Supporting Tools:** SQLAlchemy (ORM), Pydantic (Validation), Pytest (Testing), Axios (HTTP Client), Vitest/React Testing Library (Frontend Testing), Docker (for DB), **Sass** (for processing govuk-frontend styles).

**Rationale:**

- **Proficiency:** Selecting a familiar stack allows for faster development and a focus on code quality, structure, and best practices, rather than grappling with unfamiliar syntax or libraries under time pressure.
- **Modern Practices:** FastAPI and React/TS represent modern, widely-used technologies employing current best practices (async, type safety, component-based UI).
- **GOV.UK Alignment:** Using the official `govuk-frontend` library ensures visual consistency and adherence to the GOV.UK Design System standards.
- **Feature Alignment:** FastAPI provides automatic API documentation (Swagger UI) and uses Pydantic for robust validation, directly meeting technical requirements. React/TS enables building a type-safe, interactive user interface.

**Addressing HMCTS Stack (Java/JavaScript):**
While the chosen stack differs from the suggested Java/JavaScript starters, the fundamental skills are transferable:

- Python is a modern **Object-Oriented language**.
- React/TypeScript involves deep **JavaScript** knowledge and modern frontend development patterns.
- A strong foundation in web principles (**HTTP, JSON, REST**) and software design demonstrated here is applicable across stacks.
- There is a strong **willingness and ability to learn** the specific HMCTS Java/JavaScript stack if successful in the process, leveraging these foundational skills.

## 4. Architectural Overview

- **Client-Server:** A standard decoupled architecture. The React frontend acts as the client, consuming the backend API.
- **Backend:** FastAPI application serving a RESTful API over HTTP. It handles business logic, interacts with the database via the SQLAlchemy ORM, and uses Pydantic for data validation.
- **Frontend:** Single Page Application (SPA) built with React/TS. Manages UI state, interacts with the backend API via Axios, and renders the task management interface using standard HTML elements styled with **`govuk-frontend`** CSS classes.
- **Database:** PostgreSQL instance (run via Docker for ease of setup) storing task data.
- **API:** RESTful principles, using JSON for data interchange.

## 5. Implementation Steps Outline

1.  **Setup:** Initialise projects (backend/frontend), virtual environments, dependency management, Git repository. Setup Docker for PostgreSQL.
2.  **Database:** Define SQLAlchemy model (`Task`), configure database connection, potentially set up Alembic for migrations.
3.  **Backend:**
    - Develop Pydantic schemas for validation/serialisation.
    - Implement CRUD logic.
    - Create FastAPI endpoints (router).
    - Configure CORS.
    - Implement error handling.
    - Add basic logging.
    - Write unit/integration tests (Pytest).
    - Generate API documentation (Swagger UI).
4.  **Frontend:**
    - Setup API client (Axios).
    - Define TypeScript types.
    - Build React components (TaskList, TaskItem, TaskForm).
    - Implement state management.
    - Connect components to API client functions.
    - **Integrate `govuk-frontend` SCSS/CSS for styling.**
    - **Implement UI using standard HTML and `govuk-frontend` classes (Header, Footer, Table, Form elements, Buttons, Tags, Error Summary etc.).**
    - Implement loading/error states using standard components.
    - **Initialize `govuk-frontend` JavaScript.**
    - Write component tests (Vitest/RTL).
5.  **Finalisation:** Thoroughly update READMEs, final code review, ensure all requirements are met, push to GitHub.

## 6. Conclusion

This plan provides a clear roadmap for building the Task Management System. By leveraging a familiar, modern technology stack and focusing on best practices, testing, and documentation, the aim is to deliver a high-quality solution that meets the technical test requirements while showcasing strong software development fundamentals.
