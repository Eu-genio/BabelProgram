import PortfolioSummary from "../components/PortfolioSummary";
import HoldingsTable from "../components/HoldingsTable";
import RecentTrades from "../components/RecentTrades";
import "../trading.css";

export default function TradingPage() {
  return (
    <div className="trading-container">
      <h1 className="trading-title">Trading Dashboard</h1>

      <PortfolioSummary />

      <HoldingsTable />

      <RecentTrades />
    </div>
  );
}