import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle, ArrowLeft, CalendarDays, KeyRound,
  LogOut, Mail, ReceiptText, Save, Trash2, User, Wallet
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { logout, updateProfile } from "../features/auth/authSlice.js";
import api, { getApiError } from "../api/axios.js";

const inputIconWrap = "relative";
const inputWithIcon = "pl-[2.4rem] py-[0.6rem] pr-[0.75rem] text-[0.9rem]";
const iconCls = "absolute left-[0.8rem] top-1/2 -translate-y-1/2 pointer-events-none text-text-subtle transition-colors duration-[160ms]";
const primaryBtn = "inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold bg-primary text-white shadow-sm hover:bg-primary-hover hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed transition-all duration-[160ms] whitespace-nowrap";
const ghostBtn = "inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold bg-surface-2 text-text-base border border-border hover:bg-surface-hover hover:border-border-strong transition-colors duration-[160ms] whitespace-nowrap";

const Section = ({ title, description, isDanger, children }) => (
  <div className={`bg-surface border rounded-lg shadow-xs overflow-hidden account-section ${isDanger ? "" : "border-border"}`}>
    <div className="border-b border-border px-6 py-5">
      <h2 className={`text-[1rem] font-bold m-0 mb-[0.2rem] account-section-title ${isDanger ? "text-danger" : ""}`}>{title}</h2>
      {description && <p className="text-text-muted text-[0.85rem] m-0">{description}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Account = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    api.get("/api/user/profile").then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) { toast.error("Name and email cannot be empty"); return; }
    setProfileLoading(true);
    try {
      await dispatch(updateProfile(profile)).unwrap();
      toast.success("Profile updated");
    } catch (err) { toast.error(err || "Could not update profile"); }
    finally { setProfileLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error("New passwords do not match"); return; }
    setPasswordLoading(true);
    try {
      await api.put("/api/user/password", { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { toast.error(getApiError(err)); }
    finally { setPasswordLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { toast.error("Enter your password to confirm deletion"); return; }
    setDeleteLoading(true);
    try {
      await api.delete("/api/user/account", { data: { password: deletePassword } });
      toast.success("Account deleted");
      dispatch(logout());
    } catch (err) { toast.error(getApiError(err)); setDeleteLoading(false); }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : stats?.createdAt
    ? new Date(stats.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-[0.85rem] backdrop-blur-sm bg-[color-mix(in_srgb,var(--color-surface)_80%,transparent)] border-b border-border">
        <div className="flex items-center gap-[0.65rem] font-bold tracking-[-0.01em] text-text-base">
          <div className="flex items-center justify-center w-[30px] h-[30px] rounded-sm bg-primary text-white">
            <Wallet size={16} />
          </div>
          Finio
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/dashboard" className={ghostBtn} style={{ fontSize: "0.875rem" }}>
            <ArrowLeft size={14} />Dashboard
          </Link>
          <button type="button" className="flex items-center justify-center w-9 h-9 min-w-[36px] rounded-md bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-base transition-colors duration-[160ms] p-[0.4rem]"
            onClick={() => dispatch(logout())} title="Logout" aria-label="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[860px] w-full px-6 py-10 pb-20">
        {/* Identity */}
        <div className="flex items-center gap-5 mb-8">
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-full bg-gradient-to-br from-primary to-[#8b5cf6] text-white text-[1.75rem] font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h1 className="text-[1.5rem] font-bold tracking-[-0.02em] m-0 mb-[0.2rem]">{user?.name}</h1>
            <p className="text-text-muted text-[0.9rem] m-0">{user?.email}</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="bg-surface border border-border rounded-lg shadow-xs grid [grid-template-columns:repeat(3,1fr)] mb-8 overflow-hidden">
          {[
            { icon: <ReceiptText size={16} className="text-primary" />, value: stats?.expenseCount ?? "—", label: "Total expenses" },
            { icon: <CalendarDays size={16} className="text-success" />, value: memberSince, label: "Member since" },
            { icon: <Mail size={16} className="text-warning" />, value: user?.email, label: "Email address", small: true }
          ].map(({ icon, value, label, small }, i, arr) => (
            <div key={label} className={`flex items-center gap-[0.85rem] px-5 py-[1.1rem] ${i < arr.length - 1 ? "border-r border-border" : ""}`}>
              {icon}
              <div>
                <p className={`font-bold tracking-[-0.01em] m-0 ${small ? "text-[0.95rem]" : "text-[1.1rem]"}`}>{value}</p>
                <p className="text-text-muted text-[0.75rem] font-semibold tracking-[0.03em] uppercase m-0">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5">
          {/* Profile */}
          <Section title="Profile" description="Update your display name and email address.">
            <form className="grid gap-4" onSubmit={handleProfileSave} noValidate>
              <label className="text-text-muted text-[0.85rem] font-semibold grid gap-[0.4rem]">
                Full name
                <div className={inputIconWrap}>
                  <User size={15} className={iconCls} />
                  <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name" required maxLength={100} className={inputWithIcon} />
                </div>
              </label>
              <label className="text-text-muted text-[0.85rem] font-semibold grid gap-[0.4rem]">
                Email address
                <div className={inputIconWrap}>
                  <Mail size={15} className={iconCls} />
                  <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com" required className={inputWithIcon} />
                </div>
              </label>
              <div className="flex justify-end">
                <button type="submit" className={primaryBtn} disabled={profileLoading}>
                  {profileLoading ? <><span className="spinner spinner-white" />Saving…</> : <><Save size={14} />Save changes</>}
                </button>
              </div>
            </form>
          </Section>

          {/* Password */}
          <Section title="Change password" description="Use a strong password of at least 6 characters.">
            <form className="grid gap-4" onSubmit={handlePasswordChange} noValidate>
              {[
                { label: "Current password", key: "currentPassword", autoComplete: "current-password" },
                { label: "New password", key: "newPassword", autoComplete: "new-password", minLength: 6 },
                { label: "Confirm new password", key: "confirmPassword", autoComplete: "new-password" }
              ].map(({ label, key, autoComplete, minLength }) => (
                <label key={key} className="text-text-muted text-[0.85rem] font-semibold grid gap-[0.4rem]">
                  {label}
                  <div className={inputIconWrap}>
                    <KeyRound size={15} className={iconCls} />
                    <input type="password" value={passwords[key]}
                      onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder="••••••••" required autoComplete={autoComplete}
                      minLength={minLength} className={inputWithIcon} />
                  </div>
                </label>
              ))}
              {passwords.newPassword && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                <p className="flex items-start gap-[0.6rem] bg-danger-soft border border-[color-mix(in_srgb,var(--color-danger)_25%,transparent)] text-danger rounded-md text-[0.875rem] p-3 m-0">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                  Passwords do not match
                </p>
              )}
              <div className="flex justify-end">
                <button type="submit" className={primaryBtn} disabled={passwordLoading}>
                  {passwordLoading ? <><span className="spinner spinner-white" />Updating…</> : <><KeyRound size={14} />Update password</>}
                </button>
              </div>
            </form>
          </Section>

          {/* Danger zone */}
          <Section title="Danger zone" description="Permanently delete your account and all expense data. This cannot be undone." isDanger>
            <div className="danger-zone flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold m-0 mb-1">Delete account</p>
                <p className="text-text-muted text-[0.85rem] m-0">All your expenses will be permanently removed along with your account.</p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold bg-danger-soft text-danger hover:bg-danger hover:text-white transition-colors duration-[160ms] whitespace-nowrap flex-shrink-0"
              >
                <Trash2 size={14} />Delete account
              </button>
            </div>
          </Section>
        </div>
      </main>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete your account?"
        description={
          <span>
            This will permanently delete your account and all expense data.
            <br /><br />
            <label style={{ display: "grid", gap: "0.4rem", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              Confirm with your password
              <input type="password" value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" style={{ marginTop: 0 }} />
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
