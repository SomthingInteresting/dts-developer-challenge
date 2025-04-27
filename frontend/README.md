# Frontend Application (React/TypeScript)

## Overview

[Describe the role of this React application... provides UI for task management, interacts with the backend API]

## Prerequisites

- Node.js [Specify version, e.g., v18+]
- [npm/yarn]

## Setup

1.  **Navigate to this directory:**
    ```bash
    cd frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Environment Variables:**
    - Create a `.env.local` file in this directory (`frontend/.env.local`).
    - Add the following, ensuring it points to your running backend:
      ```dotenv
      VITE_API_BASE_URL=http://localhost:8000
      ```

## Running the Application

- **Start Development Server:**
  ```bash
  npm run dev
  # or yarn dev
  ```
- **Access Application:** Open your browser to `http://localhost:5173` (or the port specified by Vite).

## Running Tests

```bash
npm run test
# or yarn test
```

## Building for Production (Optional)

```bash
npm run build
# or yarn build
```

- The output will be in the `dist/` directory.

## Project Structure

```
frontend/
├── public/         # Static assets
├── src/
│   ├── components/   # Reusable React components
│   ├── services/     # API client (e.g., api.ts)
│   ├── types/        # TypeScript type definitions
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
├── .env.local      # Local environment variables (ignored by git)
├── index.html      # Main HTML page
├── package.json    # Project manifest and dependencies
├── tsconfig.json   # TypeScript configuration
├── vite.config.ts  # Vite configuration
└── README.md       # This file
```

## Key Dependencies

- React
- React DOM
- TypeScript
- Vite
- Axios (for API calls)
- Vitest (for testing)
- @testing-library/react
- [Add others as needed, e.g., state management, UI libraries]
