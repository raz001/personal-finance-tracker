import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Lock, Mail, User, Wallet } from "lucide-react";
import { clearAuthError, registerUser } from "../features/auth/authSlice.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="auth-shell">
      {/* Shared nav */}
      <nav className="landing-nav">
        <Link to="/" className="brand">
          <div className="brand-logo">
            <Wallet size={16} />
          </div>
          Finio
        </Link>
        <div className="landing-nav-actions">
          <ThemeToggle />
          <Link to="/login" className="ghost-button" style={{ fontSize: "0.875rem" }}>
            Log in
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
            <p className="eyebrow">Get started</p>
            <h1>Create account</h1>
          </div>

          {error && (
            <p className="alert alert-error">
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              {error}
            </p>
          )}

          <label>
            Name
            <div className="input-icon-wrap">
              <User size={15} className="input-icon" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </div>
          </label>

          <label>
            Email
            <div className="input-icon-wrap">
              <Mail size={15} className="input-icon" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                minLength="6"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                autoComplete="new-password"
              />
            </div>
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ borderTopColor: "white" }} />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Register;
