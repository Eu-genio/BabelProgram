import { Link } from "react-router-dom";
import PortfolioValueChart from "../components/PortfolioValueChart";
import { usePortfolio } from "../context/PortfolioContext";
import { formatCurrency, formatSignedCurrency } from "../../trading/utils/format";
import LiveDashboardHoldings from "../components/LiveDashboardHoldings";

export default function DashboardPage() {
  const { data, loading, portfolios } = usePortfolio();

  if (loading && portfolios.length === 0) {
    return <p className="babel-muted">Loading dashboard...</p>;
  }

  if (portfolios.length === 0) {
    return (
      <section className="babel-panel babel-empty">
        <h1>Welcome to Babel</h1>
        <p className="babel-muted">Create a portfolio to start paper trading.</p>
        <Link to="/trading/portfolio" className="btn btn-babel-primary">
          Create portfolio →
        </Link>
      </section>
    );
  }

  if (!data) {
    return <p className="babel-muted">Loading portfolio data...</p>;
  }

  const dayPl = data.holdings.reduce((sum, row) => sum + row.todaysGain, 0);
  const totalPl = data.holdings.reduce((sum, row) => sum + row.totalChange, 0);
  const dayPlPercent = data.totalValue > 0 ? (dayPl / data.totalValue) * 100 : 0;

  return (
    <div className="babel-dashboard">
      <section className="babel-panel babel-dashboard-main">
        <p className="babel-label">Total Value</p>
        <h1 className="babel-stat-xl">{formatCurrency(data.totalValue)}</h1>
        <p className={dayPl >= 0 ? "market-up babel-stat-sub" : "market-down babel-stat-sub"}>
          {formatSignedCurrency(dayPl)} ({dayPlPercent.toFixed(2)}%) today
        </p>

        <PortfolioValueChart trades={data.trades} currentTotal={data.totalValue} />

        <div className="babel-stat-row">
          <div className="babel-stat-card">
            <span>Buying Power</span>
            <strong>{formatCurrency(data.cash)}</strong>
          </div>
          <div className="babel-stat-card">
            <span>Day P/L</span>
            <strong className={dayPl >= 0 ? "market-up" : "market-down"}>
              {formatSignedCurrency(dayPl)}
            </strong>
          </div>
          <div className="babel-stat-card">
            <span>Total P/L</span>
            <strong className={totalPl >= 0 ? "market-up" : "market-down"}>
              {formatSignedCurrency(totalPl)}
            </strong>
          </div>
        </div>
      </section>

      <aside className="babel-panel babel-dashboard-side">
        <div className="babel-side-header">
          <h2>Top Holdings</h2>
          <Link to="/trading/portfolio">View all</Link>
        </div>
        <LiveDashboardHoldings />
      </aside>
    </div>
  );
}
