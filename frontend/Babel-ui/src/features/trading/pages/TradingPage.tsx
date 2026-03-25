import { useEffect, useState } from "react";
import PortfolioSummary from "../components/PortfolioSummary";
import HoldingsTable from "../components/HoldingsTable";
import RecentTrades from "../components/RecentTrades";
import { getDashboard } from "../../../lib/api/portfolioApi";

export default function TradingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard(3) // hardcoded for now
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!data) return <p>Error loading dashboard</p>;

  return (
    <div>
      <h1>Trading Dashboard</h1>

      <PortfolioSummary data={data} />
      <HoldingsTable data={data.holdings} />
      <RecentTrades data={data.recentTrades} />
    </div>
  );
}