import { useEffect, useState } from "react";
import { ApiError } from "../../../lib/api/client";
import {
  addPortfolioSymbols,
  createPortfolio,
  deletePortfolio,
  depositCash,
  getDashboard,
  getMyPortfolios,
  type PortfolioDashboardResponse,
  type PortfolioResponse,
} from "../../../lib/api/portfolioApi";
import AddCashModal from "../components/AddCashModal";
import CreatePortfolioModal from "../components/CreatePortfolioModal";
import EmptyPortfolioState from "../components/EmptyPortfolioState";
import InlineTradeModal from "../components/InlineTradeModal";
import PortfolioSidebar from "../components/PortfolioSidebar";
import PortfolioSummary from "../components/PortfolioSummary";
import HistoryTab from "../components/tabs/HistoryTab";
import HoldingsTab from "../components/tabs/HoldingsTab";
import SummaryTab from "../components/tabs/SummaryTab";
import "../trading.css";

type TabId = "summary" | "history" | "holdings";

const TABS: { id: TabId; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "holdings", label: "Holdings" },
  { id: "history", label: "History" },
];

export default function TradingPage() {
  const [portfolios, setPortfolios] = useState<PortfolioResponse[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [data, setData] = useState<PortfolioDashboardResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [addSymbolsModalOpen, setAddSymbolsModalOpen] = useState(false);
  const [addCashModalOpen, setAddCashModalOpen] = useState(false);
  const [tradeSymbol, setTradeSymbol] = useState<string | null>(null);

  async function loadPortfolios(preferredId?: number | null) {
    const fetched = await getMyPortfolios();
    setPortfolios(fetched);

    if (fetched.length === 0) {
      setSelectedPortfolioId(null);
      return;
    }

    const nextId =
      preferredId && fetched.some((p) => p.id === preferredId)
        ? preferredId
        : selectedPortfolioId && fetched.some((p) => p.id === selectedPortfolioId)
          ? selectedPortfolioId
          : fetched[0].id;

    setSelectedPortfolioId(nextId);
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
        setError(err instanceof ApiError ? err.message : "Failed to load portfolios.");
      } finally {
        setLoading(false);
      }
    }

    void initialLoad();
  }, []);

  useEffect(() => {
    if (selectedPortfolioId === null) {
      setData(null);
      return;
    }

    const portfolioId = selectedPortfolioId;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        await refreshDashboard(portfolioId);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, [selectedPortfolioId]);

  async function handleCreatePortfolio(name: string, symbols: string[]) {
    const created = await createPortfolio({ name, symbols });
    await loadPortfolios(created.id);
  }

  async function handleAddSymbols(_name: string, symbols: string[]) {
    if (selectedPortfolioId === null) return;
    await addPortfolioSymbols(selectedPortfolioId, symbols);
    await refreshDashboard(selectedPortfolioId);
  }

  async function handleAddCash(amount: number) {
    if (selectedPortfolioId === null) return;
    await depositCash(selectedPortfolioId, amount);
    await refreshDashboard(selectedPortfolioId);
  }

  async function handleDeletePortfolio() {
    if (selectedPortfolioId === null) return;
    if (!window.confirm("Delete this portfolio? This cannot be undone.")) return;

    const deletedId = selectedPortfolioId;
    await deletePortfolio(deletedId);
    await loadPortfolios();
    setData(null);
  }

  if (loading && portfolios.length === 0) {
    return <p>Loading your trading dashboard...</p>;
  }

  return (
    <div className="trading-layout">
      <PortfolioSidebar
        portfolios={portfolios}
        selectedId={selectedPortfolioId}
        onSelect={setSelectedPortfolioId}
        onAdd={() => setCreateModalOpen(true)}
      />

      <main className="trading-main">
        <h1 className="trading-title">Trading</h1>
        <p className="trading-subtitle">Paper trading only. Practice without risking real money.</p>

        {error && (
          <p className="trade-form-error" role="alert">
            {error}
          </p>
        )}

        {portfolios.length === 0 && (
          <section className="empty-portfolio-card">
            <h2>No portfolios yet</h2>
            <p>Create a portfolio and follow at least one symbol to get started.</p>
            <button type="button" className="btn btn-primary" onClick={() => setCreateModalOpen(true)}>
              + Create portfolio
            </button>
          </section>
        )}

        {data && selectedPortfolioId !== null && (
          <>
            {!data.hasFollowedSymbols ? (
              <EmptyPortfolioState
                portfolioName={data.name}
                onAddSymbols={() => setAddSymbolsModalOpen(true)}
                onDeletePortfolio={() => void handleDeletePortfolio()}
              />
            ) : (
              <>
                <PortfolioSummary data={data} onAddCash={() => setAddCashModalOpen(true)} />

                <div className="trading-tabs" role="tablist" aria-label="Portfolio sections">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      className={activeTab === tab.id ? "trading-tab active" : "trading-tab"}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div role="tabpanel">
                  {activeTab === "summary" && (
                    <SummaryTab
                      rows={data.summary}
                      news={data.news}
                      onAddSymbol={() => setAddSymbolsModalOpen(true)}
                    />
                  )}
                  {activeTab === "holdings" && (
                    <HoldingsTab
                      owned={data.holdings.filter((row) => row.shares > 0)}
                      followedNotOwned={data.summary.filter((row) => {
                        const holding = data.holdings.find((h) => h.symbol === row.symbol);
                        return !holding || holding.shares === 0;
                      })}
                      onTrade={(symbol) => setTradeSymbol(symbol)}
                    />
                  )}
                  {activeTab === "history" && <HistoryTab trades={data.trades} />}
                </div>
              </>
            )}
          </>
        )}

        {loading && portfolios.length > 0 && <p className="trade-form-hint">Refreshing...</p>}
      </main>

      <CreatePortfolioModal
        open={createModalOpen}
        title="Create portfolio"
        submitLabel="Create portfolio"
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreatePortfolio}
      />

      <CreatePortfolioModal
        open={addSymbolsModalOpen}
        title="Add symbols"
        submitLabel="Add symbols"
        requireName={false}
        onClose={() => setAddSymbolsModalOpen(false)}
        onSubmit={handleAddSymbols}
      />

      <AddCashModal
        open={addCashModalOpen}
        onClose={() => setAddCashModalOpen(false)}
        onSubmit={handleAddCash}
      />

      {selectedPortfolioId !== null && tradeSymbol && (
        <InlineTradeModal
          open
          symbol={tradeSymbol}
          portfolioId={selectedPortfolioId}
          onClose={() => setTradeSymbol(null)}
          onSuccess={() => refreshDashboard(selectedPortfolioId)}
        />
      )}
    </div>
  );
}
