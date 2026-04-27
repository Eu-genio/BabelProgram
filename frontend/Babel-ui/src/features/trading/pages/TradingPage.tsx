import { useEffect, useState } from "react";
import PortfolioSummary from "../components/PortfolioSummary";
import HoldingsTable from "../components/HoldingsTable";
import RecentTrades from "../components/RecentTrades";
import {
  getDashboard,
  getMyPortfolios,
  type PortfolioResponse,
  type PortfolioDashboardResponse,
} from "../../../lib/api/portfolioApi";
import "../trading.css";

export default function TradingPage() {
  const [portfolios, setPortfolios] = useState<PortfolioResponse[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [data, setData] = useState<PortfolioDashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPortfolios() {
      try {
        setLoading(true);

        const portfolios = await getMyPortfolios();
        setPortfolios(portfolios);

        if (portfolios.length > 0) {
          setSelectedPortfolioId(portfolios[0].id); // default selection
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load portfolios");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolios();
  }, []);

  useEffect(() => {
    if (selectedPortfolioId === null) return;

    const portfolioId = selectedPortfolioId;

    async function loadDashboard() {
      try {
        setLoading(true);

        const dashboard = await getDashboard(portfolioId);
        setData(dashboard);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [selectedPortfolioId]);

  if (loading && !data) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (portfolios.length === 0) {
    return (
      <div>
        <h1>Trading Dashboard</h1>
        <p>You don’t have any portfolios yet.</p>
        {/* later: add create portfolio button */}
      </div>
    );
  }

  return (
    <div className="trading-container">
      <h1 className="trading-title">Trading Dashboard</h1>

      {/* 🔹 Portfolio selector */}
      <select
        value={selectedPortfolioId ?? ""}
        onChange={(e) => setSelectedPortfolioId(Number(e.target.value))}
      >
        {portfolios.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* 🔹 Dashboard */}
      {data && (
        <>
          <PortfolioSummary data={data} />
          <HoldingsTable data={data.holdings} />
          <RecentTrades data={data.recentTrades} />
        </>
      )}
    </div>
  );
}