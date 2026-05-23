import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { getCategoryMeta } from "../lib/categories.js";
import { formatCurrency } from "../lib/format.js";

const groupByCategory = (expenses) => {
  const totals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  const { color } = getCategoryMeta(name);
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        padding: "0.6rem 0.9rem"
      }}
    >
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", margin: "0 0 0.2rem", fontWeight: 600 }}>
        {name}
      </p>
      <p style={{ color, fontSize: "1rem", fontWeight: 700, margin: 0 }}>
        {formatCurrency(value)}
      </p>
    </div>
  );
};

const SpendingChart = ({ expenses }) => {
  const data = groupByCategory(expenses);

  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">
            <PieChartIcon size={11} />
            Breakdown
          </p>
          <h2>Spending chart</h2>
        </div>
      </div>

      {data.length ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              innerRadius={54}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => {
                const { color } = getCategoryMeta(entry.name);
                return <Cell key={entry.name} fill={color} />;
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-chart">
          <div style={{ textAlign: "center" }}>
            <PieChartIcon size={32} style={{ color: "var(--color-text-subtle)", marginBottom: "0.5rem" }} />
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
              Add an expense to see the breakdown
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SpendingChart;
