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
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="panel-heading full-span">
        <div>
          <p className="eyebrow">
            <PenLine size={11} />
            {editingExpense ? "Editing" : "New entry"}
          </p>
          <h2>{editingExpense ? "Edit expense" : "Add expense"}</h2>
        </div>
        {editingExpense && (
          <button type="button" className="ghost-button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      <label>
        <span className="label-inner">
          <Tag size={13} style={{ display: "inline", marginRight: 4 }} />
          Title
        </span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Lunch at Swiggy"
          required
          maxLength={120}
        />
      </label>

      <label>
        <span className="label-inner">
          <span style={{ fontSize: "0.85rem", marginRight: 4 }}>₹</span>
          Amount
        </span>
        <input
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </label>

      <label>
        <span className="label-inner">
          <Layers size={13} style={{ display: "inline", marginRight: 4 }} />
          Category
        </span>
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="label-inner">
          <CalendarDays size={13} style={{ display: "inline", marginRight: 4 }} />
          Date
        </span>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </label>

      <label className="full-span">
        <span className="label-inner">
          <FileText size={13} style={{ display: "inline", marginRight: 4 }} />
          Note <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
        </span>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows="2"
          placeholder="Any extra details…"
        />
      </label>

      <button
        className="primary-button full-span"
        disabled={loading}
        type="submit"
        style={{ marginTop: "0.25rem" }}
      >
        {loading ? (
          <>
            <span className="spinner" style={{ borderTopColor: "white" }} />
            Saving…
          </>
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
