import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../../../lib/api/client";
import {
  getDefaultWatchlistInput,
  getMarketWatchlistSymbols,
  parseWatchlistInput,
  saveMarketWatchlistSymbols,
} from "../../../lib/marketWatchlist";

import { getWatchlist, type MarketQuote } from "../../../lib/api/marketApi";
import StockLogo from "../../../components/StockLogo";

function quoteColorClass(value: number): string {
  if (value > 0) return "market-up";
  if (value < 0) return "market-down";
  return "";
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function WatchlistPage() {
  const [symbolsInput, setSymbolsInput] = useState(getDefaultWatchlistInput);
  const [watchlist, setWatchlist] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const symbols = useMemo(() => parseWatchlistInput(symbolsInput), [symbolsInput]);

  async function loadData(activeSymbols: string[]) {
    setLoading(true);
    setError(null);
    saveMarketWatchlistSymbols(activeSymbols);
    try {
      setWatchlist(await getWatchlist(activeSymbols));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData(getMarketWatchlistSymbols());
  }, []);

  return (
    <>
      <header className="babel-page-header">
        <div>
          <h1>Watchlist</h1>
          <p className="babel-muted">Symbols you track on the Markets page.</p>
        </div>
      </header>

      <section className="babel-panel">
        <label htmlFor="watchlist-symbols" className="babel-label">
          Symbols (comma-separated)
        </label>
        <div className="babel-watchlist-form">
          <input
            id="watchlist-symbols"
            value={symbolsInput}
            onChange={(e) => setSymbolsInput(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-babel-primary"
            onClick={() => void loadData(symbols)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & refresh"}
          </button>
        </div>
        {error && (
          <p className="trade-form-error" role="alert">
            {error}
          </p>
        )}
      </section>

      <section className="babel-panel">
        <table className="babel-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Open</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.length === 0 && (
              <tr>
                <td colSpan={4}>No watchlist data available.</td>
              </tr>
            )}
            {watchlist.map((q) => (
              <tr key={q.symbol}>
                <td>
                  <div className="babel-symbol-cell">
                    <StockLogo symbol={q.symbol} size={28} />
                    {q.symbol}
                  </div>
                </td>
                <td>{currency.format(q.price)}</td>
                <td>{currency.format(q.open)}</td>
                <td className={quoteColorClass(q.changePercent)}>{q.changePercent.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
