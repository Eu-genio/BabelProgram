import { useEffect, useState } from "react";
import { ApiError } from "../../../lib/api/client";
import {
  getStockChart,
  type ChartRange,
  type MarketChart,
} from "../../../lib/api/marketApi";
import StockChart from "./StockChart";

const RANGES: ChartRange[] = ["1D", "1W", "1M", "3M", "1Y"];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type Props = {
  symbol: string;
};

function quoteColorClass(value: number): string {
  if (value > 0) return "market-up";
  if (value < 0) return "market-down";
  return "";
}

export default function StockDetailPanel({ symbol }: Props) {
  const [range, setRange] = useState<ChartRange>("1D");
  const [chart, setChart] = useState<MarketChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChart() {
      setLoading(true);
      setError(null);

      try {
        const data = await getStockChart(symbol, range);
        if (!cancelled) {
          setChart(data);
        }
      } catch (err) {
        if (!cancelled) {
          setChart(null);
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError("Failed to load chart data.");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadChart();

    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  return (
    <section className="market-detail-section">
      <div className="market-detail-header">
        <div>
          <h2>{symbol}</h2>
          {chart && (
            <>
              <p className="market-detail-price">{currency.format(chart.currentPrice)}</p>
              <p className={`market-detail-change ${quoteColorClass(chart.change)}`}>
                {chart.change >= 0 ? "+" : ""}
                {currency.format(chart.change)} ({chart.changePercent.toFixed(2)}%)
              </p>
            </>
          )}
        </div>

        <div className="market-range-buttons" role="group" aria-label="Chart time range">
          {RANGES.map((item) => (
            <button
              key={item}
              type="button"
              className={item === range ? "market-range-active" : ""}
              onClick={() => setRange(item)}
              disabled={loading}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {chart && (
        <dl className="market-detail-stats">
          <div>
            <dt>Open</dt>
            <dd>{currency.format(chart.open)}</dd>
          </div>
          <div>
            <dt>High</dt>
            <dd>{currency.format(chart.high)}</dd>
          </div>
          <div>
            <dt>Low</dt>
            <dd>{currency.format(chart.low)}</dd>
          </div>
          <div>
            <dt>Prev close</dt>
            <dd>{currency.format(chart.previousClose)}</dd>
          </div>
        </dl>
      )}

      {loading && <p className="trade-form-hint">Loading chart...</p>}
      {error && (
        <p className="trade-form-error" role="alert">
          {error}
        </p>
      )}
      {chart && !loading && (
        <StockChart
          points={chart.points}
          openPrice={chart.open}
          positive={chart.change >= 0}
        />
      )}
    </section>
  );
}
