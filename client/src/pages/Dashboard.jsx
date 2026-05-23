import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowDownUp,
  BarChart3,
  LogOut,
  Settings,
  TrendingDown,
  Wallet
} from "lucide-react";

import AIInsightCard from "../components/AIInsightCard.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import MonthFilter from "../components/MonthFilter.jsx";
import SkeletonDashboard from "../components/SkeletonDashboard.jsx";
import SpendingChart from "../components/SpendingChart.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

import { logout } from "../features/auth/authSlice.js";
import {
  addExpense,
  clearExpenseError,
  deleteExpense,
  fetchExpenses,
  updateExpense
} from "../features/expenses/expenseSlice.js";
import { formatCurrency } from "../lib/format.js";
import { getCategoryMeta } from "../lib/categories.js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { expenses, loading, error } = useSelector((state) => state.expenses);

  const today = new Date();
  const [filter, setFilter] = useState({
    month: today.getMonth() + 1,
    year: today.getFullYear()
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Fetch on mount and whenever the filter changes
  useEffect(() => {
    dispatch(fetchExpenses(filter)).then(() => setInitialLoaded(true));
  }, [dispatch, filter]);

  // Surface Redux errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearExpenseError());
    }
  }, [error, dispatch]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [expenses]
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
    () => (expenses.length ? totalSpent / expenses.length : 0),
    [expenses, totalSpent]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
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
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
      toast.success("Expense deleted");
    } catch (err) {
      toast.error(err || "Could not delete expense");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const topCategoryMeta = topCategory ? getCategoryMeta(topCategory.name) : null;

  return (
    <div className="app-shell">
      {/* ── Sticky header ── */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">
            <Wallet size={16} />
          </div>
          Finio
        </div>

        <div className="user-menu">
          <ThemeToggle />
          <Link to="/account" className="user-chip" title="Account settings">
            <div className="user-avatar">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span>{user?.name}</span>
            <Settings size={13} style={{ color: "var(--color-text-muted)", marginLeft: 2 }} />
          </Link>
          <button
            type="button"
            className="icon-button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="dashboard">
        <div className="dashboard-greeting">
          <h1>Hi, {user?.name?.split(" ")[0] || "there"} 👋</h1>
          <p>
            {MONTHS[filter.month - 1]} {filter.year} — here's your spending overview.
          </p>
        </div>

        {!initialLoaded ? (
          <SkeletonDashboard />
        ) : (
          <>
            {/* ── Stat cards ── */}
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-icon" data-tone="primary">
                  <Wallet size={20} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total spent</p>
                  <p className="stat-value">{formatCurrency(totalSpent)}</p>
                  <p className="stat-meta">{MONTHS[filter.month - 1]} {filter.year}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" data-tone="success">
                  <ArrowDownUp size={20} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Transactions</p>
                  <p className="stat-value">{expenses.length}</p>
                  <p className="stat-meta">this month</p>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon"
                  data-tone="warning"
                  style={
                    topCategoryMeta
                      ? {
                          background: `color-mix(in srgb, ${topCategoryMeta.color} 12%, transparent)`,
                          color: topCategoryMeta.color
                        }
                      : undefined
                  }
                >
                  <BarChart3 size={20} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Top category</p>
                  <p className="stat-value" style={{ fontSize: "1.1rem" }}>
                    {topCategory ? topCategory.name : "—"}
                  </p>
                  <p className="stat-meta">
                    {topCategory ? formatCurrency(topCategory.amount) : "no data"}
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" data-tone="danger">
                  <TrendingDown size={20} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Avg per expense</p>
                  <p className="stat-value">{formatCurrency(avgExpense)}</p>
                  <p className="stat-meta">across {expenses.length} entries</p>
                </div>
              </div>
            </div>

            {/* ── Toolbar with month filter ── */}
            <div className="toolbar">
              <span className="toolbar-title">
                <BarChart3 size={16} />
                Viewing {MONTHS[filter.month - 1]} {filter.year}
              </span>
              <MonthFilter
                month={filter.month}
                year={filter.year}
                onChange={setFilter}
              />
            </div>

            {/* ── Main grid ── */}
            <div className="dashboard-grid">
              <div className="left-column">
                <ExpenseForm
                  editingExpense={editingExpense}
                  onCancelEdit={() => setEditingExpense(null)}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
                <AIInsightCard expenses={expenses} />
              </div>
              <div className="right-column">
                <SpendingChart expenses={expenses} />
                <ExpenseList
                  expenses={expenses}
                  onEdit={setEditingExpense}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
