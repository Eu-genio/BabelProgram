import { usePortfolio } from "../context/PortfolioContext";
import HistoryTab from "../../trading/components/tabs/HistoryTab";

export default function OrdersPage() {
  const { data, loading, portfolios } = usePortfolio();

  return (
    <>
      <header className="babel-page-header">
        <div>
          <h1>Orders</h1>
          <p className="babel-muted">Your paper trade history for the selected portfolio.</p>
        </div>
      </header>

      {portfolios.length === 0 && (
        <section className="babel-panel babel-empty">
          <p className="babel-muted">Create a portfolio to start trading.</p>
        </section>
      )}

      {data && <HistoryTab trades={data.trades} />}
      {loading && portfolios.length > 0 && !data && <p className="babel-muted">Loading trades...</p>}
    </>
  );
}
