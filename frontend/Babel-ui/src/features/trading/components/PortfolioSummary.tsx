import type { PortfolioDashboardResponse } from "../../../lib/api/portfolioApi";
import { formatCurrency } from "../utils/format";

type Props = {
  data: PortfolioDashboardResponse;
  onAddCash: () => void;
};

export default function PortfolioSummary({ data, onAddCash }: Props) {
  return (
    <div className="summary-grid">
      <div className="summary-card">
        <p>Cash</p>
        <h2>{formatCurrency(data.cash)}</h2>
        <button type="button" className="btn btn-babel-primary summary-card-action" onClick={onAddCash}>
          + Add cash
        </button>
      </div>
      <div className="summary-card">
        <p>Holdings value</p>
        <h2>{formatCurrency(data.holdingsValue)}</h2>
      </div>
      <div className="summary-card">
        <p>Total value</p>
        <h2>{formatCurrency(data.totalValue)}</h2>
      </div>
    </div>
  );
}
