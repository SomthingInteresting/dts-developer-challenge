import React from "react";
import ReactDOM from "react-dom/client";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import App from "./App.tsx";
import "./index.css";
import "./styles/main.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StyleSheetManager>
  </React.StrictMode>
);
