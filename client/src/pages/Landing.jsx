import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight, BarChart3, CalendarDays, CheckCircle2,
  ReceiptText, Smartphone, Sparkles, TrendingDown, Wallet
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";

const FEATURES = [
  { icon: ReceiptText, tone: "primary",  title: "Expense tracking",    description: "Log every rupee with title, category, date, and notes. Edit or delete entries in one click." },
  { icon: BarChart3,   tone: "success",  title: "Spending chart",      description: "Interactive donut chart breaks your spending into categories so you see exactly where money goes." },
  { icon: Sparkles,    tone: "warning",  title: "AI-powered insights", description: "Google Gemini analyses your monthly data and surfaces your top cutback areas with a saving tip." },
  { icon: CalendarDays,tone: "primary",  title: "Monthly overview",    description: "Filter by any month and year to review past spending. Step forward and back with a single click." },
  { icon: TrendingDown,tone: "success",  title: "Spot your habits",    description: "See your top spending category, average per transaction, and total at a glance — every time you open the app." },
  { icon: Smartphone,  tone: "purple",   title: "Works everywhere",    description: "Fully responsive on mobile, tablet, and desktop. Light and dark theme included." },
];

const MOCK_EXPENSES = [
  { category: "Food",          color: "var(--cat-food)",          title: "Swiggy order",  amount: "₹349",   date: "Today" },
  { category: "Transport",     color: "var(--cat-transport)",     title: "Ola cab",       amount: "₹180",   date: "Yesterday" },
  { category: "Entertainment", color: "var(--cat-entertainment)", title: "Netflix",       amount: "₹649",   date: "12 May" },
  { category: "Shopping",      color: "var(--cat-shopping)",      title: "Amazon order",  amount: "₹1,299", date: "10 May" },
];

const PERKS = ["Free to use", "No credit card", "Set up in 2 minutes"];

const primaryBtn = "inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold bg-primary text-white shadow-sm hover:bg-primary-hover hover:-translate-y-px hover:shadow-md active:translate-y-0 transition-all duration-[160ms] whitespace-nowrap";
const ghostBtn   = "inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold bg-surface-2 text-text-base border border-border hover:bg-surface-hover hover:border-border-strong transition-colors duration-[160ms] whitespace-nowrap";

