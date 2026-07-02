import { useState, type FormEvent } from "react";
import { ApiError } from "../../../lib/api/client";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
};

const PRESETS = [1000, 5000, 10000, 25000];

export default function AddCashModal({ open, onClose, onSubmit }: Props) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await onSubmit(value);
      setAmount("");
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add cash.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>Add paper cash</h2>
        <p className="trade-form-hint">Top up your simulated buying power for practice trades.</p>

        {error && (
          <p className="trade-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="cash-preset-row">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="btn btn-chip"
              onClick={() => setAmount(String(preset))}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="trade-form" noValidate>
          <label htmlFor="cash-amount">Amount (USD)</label>
          <input
            id="cash-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10000"
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add cash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
