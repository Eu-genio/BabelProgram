import { useState } from "react";
import type { TradeSide } from "../../../lib/api/tradesApi";
import {
  addPortfolioSymbols,
  createPortfolio,
  deletePortfolio,
  depositCash,
} from "../../../lib/api/portfolioApi";
import { usePortfolio } from "../context/PortfolioContext";
import AddCashModal from "../../trading/components/AddCashModal";
import CreatePortfolioModal from "../../trading/components/CreatePortfolioModal";
import EmptyPortfolioState from "../../trading/components/EmptyPortfolioState";
import InlineTradeModal from "../../trading/components/InlineTradeModal";
import PortfolioSummary from "../../trading/components/PortfolioSummary";
import HistoryTab from "../../trading/components/tabs/HistoryTab";
import HoldingsTab from "../../trading/components/tabs/HoldingsTab";
import SummaryTab from "../../trading/components/tabs/SummaryTab";
import "../../trading/trading.css";

type TabId = "summary" | "history" | "holdings";

const TABS: { id: TabId; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "holdings", label: "Holdings" },
  { id: "history", label: "History" },
];

export default function PortfolioPage() {
  const {
    portfolios,
    selectedPortfolioId,
    data,
    loading,
    error,
    refreshPortfolios,
    refreshDashboard,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [addSymbolsModalOpen, setAddSymbolsModalOpen] = useState(false);
  const [addCashModalOpen, setAddCashModalOpen] = useState(false);
  const [tradeSymbol, setTradeSymbol] = useState<string | null>(null);
  const [tradeSide, setTradeSide] = useState<TradeSide>("buy");

  async function handleCreatePortfolio(name: string, symbols: string[]) {
    const created = await createPortfolio({ name, symbols });
    await refreshPortfolios(created.id);
  }

  async function handleAddSymbols(_name: string, symbols: string[]) {
    if (selectedPortfolioId === null) return;
    await addPortfolioSymbols(selectedPortfolioId, symbols);
    await refreshDashboard();
  }

  async function handleAddCash(amount: number) {
    if (selectedPortfolioId === null) return;
    await depositCash(selectedPortfolioId, amount);
    await refreshDashboard();
  }

  async function handleDeletePortfolio() {
    if (selectedPortfolioId === null) return;
    if (!window.confirm("Delete this portfolio? This cannot be undone.")) return;
    await deletePortfolio(selectedPortfolioId);
    await refreshPortfolios();
  }

  return (
    <>
      <header className="babel-page-header">
        <div>
          <h1>Portfolio</h1>
          <p className="babel-muted">Manage watchlists, holdings, and trades.</p>
        </div>
        <div className="babel-page-header-actions">
          {selectedPortfolioId !== null && portfolios.length > 0 && (
            <button
              type="button"
              className="btn btn-babel-danger"
              onClick={() => void handleDeletePortfolio()}
            >
              Delete portfolio
            </button>
          )}
          <button type="button" className="btn btn-babel-primary" onClick={() => setCreateModalOpen(true)}>
            + New portfolio
          </button>
        </div>
      </header>

      {error && (
        <p className="trade-form-error" role="alert">
          {error}
        </p>
      )}

      {portfolios.length === 0 && (
        <section className="babel-panel babel-empty">
          <h2>No portfolios yet</h2>
          <p className="babel-muted">Create a portfolio and follow at least one symbol to get started.</p>
          <button type="button" className="btn btn-babel-primary" onClick={() => setCreateModalOpen(true)}>
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
                    onTrade={(symbol, side) => {
                      setTradeSide(side);
                      setTradeSymbol(symbol);
                    }}
                  />
                )}
                {activeTab === "history" && <HistoryTab trades={data.trades} />}
              </div>
            </>
          )}
        </>
      )}

      {loading && portfolios.length > 0 && <p className="babel-muted">Refreshing...</p>}

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
          initialSide={tradeSide}
          onClose={() => setTradeSymbol(null)}
          onSuccess={() => refreshDashboard()}
        />
      )}
    </>
  );
}
