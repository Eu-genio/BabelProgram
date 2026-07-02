import StockLogo from "../../../components/StockLogo";
import "../home.css";

const CHART_POINTS = "4,58 28,48 52,52 76,34 100,38 124,22 148,28 172,14 196,18 220,8";

export default function BabelDashboardPreview() {
  return (
    <div className="babel-preview" aria-hidden="true">
      <aside className="babel-preview-sidebar">
        <p className="babel-preview-brand">Babel</p>
        <ul>
          {["Dashboard", "Portfolio", "Markets", "Orders", "Watchlist", "Settings"].map((item, index) => (
            <li key={item} className={index === 0 ? "active" : undefined}>
              <span className="babel-preview-nav-dot" />
              {item}
            </li>
          ))}
        </ul>
      </aside>

      <div className="babel-preview-main">
        <div className="babel-preview-overview">
          <div>
            <p className="babel-preview-label">Total Value</p>
            <p className="babel-preview-value">$125,430.50</p>
            <p className="babel-preview-change-up">+2,430.50 (1.97%)</p>
          </div>

          <div className="babel-preview-chart-wrap">
            <svg className="babel-preview-chart" viewBox="0 0 224 64" preserveAspectRatio="none">
              <defs>
                <linearGradient id="babelChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(167, 139, 250, 0.35)" />
                  <stop offset="100%" stopColor="rgba(167, 139, 250, 0)" />
                </linearGradient>
              </defs>
              <polygon fill="url(#babelChartFill)" points={`0,64 ${CHART_POINTS} 220,64`} />
              <polyline
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={CHART_POINTS}
              />
            </svg>
            <div className="babel-preview-ranges">
              {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((range) => (
                <span key={range} className={range === "1W" ? "active" : undefined}>
                  {range}
                </span>
              ))}
            </div>
          </div>

          <div className="babel-preview-stats">
            <div>
              <span>Buying Power</span>
              <strong>$45,230.45</strong>
            </div>
            <div>
              <span>Day P/L</span>
              <strong className="babel-preview-change-up">+$1,250.30</strong>
              <small>1.02%</small>
            </div>
            <div>
              <span>Total P/L</span>
              <strong className="babel-preview-change-up">+$12,430.50</strong>
              <small>10.99%</small>
            </div>
          </div>
        </div>

        <PreviewHoldings />
      </div>
    </div>
  );
}

function PreviewHoldings() {
  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", value: "$28,430.50", change: "+1.35%", up: true },
    { symbol: "MSFT", name: "Microsoft", value: "$24,120.00", change: "+0.82%", up: true },
    { symbol: "NVDA", name: "NVIDIA", value: "$18,950.25", change: "+2.14%", up: true },
    { symbol: "AMZN", name: "Amazon", value: "$12,400.00", change: "-0.45%", up: false },
  ];

  return (
    <div className="babel-preview-holdings">
      <div className="babel-preview-holdings-header">
        <h3>Top Holdings</h3>
        <span>View all</span>
      </div>
      <ul>
        {holdings.map((item) => (
          <li key={item.symbol}>
            <StockLogo symbol={item.symbol} size={32} className="babel-preview-logo" />
            <div className="babel-preview-holding-meta">
              <strong>{item.symbol}</strong>
              <span>{item.name}</span>
            </div>
            <div className="babel-preview-holding-values">
              <strong>{item.value}</strong>
              <span className={item.up ? "babel-preview-change-up" : "babel-preview-change-down"}>
                {item.change}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
