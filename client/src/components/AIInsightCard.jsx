import { useMemo, useState } from "react";
import { AlertTriangle, Info, Sparkles, Zap } from "lucide-react";
import api, { getApiError } from "../api/axios.js";

const AIInsightCard = ({ expenses }) => {
  const [insight, setInsight] = useState("");
  const [source, setSource] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categoryAmounts = useMemo(() => {
    const totals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {});
    return Object.entries(totals).map(([category, amount]) => ({ category, amount }));
  }, [expenses]);

  const analyze = async () => {
    if (!categoryAmounts.length) {
      setError("Add at least one expense before asking for an insight.");
      return;
    }
    setLoading(true);
    setError("");
    setInsight("");
    setSource(null);
    try {
      const { data } = await api.post("/api/finance/analyze", categoryAmounts);
      setInsight(data.insight);
      setSource(data.source === "fallback" ? "fallback" : "ai");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="bg-surface border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-[160ms]"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 4%, var(--color-surface)), var(--color-surface))`,
        borderColor: `color-mix(in srgb, var(--color-primary) 15%, var(--color-border))`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="inline-flex items-center gap-[0.35rem] text-primary text-[0.7rem] font-bold tracking-[0.08em] uppercase mb-[0.3rem]">
            <Sparkles size={11} />
            Gemini AI
          </p>
          <h2 className="text-[1.1rem] font-bold tracking-[-0.01em] m-0">Spending insight</h2>
        </div>
        <button
          type="button"
          onClick={analyze}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-[0.55rem] rounded-md font-semibold text-[0.85rem] bg-primary text-white shadow-sm hover:bg-primary-hover hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed transition-all duration-[160ms] whitespace-nowrap"
        >
          {loading ? (
            <><span className="spinner spinner-white" />Analyzing…</>
          ) : (
            <><Zap size={14} />Analyze</>
          )}
        </button>
      </div>

      {error && (
        <p className="flex items-start gap-[0.6rem] bg-danger-soft border border-[color-mix(in_srgb,var(--color-danger)_25%,transparent)] text-danger rounded-md text-[0.875rem] p-3 mb-4">
          <AlertTriangle size={15} className="flex-shrink-0" />
          {error}
        </p>
      )}

      <p className={`text-[0.95rem] leading-[1.65] m-0 ${!insight ? "text-text-muted" : "text-text-base"}`}>
        {insight || "Click Analyze to get a concise spending summary, two cutback areas, and one saving tip."}
      </p>

      {source === "fallback" && (
        <p className="inline-flex items-center gap-[0.4rem] bg-warning-soft text-warning rounded-sm text-[0.75rem] font-semibold px-[0.7rem] py-[0.4rem] mt-3">
          <AlertTriangle size={12} />
          AI unavailable — showing local analysis
        </p>
      )}

      <p className="flex items-start gap-[0.4rem] border-t border-border text-text-subtle text-[0.72rem] leading-[1.5] mt-4 pt-[0.85rem]">
        <Info size={11} className="flex-shrink-0 mt-[1px]" />
        AI-generated insights may be inaccurate or out of context. Always verify before making
        financial decisions.
      </p>
    </section>
  );
};

export default AIInsightCard;
