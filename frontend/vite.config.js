// vite.config.js
// Vite configuration for the React frontend.
// The proxy setting forwards /api requests to the backend
// during development — no CORS issues, no hardcoded URLs.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend runs on port 3000
    proxy: {
      // Any request to /api/* will be forwarded to the backend
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
