import { useEffect, useState } from "react";
import PortfolioSummary from "../components/PortfolioSummary";
import HoldingsTable from "../components/HoldingsTable";
import RecentTrades from "../components/RecentTrades";
import TradeForm from "../components/TradeForm";
import { ApiError } from "../../../lib/api/client";
import {
  getDashboard,
  getMyPortfolios,
  createPortfolio,
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
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);
  const [createPortfolioError, setCreatePortfolioError] = useState<string | null>(null);

  async function loadPortfolios() {
    const fetchedPortfolios = await getMyPortfolios();
    setPortfolios(fetchedPortfolios);

    if (fetchedPortfolios.length > 0) {
      setSelectedPortfolioId((current) => current ?? fetchedPortfolios[0].id);
    }
  }

  async function refreshDashboard(portfolioId: number) {
    const dashboard = await getDashboard(portfolioId);
    setData(dashboard);
  }

  useEffect(() => {
    async function initialLoad() {
      try {
        setLoading(true);
        setError(null);

        await loadPortfolios();
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load portfolios");
        }
      } finally {
        setLoading(false);
      }
    }

    initialLoad();
  }, []);

  async function handleCreatePortfolio() {
    const trimmedName = newPortfolioName.trim();
    if (!trimmedName) {
      setCreatePortfolioError("Portfolio name is required.");
      return;
    }

    try {
      setCreatePortfolioError(null);
      setIsCreatingPortfolio(true);
      const createdPortfolio = await createPortfolio({ name: trimmedName });
      setNewPortfolioName("");
      await loadPortfolios();
      setSelectedPortfolioId(createdPortfolio.id);
    } catch (err) {
      if (err instanceof ApiError) {
        setCreatePortfolioError(err.message);
      } else {
        setCreatePortfolioError("Failed to create portfolio.");
      }
    } finally {
      setIsCreatingPortfolio(false);
    }
  }

  useEffect(() => {
    if (selectedPortfolioId === null) return;

    const portfolioId = selectedPortfolioId;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        await refreshDashboard(portfolioId);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [selectedPortfolioId]);

  if (loading && !data) {
    return <p>Loading your trading dashboard...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (portfolios.length === 0) {
    return (
      <div>
        <h1>Trading Dashboard</h1>
        <p>You don’t have any portfolios yet. Create one to start paper trading.</p>
        <div className="empty-portfolio-actions">
          {createPortfolioError && (
            <p className="trade-form-error" role="alert">
              {createPortfolioError}
            </p>
          )}
          <input
            type="text"
            placeholder="My first portfolio"
            value={newPortfolioName}
            onChange={(event) => setNewPortfolioName(event.target.value)}
          />
          <button type="button" onClick={handleCreatePortfolio} disabled={isCreatingPortfolio}>
            {isCreatingPortfolio ? "Creating..." : "Create portfolio"}
          </button>
        </div>
      </div>
    );
  }

  const currentPortfolioId = selectedPortfolioId;
  if (currentPortfolioId === null) {
    return <p>Select a portfolio to continue.</p>;
  }

  return (
    <div className="trading-container">
      <h1 className="trading-title">Trading Dashboard</h1>
      <p className="trading-subtitle">
        Paper trading only. Practice trades here without risking real money.
      </p>

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
          <TradeForm
            portfolioId={currentPortfolioId}
            onTradeSuccess={() => refreshDashboard(currentPortfolioId)}
          />
          <PortfolioSummary data={data} />
          <HoldingsTable data={data.holdings} />
          <RecentTrades data={data.recentTrades} />
        </>
      )}
    </div>
  );
}