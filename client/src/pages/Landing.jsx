import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ReceiptText,
  Smartphone,
  Sparkles,
  TrendingDown,
  Wallet
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";

/* ── Feature cards data ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: ReceiptText,
    tone: "primary",
    title: "Expense tracking",
    description:
      "Log every rupee with title, category, date, and notes. Edit or delete entries in one click."
  },
  {
    icon: BarChart3,
    tone: "success",
    title: "Spending chart",
    description:
      "Interactive donut chart breaks your spending into categories so you see exactly where money goes."
  },
  {
    icon: Sparkles,
    tone: "warning",
    title: "AI-powered insights",
    description:
      "Google Gemini analyses your monthly data and surfaces your top cutback areas with a saving tip."
  },
  {
    icon: CalendarDays,
    tone: "primary",
    title: "Monthly overview",
    description:
      "Filter by any month and year to review past spending. Step forward and back with a single click."
  },
  {
    icon: TrendingDown,
    tone: "success",
    title: "Spot your habits",
    description:
      "See your top spending category, average per transaction, and total at a glance — every time you open the app."
  },
  {
    icon: Smartphone,
    tone: "purple",
    title: "Works everywhere",
    description:
      "Fully responsive on mobile, tablet, and desktop. Light and dark theme included."
  }
];

/* ── Mock expense rows shown in the hero preview ────────────── */
const MOCK_EXPENSES = [
  { category: "Food",          color: "var(--cat-food)",          title: "Swiggy order",    amount: "₹349",  date: "Today" },
  { category: "Transport",     color: "var(--cat-transport)",     title: "Ola cab",         amount: "₹180",  date: "Yesterday" },
  { category: "Entertainment", color: "var(--cat-entertainment)", title: "Netflix",         amount: "₹649",  date: "12 May" },
  { category: "Shopping",      color: "var(--cat-shopping)",      title: "Amazon order",    amount: "₹1,299", date: "10 May" }
];

/* ── Checklist items under the CTA ─────────────────────────── */
const PERKS = ["Free to use", "No credit card", "Set up in 2 minutes"];

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const Landing = () => {
  const token = useSelector((state) => state.auth.token);

  // Already logged in → skip landing, go straight to dashboard
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing">

      {/* ── Nav ── */}
      <nav className="landing-nav">
        <div className="brand">
          <div className="brand-logo">
            <Wallet size={16} />
          </div>
          Finio
        </div>
        <div className="landing-nav-actions">
          <ThemeToggle />
          <Link to="/login" className="ghost-button" style={{ fontSize: "0.875rem" }}>
            Log in
          </Link>
          <Link to="/register" className="primary-button" style={{ fontSize: "0.875rem" }}>
            Get started
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={12} />
            Powered by Google Gemini
          </div>

          <h1 className="hero-heading">
            Know exactly where
            <br />
            <span className="hero-heading-accent">your money goes</span>
          </h1>

          <p className="hero-subheading">
            Track expenses, visualise spending by category, and get AI-powered
            insights — all in one clean dashboard.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="primary-button hero-cta-primary">
              Start tracking for free
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="ghost-button">
              I have an account
            </Link>
          </div>

          <ul className="hero-perks">
            {PERKS.map((perk) => (
              <li key={perk}>
                <CheckCircle2 size={14} />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Dashboard preview card ── */}
        <div className="hero-preview" aria-hidden="true">
          <div className="preview-card">
            {/* Mini stat strip */}
            <div className="preview-stats">
              <div className="preview-stat">
                <span className="preview-stat-label">Total spent</span>
                <span className="preview-stat-value">₹8,430</span>
              </div>
              <div className="preview-stat">
                <span className="preview-stat-label">Transactions</span>
                <span className="preview-stat-value">14</span>
              </div>
              <div className="preview-stat">
                <span className="preview-stat-label">Top category</span>
                <span className="preview-stat-value" style={{ color: "var(--cat-shopping)" }}>Shopping</span>
              </div>
            </div>

            {/* Mini expense list */}
            <div className="preview-list">
              {MOCK_EXPENSES.map((e) => (
                <div key={e.title} className="preview-row">
                  <div
                    className="preview-dot"
                    style={{ background: `color-mix(in srgb, ${e.color} 15%, transparent)`, color: e.color }}
                  />
                  <div className="preview-row-info">
                    <span className="preview-row-title">{e.title}</span>
                    <span className="preview-row-meta">{e.category} · {e.date}</span>
                  </div>
                  <span className="preview-row-amount">{e.amount}</span>
                </div>
              ))}
            </div>

            {/* Mini AI insight strip */}
            <div className="preview-insight">
              <Sparkles size={12} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
              <span>Your top spend is Shopping. Consider setting a weekly cap to save more.</span>
            </div>
          </div>

          {/* Decorative glow blobs */}
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="section-label">
          <Sparkles size={12} />
          Everything you need
        </div>
        <h2 className="section-heading">Built for real personal finance</h2>
        <p className="section-subheading">
          No bloat, no subscriptions. Just the tools that actually help you
          understand and improve your spending.
        </p>

        <div className="features-grid">
          {FEATURES.map(({ icon: Icon, tone, title, description }) => (
            <div key={title} className="feature-card">
              <div className={`feature-icon feature-icon--${tone}`}>
                <Icon size={20} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-description">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-heading">Ready to take control?</h2>
          <p className="cta-sub">
            Create a free account and start tracking in under two minutes.
          </p>
          <Link to="/register" className="primary-button cta-button">
            Get started — it's free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="brand" style={{ opacity: 0.7 }}>
          <div className="brand-logo" style={{ width: 24, height: 24 }}>
            <Wallet size={13} />
          </div>
          Finio
        </div>
        <p className="landing-footer-copy">
          Built with React, Node.js &amp; MongoDB.{" "}
          <a
            href="https://github.com/raz001/personal-finance-tracker"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
