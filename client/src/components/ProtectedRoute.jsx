import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Apply the saved theme before the first render to avoid a flash of wrong theme
const applyStoredTheme = () => {
  const stored = localStorage.getItem("finioTheme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
};

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    applyStoredTheme();
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
