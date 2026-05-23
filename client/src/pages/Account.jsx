import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  KeyRound,
  LogOut,
  Mail,
  ReceiptText,
  Save,
  Trash2,
  User,
  Wallet
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { logout, updateProfile } from "../features/auth/authSlice.js";
import api, { getApiError } from "../api/axios.js";

/* ── small section wrapper ─────────────────────────────────── */
const Section = ({ title, description, children }) => (
  <div className="account-section">
    <div className="account-section-header">
      <h2 className="account-section-title">{title}</h2>
      {description && <p className="account-section-desc">{description}</p>}
    </div>
    <div className="account-section-body">{children}</div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const Account = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ── Profile form ──────────────────────────────────────────
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Password form ─────────────────────────────────────────
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Stats from server ─────────────────────────────────────
  const [stats, setStats] = useState(null);

  // ── Delete account dialog ─────────────────────────────────
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch profile stats on mount
  useEffect(() => {
    api.get("/api/user/profile")
      .then(({ data }) => setStats(data))
      .catch(() => {}); // non-critical, silently ignore
  }, []);

  // ── Handlers ─────────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error("Name and email cannot be empty");
      return;
    }
    setProfileLoading(true);
    try {
      await dispatch(updateProfile(profile)).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err || "Could not update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put("/api/user/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Enter your password to confirm deletion");
      return;
    }
    setDeleteLoading(true);
    try {
      await api.delete("/api/user/account", { data: { password: deletePassword } });
      toast.success("Account deleted");
      dispatch(logout());
    } catch (err) {
      toast.error(getApiError(err));
      setDeleteLoading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : stats?.createdAt
    ? new Date(stats.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo"><Wallet size={16} /></div>
          Finio
        </div>
        <div className="user-menu">
          <ThemeToggle />
          <Link to="/dashboard" className="ghost-button" style={{ fontSize: "0.875rem" }}>
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <button
            type="button"
            className="icon-button"
            onClick={() => dispatch(logout())}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="account-page">
        {/* Page title */}
        <div className="account-hero">
          <div className="account-avatar">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h1 className="account-name">{user?.name}</h1>
            <p className="account-email">{user?.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="account-stats">
          <div className="account-stat">
            <ReceiptText size={16} style={{ color: "var(--color-primary)" }} />
            <div>
              <p className="account-stat-value">{stats?.expenseCount ?? "—"}</p>
              <p className="account-stat-label">Total expenses</p>
            </div>
          </div>
          <div className="account-stat">
            <CalendarDays size={16} style={{ color: "var(--color-success)" }} />
            <div>
              <p className="account-stat-value">{memberSince}</p>
              <p className="account-stat-label">Member since</p>
            </div>
          </div>
          <div className="account-stat">
            <Mail size={16} style={{ color: "var(--color-warning)" }} />
            <div>
              <p className="account-stat-value" style={{ fontSize: "0.95rem" }}>{user?.email}</p>
              <p className="account-stat-label">Email address</p>
            </div>
          </div>
        </div>

        <div className="account-grid">
          {/* ── Profile ── */}
          <Section
            title="Profile"
            description="Update your display name and email address."
          >
            <form className="account-form" onSubmit={handleProfileSave} noValidate>
              <label>
                Full name
                <div className="input-icon-wrap">
                  <User size={15} className="input-icon" />
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                    maxLength={100}
                  />
                </div>
              </label>
              <label>
                Email address
                <div className="input-icon-wrap">
                  <Mail size={15} className="input-icon" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="primary-button" disabled={profileLoading}>
                  {profileLoading ? (
                    <><span className="spinner" style={{ borderTopColor: "white" }} />Saving…</>
                  ) : (
                    <><Save size={14} />Save changes</>
                  )}
                </button>
              </div>
            </form>
          </Section>

          {/* ── Password ── */}
          <Section
            title="Change password"
            description="Use a strong password of at least 6 characters."
          >
            <form className="account-form" onSubmit={handlePasswordChange} noValidate>
              <label>
                Current password
                <div className="input-icon-wrap">
                  <KeyRound size={15} className="input-icon" />
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </label>
              <label>
                New password
                <div className="input-icon-wrap">
                  <KeyRound size={15} className="input-icon" />
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </label>
              <label>
                Confirm new password
                <div className="input-icon-wrap">
                  <KeyRound size={15} className="input-icon" />
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Repeat new password"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </label>
              {passwords.newPassword &&
                passwords.confirmPassword &&
                passwords.newPassword !== passwords.confirmPassword && (
                  <p className="alert alert-error" style={{ marginTop: 0 }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    Passwords do not match
                  </p>
                )}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="primary-button" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <><span className="spinner" style={{ borderTopColor: "white" }} />Updating…</>
                  ) : (
                    <><KeyRound size={14} />Update password</>
                  )}
                </button>
              </div>
            </form>
          </Section>

          {/* ── Danger zone ── */}
          <Section
            title="Danger zone"
            description="Permanently delete your account and all expense data. This cannot be undone."
          >
            <div className="danger-zone">
              <div>
                <p className="danger-zone-title">Delete account</p>
                <p className="danger-zone-desc">
                  All your expenses will be permanently removed along with your account.
                </p>
              </div>
              <button
                type="button"
                className="danger-button danger-zone-btn"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 size={14} />
                Delete account
              </button>
            </div>
          </Section>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete your account?"
        description={
          <span>
            This will permanently delete your account and all expense data.
            <br /><br />
            <label style={{ display: "grid", gap: "0.4rem", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              Confirm with your password
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ marginTop: 0 }}
              />
            </label>
          </span>
        }
        confirmLabel={deleteLoading ? "Deleting…" : "Yes, delete everything"}
        destructive
        onConfirm={handleDeleteAccount}
        onCancel={() => { setDeleteOpen(false); setDeletePassword(""); }}
      />
    </div>
  );
};

export default Account;
