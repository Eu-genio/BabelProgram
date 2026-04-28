import type { PortfolioDashboardResponse } from "../../../lib/api/portfolioApi";
import { formatCurrency } from "../utils/format";

type Props = {
  data: PortfolioDashboardResponse;
};

export default function PortfolioSummary({ data }: Props) {
  return (
    <div className="summary-grid">
      <div className="summary-card">
        <p>Cash</p>
        <h2>{formatCurrency(data.cash)}</h2>
      </div>

      <div className="summary-card">
        <p>Holdings Value</p>
        <h2>{formatCurrency(data.holdingsValue)}</h2>
      </div>

      <div className="summary-card">
        <p>Total Value</p>
        <h2>{formatCurrency(data.totalValue)}</h2>
      </div>
    </div>
  );
}