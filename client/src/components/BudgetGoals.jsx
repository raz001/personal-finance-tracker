import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Pencil, Target, X } from "lucide-react";
import { fetchBudget, saveBudget } from "../features/budgets/budgetSlice.js";
import { CATEGORIES, getCategoryMeta } from "../lib/categories.js";
import { formatCurrency } from "../lib/format.js";

const barColor = (pct) => {
  if (pct >= 90) return "var(--color-danger)";
  if (pct >= 70) return "var(--color-warning)";
  return "var(--color-success)";
};

const getSpentByCategory = (expenses) =>
  expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
    return acc;
  }, {});

const BudgetRow = ({ category, limit, spent }) => {
  const { icon: Icon, color } = getCategoryMeta(category);
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const rawPct = limit > 0 ? (spent / limit) * 100 : 0;
  const isOver = rawPct > 100;
  const fill = barColor(rawPct);

  return (
    <div className="grid gap-[0.4rem] mb-4 last:mb-0">
      <div className="flex items-center justify-between text-[0.85rem]">
        <span className="flex items-center gap-2 font-semibold">
          <Icon size={14} style={{ color, flexShrink: 0 }} />
          {category}
        </span>
        <span className="flex items-center text-text-muted text-[0.8rem]">
          {formatCurrency(spent)} / {formatCurrency(limit)}
          {isOver ? (
            <span className="ml-2 bg-danger-soft text-danger rounded-full text-[0.7rem] font-bold px-[0.6rem] py-[0.15rem]">
              Over budget
            </span>
          ) : (
            <span className="ml-2 font-bold" style={{ color: fill }}>
              {Math.round(rawPct)}%
            </span>
          )}
        </span>
      </div>
      <div className="bg-surface-2 rounded-full h-2 overflow-hidden w-full">
        <div
          className="budget-bar-fill"
          style={{ width: `${pct}%`, background: fill }}
          role="progressbar"
          aria-valuenow={Math.round(rawPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${category} budget: ${Math.round(rawPct)}% used`}
        />
      </div>
    </div>
  );
};

const EditRow = ({ category, value, onChange }) => {
  const { icon: Icon, color } = getCategoryMeta(category);
  return (
    <div className="grid gap-3 [grid-template-columns:1fr_auto] items-center mb-3">
      <span className="flex items-center gap-2 text-[0.875rem] font-semibold min-w-[110px]">
        <Icon size={14} style={{ color, flexShrink: 0 }} />
        {category}
      </span>
      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(e) => onChange(category, e.target.value)}
        placeholder="No limit"
        aria-label={`${category} budget limit`}
        className="max-w-[140px] w-[140px] py-2 px-3 text-right"
      />
    </div>
  );
};

const iconBtn = "flex items-center justify-center w-9 h-9 min-w-[36px] rounded-md bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-base transition-colors duration-[160ms] p-[0.4rem]";

const BudgetGoals = ({ expenses, month, year }) => {
  const dispatch = useDispatch();
  const { limits, loading, saving } = useSelector((state) => state.budgets);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({});

  useEffect(() => {
    dispatch(fetchBudget({ month, year }));
    setEditMode(false);
  }, [dispatch, month, year]);

  const enterEdit = () => {
    const initial = {};
    CATEGORIES.forEach((cat) => {
      initial[cat] = limits[cat] !== undefined ? String(limits[cat]) : "";
    });
    setDraft(initial);
    setEditMode(true);
  };

  const cancelEdit = () => { setEditMode(false); setDraft({}); };

  const handleDraftChange = (category, value) => {
    setDraft((prev) => ({ ...prev, [category]: value }));
  };

  const handleSave = async () => {
    const cleanedLimits = {};
    for (const [cat, val] of Object.entries(draft)) {
      if (val !== "" && val !== null && Number(val) >= 0) {
        cleanedLimits[cat] = Number(val);
      }
    }
    try {
      await dispatch(saveBudget({ month, year, limits: cleanedLimits })).unwrap();
      toast.success("Budget saved");
      setEditMode(false);
      setDraft({});
    } catch (err) {
      toast.error(err || "Could not save budget");
    }
  };

  const spentByCategory = getSpentByCategory(expenses);
  const categoriesWithLimits = CATEGORIES.filter((cat) => limits[cat] !== undefined);
  const onTrackCount = categoriesWithLimits.filter((cat) => {
    const pct = limits[cat] > 0 ? (spentByCategory[cat] || 0) / limits[cat] : 0;
    return pct < 0.9;
  }).length;
  const hasLimits = categoriesWithLimits.length > 0;

  return (
    <section className="bg-surface border border-border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-[160ms]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="inline-flex items-center gap-[0.35rem] text-primary text-[0.7rem] font-bold tracking-[0.08em] uppercase mb-[0.3rem]">
            <Target size={11} />
            Goals
          </p>
          <h2 className="text-[1.1rem] font-bold tracking-[-0.01em] m-0">
            {editMode ? "Set budget limits" : "Budget goals"}
          </h2>
        </div>
        {!editMode && (
          <button type="button" className={iconBtn} onClick={enterEdit} title="Edit budget" aria-label="Edit budget">
            <Pencil size={15} />
          </button>
        )}
        {editMode && (
          <button type="button" className={iconBtn} onClick={cancelEdit} title="Cancel" aria-label="Cancel editing">
            <X size={15} />
          </button>
        )}
      </div>

      {/* View mode */}
      {!editMode && (
        <>
          {loading ? (
            <div className="grid gap-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid gap-[0.4rem]">
                  <div className="skeleton-shimmer rounded-sm h-[14px] w-3/4" />
                  <div className="skeleton-shimmer rounded-sm h-2 w-full" />
                </div>
              ))}
            </div>
          ) : !hasLimits ? (
            <div className="flex flex-col items-center gap-2 text-text-muted py-8 px-4 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface-2 text-text-muted mb-2">
                <Target size={24} />
              </div>
              <p className="text-text-base font-semibold m-0">No budget set for this month</p>
              <p className="m-0 text-[0.875rem]">Set spending limits per category to track your goals.</p>
              <button
                type="button"
                onClick={enterEdit}
                className="mt-2 inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold text-[0.875rem] bg-primary text-white shadow-sm hover:bg-primary-hover hover:-translate-y-px hover:shadow-md active:translate-y-0 transition-all duration-[160ms]"
              >
                Set budget
              </button>
            </div>
          ) : (
            <>
              {categoriesWithLimits.map((cat) => (
                <BudgetRow key={cat} category={cat} limit={limits[cat]} spent={spentByCategory[cat] || 0} />
              ))}
              <p className="border-t border-border text-text-muted text-[0.82rem] mt-4 pt-[0.85rem] text-center">
                {onTrackCount} of {categoriesWithLimits.length}{" "}
                {categoriesWithLimits.length === 1 ? "category" : "categories"} on track
              </p>
            </>
          )}
        </>
      )}

      {/* Edit mode */}
      {editMode && (
        <>
          {CATEGORIES.map((cat) => (
            <EditRow key={cat} category={cat} value={draft[cat] ?? ""} onChange={handleDraftChange} />
          ))}
          <div className="flex gap-2 justify-end border-t border-border mt-5 pt-5">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold bg-surface-2 text-text-base border border-border hover:bg-surface-hover hover:border-border-strong transition-colors duration-[160ms] whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold bg-primary text-white shadow-sm hover:bg-primary-hover hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed transition-all duration-[160ms] whitespace-nowrap"
            >
              {saving ? (
                <><span className="spinner spinner-white" />Saving…</>
              ) : (
                "Save limits"
              )}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default BudgetGoals;
