import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Accessible confirmation modal. Replaces window.confirm for delete actions.
 * Closes on Escape and on overlay click.
 */
const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event) => {
      if (event.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 id="confirm-title">{title}</h3>
        <div className="modal-description">{description}</div>
        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={destructive ? "danger-button" : "primary-button"}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
