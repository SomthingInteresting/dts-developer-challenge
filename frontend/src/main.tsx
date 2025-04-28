import React from "react";
import ReactDOM from "react-dom/client";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import App from "./App.tsx";
import "./index.css";
import "./styles/main.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <StyleSheetManager shouldForwardProp={isPropValid}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StyleSheetManager>
    </ErrorBoundary>
  </React.StrictMode>
);
