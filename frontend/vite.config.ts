/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Optional: Use Vitest globals like describe, it
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts", // Path to setup file
    // Optional: Configure CSS processing if needed
    // css: true,
  },
});
