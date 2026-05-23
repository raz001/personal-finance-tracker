import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { injectStore } from "./api/axios.js";
import { store } from "./app/store.js";
import "./styles/global.css";

// Give the axios interceptor a reference to the store without creating a
// circular import (axios ← store ← authSlice ← axios).
injectStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-lg)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              fontWeight: 500
            },
            success: {
              iconTheme: { primary: "var(--color-success)", secondary: "white" }
            },
            error: {
              iconTheme: { primary: "var(--color-danger)", secondary: "white" }
            }
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
