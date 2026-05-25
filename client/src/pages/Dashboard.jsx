import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowDownUp, BarChart3, LogOut, MessageCircle,
  Settings, TrendingDown, Wallet, X
} from "lucide-react";

import AIInsightCard from "../components/AIInsightCard.jsx";
import BudgetGoals from "../components/BudgetGoals.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import FinanceChat from "../components/FinanceChat.jsx";
import MonthFilter from "../components/MonthFilter.jsx";
import SkeletonDashboard from "../components/SkeletonDashboard.jsx";
import SpendingChart from "../components/SpendingChart.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

import { logout } from "../features/auth/authSlice.js";
import {
  addExpense, clearExpenseError, deleteExpense, fetchExpenses, updateExpense
} from "../features/expenses/expenseSlice.js";
import { formatCurrency } from "../lib/format.js";
import { getCategoryMeta } from "../lib/categories.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const iconBtn = "flex items-center justify-center w-9 h-9 min-w-[36px] rounded-md bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-base transition-colors duration-[160ms] p-[0.4rem]";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { expenses, loading, error } = useSelector((state) => state.expenses);

  const today = new Date();
  const [filter, setFilter] = useState({ month: today.getMonth() + 1, year: today.getFullYear() });
  const [editingExpense, setEditingExpense] = useState(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Track whether we're on a narrow screen — chat renders as modal instead of sidebar
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 1100px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1100px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    dispatch(fetchExpenses(filter)).then(() => setInitialLoaded(true));
  }, [dispatch, filter]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearExpenseError()); }
  }, [error, dispatch]);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount), 0), [expenses]
  );

  const topCategory = useMemo(() => {
    if (!expenses.length) return null;
    const totals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});
    const [name, amount] = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    return { name, amount };
  }, [expenses]);

  const avgExpense = useMemo(
    () => (expenses.length ? totalSpent / expenses.length : 0), [expenses, totalSpent]
  );

  const handleSubmit = async (expense) => {
    try {
      if (editingExpense) {
        await dispatch(updateExpense({ id: editingExpense._id, expense })).unwrap();
        toast.success("Expense updated");
        setEditingExpense(null);
      } else {
        await dispatch(addExpense(expense)).unwrap();
        toast.success("Expense added");
      }
    } catch (err) { toast.error(err || "Something went wrong"); }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
      toast.success("Expense deleted");
    } catch (err) { toast.error(err || "Could not delete expense"); }
  };

  const handleLogout = () => { dispatch(logout()); toast.success("Logged out"); };

  const topCategoryMeta = topCategory ? getCategoryMeta(topCategory.name) : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-[0.85rem] backdrop-blur-sm bg-[color-mix(in_srgb,var(--color-surface)_80%,transparent)] border-b border-border">
        <div className="flex items-center gap-[0.65rem] font-bold tracking-[-0.01em] text-text-base">
          <div className="flex items-center justify-center w-[30px] h-[30px] rounded-sm bg-primary text-white">
            <Wallet size={16} />
          </div>
          Finio
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/account" className="inline-flex items-center gap-2 bg-surface-2 border border-border rounded-full text-text-base text-[0.875rem] font-semibold max-w-[200px] px-3 pl-[0.3rem] py-[0.3rem] hover:bg-surface-hover hover:border-border-strong transition-colors duration-[160ms] no-underline" title="Account settings">
            <div className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full bg-primary text-white text-[0.75rem] font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap max-[640px]:hidden">{user?.name}</span>
            <Settings size={13} className="text-text-muted ml-[2px]" />
          </Link>
          <button type="button" className={iconBtn} onClick={handleLogout} title="Logout" aria-label="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Dashboard shell */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 min-w-0 overflow-y-auto px-4 py-8 pb-16 max-[640px]:px-3 max-[640px]:py-5">
          {/* Centered content container */}
          <div className="mx-auto max-w-[1280px]">

            {/* Greeting */}
            <div className="mb-7">
              <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-[-0.02em] m-0">
                Hi, {user?.name?.split(" ")[0] || "there"} 👋
              </h1>
              <p className="text-text-muted mt-[0.4rem] m-0">
                {MONTHS[filter.month - 1]} {filter.year} — here's your spending overview.
              </p>
            </div>

            {!initialLoaded ? (
              <SkeletonDashboard />
            ) : (
              <>
                {/* Stat cards */}
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] mb-7">
                  {/* Total spent */}
                  <div className="bg-surface border border-border rounded-lg shadow-xs flex gap-4 p-5 hover:border-border-strong hover:shadow-md hover:-translate-y-[2px] transition-all duration-[160ms]">
                    <div className="stat-icon flex-shrink-0 w-11 h-11 rounded-md inline-flex items-center justify-center" data-tone="primary">
                      <Wallet size={20} />
                    </div>
                    <div className="grid gap-[0.2rem] min-w-0">
                      <p className="text-text-muted text-[0.8rem] font-semibold uppercase tracking-[0.04em] m-0">Total spent</p>
                      <p className="text-[1.4rem] font-bold tracking-[-0.02em] m-0 overflow-hidden text-ellipsis whitespace-nowrap">{formatCurrency(totalSpent)}</p>
                      <p className="text-text-subtle text-[0.8rem] m-0">{MONTHS[filter.month - 1]} {filter.year}</p>
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="bg-surface border border-border rounded-lg shadow-xs flex gap-4 p-5 hover:border-border-strong hover:shadow-md hover:-translate-y-[2px] transition-all duration-[160ms]">
                    <div className="stat-icon flex-shrink-0 w-11 h-11 rounded-md inline-flex items-center justify-center" data-tone="success">
                      <ArrowDownUp size={20} />
                    </div>
                    <div className="grid gap-[0.2rem] min-w-0">
                      <p className="text-text-muted text-[0.8rem] font-semibold uppercase tracking-[0.04em] m-0">Transactions</p>
                      <p className="text-[1.4rem] font-bold tracking-[-0.02em] m-0">{expenses.length}</p>
                      <p className="text-text-subtle text-[0.8rem] m-0">this month</p>
                    </div>
                  </div>

                  {/* Top category */}
                  <div className="bg-surface border border-border rounded-lg shadow-xs flex gap-4 p-5 hover:border-border-strong hover:shadow-md hover:-translate-y-[2px] transition-all duration-[160ms]">
                    <div
                      className="stat-icon flex-shrink-0 w-11 h-11 rounded-md inline-flex items-center justify-center"
                      data-tone="warning"
                      style={topCategoryMeta ? {
                        background: `color-mix(in srgb, ${topCategoryMeta.color} 12%, transparent)`,
                        color: topCategoryMeta.color
                      } : undefined}
                    >
                      <BarChart3 size={20} />
                    </div>
                    <div className="grid gap-[0.2rem] min-w-0">
                      <p className="text-text-muted text-[0.8rem] font-semibold uppercase tracking-[0.04em] m-0">Top category</p>
                      <p className="text-[1.1rem] font-bold tracking-[-0.02em] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                        {topCategory ? topCategory.name : "—"}
                      </p>
                      <p className="text-text-subtle text-[0.8rem] m-0">
                        {topCategory ? formatCurrency(topCategory.amount) : "no data"}
                      </p>
                    </div>
                  </div>

                  {/* Avg per expense */}
                  <div className="bg-surface border border-border rounded-lg shadow-xs flex gap-4 p-5 hover:border-border-strong hover:shadow-md hover:-translate-y-[2px] transition-all duration-[160ms]">
                    <div className="stat-icon flex-shrink-0 w-11 h-11 rounded-md inline-flex items-center justify-center" data-tone="danger">
                      <TrendingDown size={20} />
                    </div>
                    <div className="grid gap-[0.2rem] min-w-0">
                      <p className="text-text-muted text-[0.8rem] font-semibold uppercase tracking-[0.04em] m-0">Avg per expense</p>
                      <p className="text-[1.4rem] font-bold tracking-[-0.02em] m-0 overflow-hidden text-ellipsis whitespace-nowrap">{formatCurrency(avgExpense)}</p>
                      <p className="text-text-subtle text-[0.8rem] m-0">across {expenses.length} entries</p>
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-surface border border-border rounded-lg shadow-xs px-5 py-[0.85rem] mb-6">
                  <span className="flex items-center gap-2 font-semibold">
                    <BarChart3 size={16} />
                    Viewing {MONTHS[filter.month - 1]} {filter.year}
                  </span>
                  <MonthFilter month={filter.month} year={filter.year} onChange={setFilter} />
                </div>

                {/* Main grid */}
                <div className="dashboard-grid">
                  <div className="grid gap-5 self-start">
                    <ExpenseForm
                      editingExpense={editingExpense}
                      onCancelEdit={() => setEditingExpense(null)}
                      onSubmit={handleSubmit}
                      loading={loading}
                    />
                    <AIInsightCard expenses={expenses} />
                  </div>
                  <div className="grid gap-5">
                    <BudgetGoals expenses={expenses} month={filter.month} year={filter.year} />
                    <SpendingChart expenses={expenses} />
                    <ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDelete} />
                  </div>
                </div>
              </>
            )}
          </div>{/* end centered container */}
        </main>

        {/* Persistent chat sidebar — desktop only (hidden via CSS on mobile) */}
        <aside
          className="chat-sidebar"
          data-open={sidebarOpen}
          aria-label="AI chat"
          aria-hidden={!sidebarOpen}
        >
          {!isMobile && (
            <FinanceChat
              expenses={expenses}
              month={filter.month}
              year={filter.year}
              onClose={() => setSidebarOpen(false)}
            />
          )}
        </aside>

        {/* Floating chat FAB — always visible, bottom-right corner */}
        <div className="fixed bottom-6 right-6 z-40 group">
          {/* Custom tooltip — appears above the FAB on hover */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg text-[0.78rem] font-medium whitespace-nowrap shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-[160ms]"
            style={{ background: "#1e293b", color: "#f1f5f9" }}
          >
            {sidebarOpen ? "Close chat" : "Chat with your finances"}
            {/* Arrow */}
            <span className="absolute top-full right-5 border-4 border-transparent"
              style={{ borderTopColor: "#1e293b" }}
            />
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Close AI chat" : "Open AI chat"}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-[160ms] hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
            style={{
              background: sidebarOpen ? "var(--color-primary-hover)" : "var(--color-primary)",
              color: "white"
            }}
          >
            {sidebarOpen ? <X size={22} /> : <MessageCircle size={24} />}
          </button>
        </div>

        {/* Mobile chat modal — shown instead of sidebar on narrow screens */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col justify-end"
            style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-full max-h-[85vh] flex flex-col rounded-t-2xl overflow-hidden"
              style={{ background: "var(--color-surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--color-border-strong)" }} />
              </div>
              <FinanceChat
                expenses={expenses}
                month={filter.month}
                year={filter.year}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
