import { useMemo, useState } from "react";
import { AlertTriangle, Info, Sparkles, Zap } from "lucide-react";
import api, { getApiError } from "../api/axios.js";

const AIInsightCard = ({ expenses }) => {
  const [insight, setInsight] = useState("");
  const [source, setSource] = useState(null); // "ai" | "fallback"
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
    <section className="panel insight-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">
            <Sparkles size={11} />
            Gemini AI
          </p>
          <h2>Spending insight</h2>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={analyze}
          disabled={loading}
          style={{ fontSize: "0.85rem" }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ borderTopColor: "white" }} />
              Analyzing…
            </>
          ) : (
            <>
              <Zap size={14} />
              Analyze
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="alert alert-error" style={{ marginBottom: "1rem" }}>
          <AlertTriangle size={15} style={{ flexShrink: 0 }} />
          {error}
        </p>
      )}

      <p className={`insight-copy ${!insight ? "insight-empty" : ""}`}>
        {insight || "Click Analyze to get a concise spending summary, two cutback areas, and one saving tip."}
      </p>

      {source === "fallback" && (
        <p className="insight-source" style={{ marginTop: "0.75rem" }}>
          <AlertTriangle size={12} />
          AI unavailable — showing local analysis
        </p>
      )}

      {/* AI disclaimer — always shown so users know to treat insights critically */}
      <p className="insight-disclaimer">
        <Info size={11} style={{ flexShrink: 0, marginTop: 1 }} />
        AI-generated insights may be inaccurate or out of context. Always verify before making
        financial decisions.
      </p>
    </section>
  );
};

export default AIInsightCard;
