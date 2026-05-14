import { useState, type FormEvent } from "react";
import { ApiError } from "../../../lib/api/client";
import { submitTrade, type TradeExecutionResult, type TradeSide } from "../../../lib/api/tradesApi";
import { formatCurrency, formatDateTimeUtc } from "../utils/format";

type TradeFormProps = {
  portfolioId: number;
  onTradeSuccess: () => Promise<void> | void;
};

export default function TradeForm({ portfolioId, onTradeSuccess }: TradeFormProps) {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [side, setSide] = useState<TradeSide>("buy");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastExecution, setLastExecution] = useState<TradeExecutionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const normalizedSymbol = symbol.trim().toUpperCase();
    const normalizedQuantity = Number(quantity);

    if (!normalizedSymbol) {
      setError("Symbol is required.");
      return;
    }

    if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
      setError("Quantity must be a number greater than 0.");
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setLastExecution(null);
      setIsSubmitting(true);

      const result = await submitTrade(side, {
        portfolioId,
        symbol: normalizedSymbol,
        quantity: normalizedQuantity,
      });

      setLastExecution(result);
      await onTradeSuccess();
      setSuccess(`${side === "buy" ? "Buy" : "Sell"} filled for ${normalizedSymbol}.`);
      setQuantity("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Trade failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="trade-form-section">
      <h2>Place Trade</h2>
      <p className="trade-form-hint">
        Buy adds units to your holdings. Sell removes units from what you currently own. Execution uses the same
        Finnhub quote feed as Market (paper fills).
      </p>

      <form onSubmit={handleSubmit} className="trade-form" noValidate>
        {error && (
          <p className="trade-form-error" role="alert">
            {error}
          </p>
        )}
        {success && <p className="trade-form-success">{success}</p>}
        {lastExecution && (
          <div className="trade-form-execution-detail" role="status">
            <p>
              <strong>Execution price:</strong> {formatCurrency(lastExecution.price)} per share ·{" "}
              <strong>Total:</strong> {formatCurrency(lastExecution.totalAmount)}
            </p>
            <p>
              <strong>Filled at:</strong> {formatDateTimeUtc(lastExecution.executedAtUtc)}
            </p>
            {lastExecution.quoteAsOfUtc && (
              <p>
                <strong>Quote timestamp (Finnhub):</strong> {formatDateTimeUtc(lastExecution.quoteAsOfUtc)}
              </p>
            )}
          </div>
        )}

        <label htmlFor="trade-symbol">Symbol</label>
        <input
          id="trade-symbol"
          name="symbol"
          type="text"
          placeholder="AAPL"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
        />

        <label htmlFor="trade-side">Side</label>
        <select
          id="trade-side"
          name="side"
          value={side}
          onChange={(event) => setSide(event.target.value as TradeSide)}
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>

        <label htmlFor="trade-quantity">Quantity</label>
        <input
          id="trade-quantity"
          name="quantity"
          type="number"
          min="0.0000001"
          step="any"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
        <p className="trade-form-subhint">Use whole numbers or decimals (example: 1 or 0.25).</p>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit trade"}
        </button>
      </form>
    </section>
  );
}
