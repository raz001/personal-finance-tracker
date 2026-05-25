import { useEffect, useState } from "react";
import { CalendarDays, FileText, Layers, PenLine, Tag } from "lucide-react";
import { CATEGORIES } from "../lib/categories.js";

const emptyForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  note: ""
};

const toDateInput = (date) => new Date(date).toISOString().slice(0, 10);

const fieldCls = "h-9 py-0 px-[0.75rem] text-[0.875rem] min-h-0";
const labelCls = "text-text-muted text-[0.82rem] font-semibold flex flex-col gap-[0.3rem]";
const labelInner = "inline-flex items-center gap-[0.35rem]";

const ExpenseForm = ({ editingExpense, onCancelEdit, onSubmit, loading }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: toDateInput(editingExpense.date),
        note: editingExpense.note || ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingExpense]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
    if (!editingExpense) setForm(emptyForm);
  };

  return (
    <form
      className="bg-surface border border-border rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-[160ms] flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-[0.35rem] text-primary text-[0.7rem] font-bold tracking-[0.08em] uppercase mb-[0.2rem]">
            <PenLine size={11} />
            {editingExpense ? "Editing" : "New entry"}
          </p>
          <h2 className="text-[1.05rem] font-bold tracking-[-0.01em] m-0">
            {editingExpense ? "Edit expense" : "Add expense"}
          </h2>
        </div>
        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center justify-center gap-2 h-8 px-3 rounded-md text-[0.8rem] font-semibold bg-surface-2 text-text-base border border-border hover:bg-surface-hover hover:border-border-strong transition-colors duration-[160ms] whitespace-nowrap"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Title + Amount row */}
      <div className="grid grid-cols-2 gap-3">
        <label className={labelCls}>
          <span className={labelInner}><Tag size={13} />Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Lunch at Swiggy"
            required
            maxLength={120}
            className={fieldCls}
          />
        </label>
        <label className={labelCls}>
          <span className={labelInner}><span className="text-[0.82rem]">₹</span>Amount</span>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
            className={fieldCls}
          />
        </label>
      </div>

      {/* Category + Date row */}
      <div className="grid grid-cols-2 gap-3">
        <label className={labelCls}>
          <span className={labelInner}><Layers size={13} />Category</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={fieldCls}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          <span className={labelInner}><CalendarDays size={13} />Date</span>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className={fieldCls}
          />
        </label>
      </div>

      {/* Note */}
      <label className={labelCls}>
        <span className={labelInner}>
          <FileText size={13} />
          Note <span className="font-normal opacity-60">(optional)</span>
        </span>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows="3"
          placeholder="Any extra details…"
          className="py-[0.45rem] px-[0.75rem] text-[0.875rem] min-h-0 resize-none"
        />
      </label>

      {/* Submit */}
      <button
        className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[0.9rem] font-semibold bg-primary text-white shadow-sm hover:bg-primary-hover hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed transition-all duration-[160ms] whitespace-nowrap"
        disabled={loading}
        type="submit"
      >
        {loading ? (
          <><span className="spinner spinner-white" />Saving…</>
        ) : editingExpense ? (
          "Update expense"
        ) : (
          "Add expense"
        )}
      </button>
    </form>
  );
};

export default ExpenseForm;
