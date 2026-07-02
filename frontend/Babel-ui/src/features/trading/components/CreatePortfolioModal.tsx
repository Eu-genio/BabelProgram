import { useEffect, useState } from "react";
import { ApiError } from "../../../lib/api/client";
import { getTopMovers, type MarketQuote } from "../../../lib/api/marketApi";
import { colorClassForValue, formatSignedPercent } from "../utils/format";

const FALLBACK_SYMBOLS = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "AMD"];

function fallbackMovers(): MarketQuote[] {
  return FALLBACK_SYMBOLS.map((symbol) => ({
    symbol,
    price: 0,
    change: 0,
    changePercent: 0,
    asOfUtc: new Date(0).toISOString(),
    open: 0,
    high: 0,
    low: 0,
    previousClose: 0,
  }));
}

type Props = {
  open: boolean;
  title: string;
  submitLabel: string;
  requireName?: boolean;
  onClose: () => void;
  onSubmit: (name: string, symbols: string[]) => Promise<void>;
};

export default function CreatePortfolioModal({
  open,
  title,
  submitLabel,
  requireName = true,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [symbolInput, setSymbolInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [movers, setMovers] = useState<MarketQuote[]>([]);
  const [moversLoading, setMoversLoading] = useState(false);
  const [moversHint, setMoversHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setName("");
    setSymbolInput("");
    setSelected([]);
    setError(null);
    setMoversHint(null);
    setMoversLoading(true);

    getTopMovers()
      .then((data) => {
        if (data.length > 0) {
          setMovers(data);
          return;
        }

        setMovers(fallbackMovers());
        setMoversHint("Live prices unavailable right now. You can still pick symbols below.");
      })
      .catch(() => {
        setMovers(fallbackMovers());
        setMoversHint("Could not load live movers. Pick symbols below or search by ticker.");
      })
      .finally(() => setMoversLoading(false));
  }, [open]);

  if (!open) return null;

  function toggleSymbol(symbol: string) {
    const normalized = symbol.toUpperCase();
    setSelected((current) =>
      current.includes(normalized)
        ? current.filter((s) => s !== normalized)
        : [...current, normalized]
    );
  }

  function addCustomSymbol() {
    const normalized = symbolInput.trim().toUpperCase();
    if (!normalized) return;
    setSelected((current) => (current.includes(normalized) ? current : [...current, normalized]));
    setSymbolInput("");
  }

  async function handleSubmit() {
    if (requireName && !name.trim()) {
      setError("Portfolio name is required.");
      return;
    }
    if (selected.length === 0) {
      setError("Follow at least one symbol.");
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await onSubmit(name.trim(), selected);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save portfolio.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="portfolio-modal-title">{title}</h2>
        <p className="trade-form-hint">Pick today&apos;s movers or search a symbol. You need at least one.</p>

        {error && (
          <p className="trade-form-error" role="alert">
            {error}
          </p>
        )}

        {requireName && (
          <>
            <label htmlFor="portfolio-name">Portfolio name</label>
            <input
              id="portfolio-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Growth portfolio"
            />
          </>
        )}

        <p className="modal-section-label">Top movers today</p>
        {moversLoading && <p className="trade-form-hint">Loading movers...</p>}
        {moversHint && !moversLoading && <p className="trade-form-subhint">{moversHint}</p>}
        <div className="symbol-chip-grid">
          {movers.map((m) => (
            <button
              key={m.symbol}
              type="button"
              className={selected.includes(m.symbol) ? "btn btn-chip active" : "btn btn-chip"}
              onClick={() => toggleSymbol(m.symbol)}
            >
              <span>{m.symbol}</span>
              {m.changePercent !== 0 && (
                <span className={colorClassForValue(m.changePercent)}>
                  {formatSignedPercent(m.changePercent)}
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="modal-section-label">Search symbol</p>
        <div className="modal-symbol-search">
          <input
            value={symbolInput}
            onChange={(e) => setSymbolInput(e.target.value)}
            placeholder="NVDA"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomSymbol();
              }
            }}
          />
          <button type="button" className="btn btn-secondary" onClick={addCustomSymbol}>
            Add
          </button>
        </div>

        {selected.length > 0 && (
          <p className="trade-form-subhint">Following: {selected.join(", ")}</p>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
