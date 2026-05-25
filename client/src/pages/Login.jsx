import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Lock, Mail, Wallet } from "lucide-react";
import { clearAuthError, loginUser } from "../features/auth/authSlice.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

const inputIconWrap = "relative";
const inputWithIcon = "pl-[2.4rem] py-[0.6rem] pr-[0.75rem] text-[0.9rem]";
const iconCls = "absolute left-[0.8rem] top-1/2 -translate-y-1/2 pointer-events-none text-text-subtle transition-colors duration-[160ms]";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);
  useEffect(() => { if (token) navigate("/dashboard", { replace: true }); }, [navigate, token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between gap-4 px-8 py-[0.85rem] backdrop-blur-sm bg-[color-mix(in_srgb,var(--color-surface)_80%,transparent)] border-b border-border">
        <Link to="/" className="flex items-center gap-[0.65rem] font-bold tracking-[-0.01em] text-text-base no-underline">
          <div className="flex items-center justify-center w-[30px] h-[30px] rounded-sm bg-primary text-white">
            <Wallet size={16} />
          </div>
          Finio
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold text-[0.875rem] bg-surface-2 text-text-base border border-border hover:bg-surface-hover hover:border-border-strong transition-colors duration-[160ms] whitespace-nowrap"
          >
            Create account
          </Link>
        </div>
      </nav>

      {/* Auth page */}
      <main className="auth-page-blobs flex flex-1 items-center justify-center overflow-hidden px-6 py-8 relative">
        <form
          className="relative z-10 bg-surface border border-border rounded-xl shadow-lg grid gap-[1.1rem] max-w-[440px] w-full p-9"
          onSubmit={handleSubmit}
          noValidate
        >
          <Link to="/" className="inline-flex items-center gap-[0.35rem] text-text-muted text-[0.8rem] font-semibold hover:text-text-base transition-colors duration-[160ms]">
            <ArrowLeft size={14} />
            Back to home
          </Link>

          <div>
            <p className="inline-flex items-center gap-[0.35rem] text-primary text-[0.7rem] font-bold tracking-[0.08em] uppercase mb-[0.3rem]">
              Welcome back
            </p>
            <h1 className="text-[1.75rem] font-bold tracking-[-0.02em] m-0">Log in</h1>
          </div>

          {error && (
            <p className="flex items-start gap-[0.6rem] bg-danger-soft border border-[color-mix(in_srgb,var(--color-danger)_25%,transparent)] text-danger rounded-md text-[0.875rem] p-3 m-0">
              <AlertTriangle size={15} className="flex-shrink-0" />
              {error}
            </p>
          )}

          <label className="text-text-muted text-[0.85rem] font-semibold grid gap-[0.4rem]">
            Email
            <div className={inputIconWrap}>
              <Mail size={15} className={iconCls} />
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" required autoComplete="email"
                className={inputWithIcon} />
            </div>
          </label>

          <label className="text-text-muted text-[0.85rem] font-semibold grid gap-[0.4rem]">
            Password
            <div className={inputIconWrap}>
              <Lock size={15} className={iconCls} />
              <input type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required autoComplete="current-password"
                className={inputWithIcon} />
            </div>
          </label>

          <button
            className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold bg-primary text-white shadow-sm hover:bg-primary-hover hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed transition-all duration-[160ms]"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner spinner-white" />Logging in…</>
            ) : "Log in"}
          </button>

          <p className="text-text-muted text-center mt-2">
            New here? <Link to="/register" className="text-primary font-semibold hover:text-primary-hover">Create an account</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
