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
    <div className="bg-surface border border-border rounded-md shadow-md px-[0.9rem] py-[0.6rem]">
      <p className="text-text-muted text-[0.75rem] font-semibold mb-[0.2rem] m-0">{name}</p>
      <p className="text-[1rem] font-bold m-0" style={{ color }}>{formatCurrency(value)}</p>
    </div>
  );
};

const SpendingChart = ({ expenses }) => {
  const data = groupByCategory(expenses);

  return (
    <section className="bg-surface border border-border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-[160ms]">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="inline-flex items-center gap-[0.35rem] text-primary text-[0.7rem] font-bold tracking-[0.08em] uppercase mb-[0.3rem]">
            <PieChartIcon size={11} />
            Breakdown
          </p>
          <h2 className="text-[1.1rem] font-bold tracking-[-0.01em] m-0">Spending chart</h2>
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
                <span className="text-text-muted text-[0.8rem]">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center border border-dashed border-border-strong rounded-md min-h-[280px] text-text-muted">
          <div className="text-center">
            <PieChartIcon size={32} className="text-text-subtle mb-2 mx-auto" />
            <p className="m-0 text-[0.9rem]">Add an expense to see the breakdown</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SpendingChart;