const Landing = () => {
  const token = useSelector((state) => state.auth.token);
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div>
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between gap-4 px-8 py-[0.85rem] backdrop-blur-sm bg-[color-mix(in_srgb,var(--color-surface)_80%,transparent)] border-b border-border">
        <div className="flex items-center gap-[0.65rem] font-bold tracking-[-0.01em] text-text-base">
          <div className="flex items-center justify-center w-[30px] h-[30px] rounded-sm bg-primary text-white">
            <Wallet size={16} />
          </div>
          Finio
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className={ghostBtn} style={{ fontSize: "0.875rem" }}>Log in</Link>
          <Link to="/register" className={primaryBtn} style={{ fontSize: "0.875rem" }}>
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid grid-cols-2 gap-12 items-center mx-auto max-w-[1200px] px-8 py-16 pb-20 max-[860px]:grid-cols-1 max-[860px]:text-center max-[860px]:py-12">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-[0.4rem] bg-primary-soft border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] rounded-full text-primary text-[0.75rem] font-bold tracking-[0.04em] px-[0.85rem] py-[0.35rem] w-fit max-[860px]:mx-auto">
            <Sparkles size={12} />
            Powered by Google Gemini
          </div>

          <h1 className="text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold tracking-[-0.03em] leading-[1.1] m-0">
            Know exactly where<br />
            <span className="hero-heading-accent">your money goes</span>
          </h1>

          <p className="text-text-muted text-[1.1rem] leading-[1.65] m-0 max-w-[480px] max-[860px]:mx-auto">
            Track expenses, visualise spending by category, and get AI-powered insights — all in one clean dashboard.
          </p>

          <div className="flex flex-wrap gap-3 items-center max-[860px]:justify-center">
            <Link to="/register" className={`${primaryBtn} text-[1rem] min-h-[48px] px-6 py-3`}>
              Start tracking for free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className={ghostBtn}>I have an account</Link>
          </div>

          <ul className="flex flex-wrap gap-5 text-text-muted text-[0.85rem] list-none m-0 p-0 max-[860px]:justify-center">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-[0.4rem]">
                <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Preview card */}
        <div className="relative max-[860px]:hidden">
          <div className="relative z-10 bg-surface border border-border rounded-xl shadow-lg flex flex-col gap-4 p-6 overflow-hidden">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total spent", value: "₹8,430" },
                { label: "Transactions", value: "14" },
                { label: "Top category", value: "Shopping", color: "var(--cat-shopping)" }
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-surface-2 rounded-md flex flex-col gap-[0.2rem] p-3">
                  <span className="text-text-subtle text-[0.65rem] font-bold tracking-[0.06em] uppercase">{label}</span>
                  <span className="text-[1rem] font-bold tracking-[-0.01em]" style={color ? { color } : {}}>{value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-[0.4rem]">
              {MOCK_EXPENSES.map((e) => (
                <div key={e.title} className="flex items-center gap-3 border border-border rounded-md px-3 py-[0.6rem]">
                  <div className="rounded-sm flex-shrink-0 w-7 h-7" style={{ background: `color-mix(in srgb, ${e.color} 15%, transparent)` }} />
                  <div className="flex flex-col gap-[0.1rem] flex-1 min-w-0">
                    <span className="text-[0.85rem] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{e.title}</span>
                    <span className="text-text-subtle text-[0.72rem]">{e.category} · {e.date}</span>
                  </div>
                  <span className="text-[0.9rem] font-bold tracking-[-0.01em]">{e.amount}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 bg-primary-soft border border-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] rounded-md text-text-muted text-[0.78rem] leading-[1.5] px-[0.85rem] py-[0.65rem]">
              <Sparkles size={12} className="text-primary flex-shrink-0 mt-[1px]" />
              <span>Your top spend is Shopping. Consider setting a weekly cap to save more.</span>
            </div>
          </div>
          {/* Blobs */}
          <div className="absolute rounded-full pointer-events-none z-0 w-[280px] h-[280px] -right-[60px] -top-[60px] blur-[60px] bg-[rgba(99,102,241,0.18)]" />
          <div className="absolute rounded-full pointer-events-none z-0 w-[220px] h-[220px] -left-[40px] -bottom-[60px] blur-[60px] bg-[rgba(16,185,129,0.14)]" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-2 border-t border-b border-border py-20 px-8 text-center max-[640px]:py-14 max-[640px]:px-4">
        <div className="inline-flex items-center gap-[0.4rem] text-primary text-[0.72rem] font-bold tracking-[0.08em] uppercase mb-3">
          <Sparkles size={12} />
          Everything you need
        </div>
        <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold tracking-[-0.02em] mx-auto mb-3 max-w-[560px]">
          Built for real personal finance
        </h2>
        <p className="text-text-muted text-[1rem] leading-[1.65] mx-auto mb-12 max-w-[520px]">
          No bloat, no subscriptions. Just the tools that actually help you understand and improve your spending.
        </p>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] mx-auto max-w-[1100px] text-left">
          {FEATURES.map(({ icon: Icon, tone, title, description }) => (
            <div key={title} className="bg-surface border border-border rounded-lg shadow-xs flex flex-col gap-[0.6rem] p-6 hover:border-border-strong hover:shadow-md hover:-translate-y-[3px] transition-all duration-[160ms]">
              <div className={`feature-icon feature-icon--${tone} inline-flex items-center justify-center w-11 h-11 rounded-md mb-1`}>
                <Icon size={20} />
              </div>
              <h3 className="text-[1rem] font-bold m-0">{title}</h3>
              <p className="text-text-muted text-[0.9rem] leading-[1.6] m-0">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 text-center max-[640px]:py-14 max-[640px]:px-4">
        <div className="bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] to-[color-mix(in_srgb,#8b5cf6_6%,var(--color-surface))] border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--color-border))] rounded-xl mx-auto max-w-[640px] px-8 py-14">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-extrabold tracking-[-0.02em] m-0 mb-3">Ready to take control?</h2>
          <p className="text-text-muted text-[1rem] m-0 mb-8">Create a free account and start tracking in under two minutes.</p>
          <Link to="/register" className={`${primaryBtn} text-[1rem] min-h-[48px] px-8 py-3`}>
            Get started — it's free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-8 py-6 max-[640px]:flex-col max-[640px]:px-4 max-[640px]:text-center">
        <div className="flex items-center gap-[0.65rem] font-bold tracking-[-0.01em] text-text-base opacity-70">
          <div className="flex items-center justify-center w-6 h-6 rounded-sm bg-primary text-white">
            <Wallet size={13} />
          </div>
          Finio
        </div>
        <p className="text-text-subtle text-[0.85rem] m-0">
          Built with React, Node.js &amp; MongoDB.{" "}
          <a href="https://github.com/raz001/personal-finance-tracker" target="_blank" rel="noopener noreferrer"
            className="text-primary font-semibold hover:text-primary-hover">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
