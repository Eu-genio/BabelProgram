import { useState, type FormEvent } from "react";
import { ApiError } from "../../../lib/api/client";
import { submitTrade, type TradeSide } from "../../../lib/api/tradesApi";
import { formatCurrency, formatDateTimeUtc } from "../utils/format";

type Props = {
  open: boolean;
  symbol: string;
  portfolioId: number;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

export default function InlineTradeModal({ open, symbol, portfolioId, onClose, onSuccess }: Props) {
  const [side, setSide] = useState<TradeSide>("buy");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [lastFilledAt, setLastFilledAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const normalizedQuantity = Number(quantity);

    if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      const result = await submitTrade(side, {
        portfolioId,
        symbol,
        quantity: normalizedQuantity,
      });
      setLastPrice(result.price);
      setLastFilledAt(result.executedAtUtc);
      setQuantity("");
      await onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Trade failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>
          {side === "buy" ? "Buy" : "Sell"} {symbol}
        </h2>

        <form onSubmit={handleSubmit} className="trade-form" noValidate>
          {error && (
            <p className="trade-form-error" role="alert">
              {error}
            </p>
          )}
          {lastPrice !== null && lastFilledAt && (
            <p className="trade-form-success">
              Filled at {formatCurrency(lastPrice)} · {formatDateTimeUtc(lastFilledAt)}
            </p>
          )}

          <label htmlFor="inline-trade-side">Side</label>
          <select
            id="inline-trade-side"
            value={side}
            onChange={(e) => setSide(e.target.value as TradeSide)}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>

          <label htmlFor="inline-trade-qty">Quantity</label>
          <input
            id="inline-trade-qty"
            type="number"
            min="0.0000001"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
