import { useState } from "react";
import { Pencil, ReceiptText, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { getCategoryMeta } from "../lib/categories.js";
import { formatCurrency, formatDate } from "../lib/format.js";

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleDeleteClick = (expense) => {
    setPendingDelete({ id: expense._id, title: expense.title });
  };

  const handleConfirm = () => {
    onDelete(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <section className="bg-surface border border-border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-[160ms]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="inline-flex items-center gap-[0.35rem] text-primary text-[0.7rem] font-bold tracking-[0.08em] uppercase mb-[0.3rem]">
            <ReceiptText size={11} />
            Transactions
          </p>
          <h2 className="text-[1.1rem] font-bold tracking-[-0.01em] m-0">Expense list</h2>
        </div>
        <span className="inline-flex items-center bg-primary-soft text-primary rounded-full text-[0.8rem] font-bold px-[0.7rem] py-[0.25rem]">
          {expenses.length}
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 text-text-muted py-12 px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface-2 text-text-muted mb-2">
            <ReceiptText size={24} />
          </div>
          <p className="text-text-base font-semibold m-0">No expenses yet</p>
          <p className="m-0">Add your first expense using the form.</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {expenses.map((expense) => {
            const { icon: Icon, color } = getCategoryMeta(expense.category);
            return (
              <div
                key={expense._id}
                className="grid gap-4 [grid-template-columns:auto_1fr_auto_auto] items-center border border-border rounded-md px-4 py-[0.85rem] hover:bg-surface-hover hover:border-border-strong hover:shadow-sm transition-all duration-[160ms]"
              >
                <div
                  className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-md flex-shrink-0"
                  style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
                  title={expense.category}
                >
                  <Icon size={18} />
                </div>

                <div className="grid gap-[0.15rem] min-w-0">
                  <p className="font-semibold m-0 overflow-hidden text-ellipsis whitespace-nowrap text-text-base">
                    {expense.title}
                  </p>
                  <p className="flex flex-wrap gap-2 text-text-muted text-[0.8rem] m-0">
                    <span>{expense.category}</span>
                    <span className="text-text-subtle">·</span>
                    <span>{formatDate(expense.date)}</span>
                    {expense.note && (
                      <>
                        <span className="text-text-subtle">·</span>
                        <span className="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {expense.note}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <span className="text-[1.05rem] font-bold tracking-[-0.01em]">
                  {formatCurrency(expense.amount)}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(expense)}
                    title="Edit"
                    aria-label={`Edit ${expense.title}`}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] rounded-md bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-base transition-colors duration-[160ms] p-[0.4rem]"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(expense)}
                    title="Delete"
                    aria-label={`Delete ${expense.title}`}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] rounded-md bg-transparent text-danger hover:bg-surface-2 transition-colors duration-[160ms] p-[0.4rem]"
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
