import type { PortfolioDashboardResponse } from "../../../lib/api/portfolioApi";

type Props = {
  data: PortfolioDashboardResponse;
};

export default function PortfolioSummary({ data }: Props) {
  return (
    <div className="summary-grid">
      <div className="summary-card">
        <p>Cash</p>
        <h2>${data.cash.toFixed(2)}</h2>
      </div>

      <div className="summary-card">
        <p>Holdings Value</p>
        <h2>${data.holdingsValue.toFixed(2)}</h2>
      </div>

      <div className="summary-card">
        <p>Total Value</p>
        <h2>${data.totalValue.toFixed(2)}</h2>
      </div>
    </div>
  );
}