import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to the Express server in development — avoids CORS issues
    // and means VITE_API_BASE_URL is only needed in production builds
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks for better caching
        manualChunks: {
          redux: ["@reduxjs/toolkit", "react-redux"],
          router: ["react-router-dom"],
          charts: ["recharts"]
        }
      }
    }
  }
});
