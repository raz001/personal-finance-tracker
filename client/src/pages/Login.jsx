import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Lock, Mail, Wallet } from "lucide-react";
import { clearAuthError, loginUser } from "../features/auth/authSlice.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate, token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="auth-shell">
      {/* Shared nav — same as landing so the brand is always visible */}
      <nav className="landing-nav">
        <Link to="/" className="brand">
          <div className="brand-logo">
            <Wallet size={16} />
          </div>
          Finio
        </Link>
        <div className="landing-nav-actions">
          <ThemeToggle />
          <Link to="/register" className="ghost-button" style={{ fontSize: "0.875rem" }}>
            Create account
          </Link>
        </div>
      </nav>

      <main className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <Link to="/" className="auth-back">
            <ArrowLeft size={14} />
            Back to home
          </Link>

          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>Log in</h1>
          </div>

          {error && (
            <p className="alert alert-error">
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              {error}
            </p>
          )}

          <label>
            Email
            <div className="input-icon-wrap">
              <Mail size={15} className="input-icon" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </label>

          <label>
            Password
            <div className="input-icon-wrap">
              <Lock size={15} className="input-icon" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ borderTopColor: "white" }} />
                Logging in…
              </>
            ) : (
              "Log in"
            )}
          </button>

          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
