import { useState } from "react";
import { Pencil, ReceiptText, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { getCategoryMeta } from "../lib/categories.js";
import { formatCurrency, formatDate } from "../lib/format.js";

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const [pendingDelete, setPendingDelete] = useState(null); // { id, title }

  const handleDeleteClick = (expense) => {
    setPendingDelete({ id: expense._id, title: expense.title });
  };

  const handleConfirm = () => {
    onDelete(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">
            <ReceiptText size={11} />
            Transactions
          </p>
          <h2>Expense list</h2>
        </div>
        <span className="count-pill">{expenses.length}</span>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ReceiptText size={24} />
          </div>
          <p className="empty-state-title">No expenses yet</p>
          <p>Add your first expense using the form.</p>
        </div>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => {
            const { icon: Icon, color } = getCategoryMeta(expense.category);
            return (
              <div key={expense._id} className="expense-item">
                <div
                  className="category-badge"
                  style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
                  title={expense.category}
                >
                  <Icon size={18} />
                </div>

                <div className="expense-info">
                  <p className="expense-title">{expense.title}</p>
                  <p className="expense-meta">
                    <span>{expense.category}</span>
                    <span className="expense-meta-divider">·</span>
                    <span>{formatDate(expense.date)}</span>
                    {expense.note && (
                      <>
                        <span className="expense-meta-divider">·</span>
                        <span
                          style={{
                            maxWidth: "180px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {expense.note}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <span className="expense-amount">{formatCurrency(expense.amount)}</span>

                <div className="expense-actions">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => onEdit(expense)}
                    title="Edit"
                    aria-label={`Edit ${expense.title}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => handleDeleteClick(expense)}
                    title="Delete"
                    aria-label={`Delete ${expense.title}`}
                    style={{ color: "var(--color-danger)" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete expense?"
        description={`"${pendingDelete?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
};

export default ExpenseList;
