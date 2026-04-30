import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../../../lib/api/client";
import {
  getMarketNews,
  getTopMovers,
  getWatchlist,
  type MarketNewsItem,
  type MarketQuote,
} from "../../../lib/api/marketApi";
import "../../trading/trading.css";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function quoteColorClass(value: number): string {
  if (value > 0) return "market-up";
  if (value < 0) return "market-down";
  return "";
}

export default function MarketPage() {
  const [symbolsInput, setSymbolsInput] = useState("AAPL,MSFT,TSLA");
  const [watchlist, setWatchlist] = useState<MarketQuote[]>([]);
  const [movers, setMovers] = useState<MarketQuote[]>([]);
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const symbols = useMemo(
    () =>
      symbolsInput
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
    [symbolsInput]
  );

  async function loadData(activeSymbols: string[]) {
    setLoading(true);
    setError(null);
    try {
      const [watchlistData, moversData, newsData] = await Promise.all([
        getWatchlist(activeSymbols),
        getTopMovers(),
        getMarketNews(activeSymbols),
      ]);

      setWatchlist(watchlistData);
      setMovers(moversData);
      setNews(newsData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load market data.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData(symbols);
  }, []);

  return (
    <div className="trading-container">
      <h1 className="trading-title">Market</h1>
      <p className="trading-subtitle">
        Delayed market data for learning purposes. Not investment advice.
      </p>

      <section className="trade-form-section">
        <h2>Watchlist Setup</h2>
        <p className="trade-form-hint">Enter comma-separated symbols, for example: AAPL,MSFT,NVDA</p>
        <div className="trade-form">
          <input value={symbolsInput} onChange={(e) => setSymbolsInput(e.target.value)} />
          <button type="button" onClick={() => void loadData(symbols)} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh data"}
          </button>
        </div>
        {error && (
          <p className="trade-form-error" role="alert">
            {error}
          </p>
        )}
      </section>

      <div className="table-section">
        <h2>Watchlist</h2>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.length === 0 && (
              <tr>
                <td colSpan={3}>No watchlist data available.</td>
              </tr>
            )}
            {watchlist.map((q) => (
              <tr key={q.symbol}>
                <td>{q.symbol}</td>
                <td>{currency.format(q.price)}</td>
                <td className={quoteColorClass(q.changePercent)}>
                  {q.changePercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h2>Top Movers</h2>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {movers.length === 0 && (
              <tr>
                <td colSpan={3}>No mover data available.</td>
              </tr>
            )}
            {movers.map((q) => (
              <tr key={`${q.symbol}-${q.asOfUtc}`}>
                <td>{q.symbol}</td>
                <td>{currency.format(q.price)}</td>
                <td className={quoteColorClass(q.changePercent)}>
                  {q.changePercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h2>Recent News</h2>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Headline</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 && (
              <tr>
                <td colSpan={3}>No news found for selected symbols.</td>
              </tr>
            )}
            {news.map((item) => (
              <tr key={`${item.url}-${item.symbol}`}>
                <td>{item.symbol}</td>
                <td>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.headline}
                  </a>
                </td>
                <td>{item.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
