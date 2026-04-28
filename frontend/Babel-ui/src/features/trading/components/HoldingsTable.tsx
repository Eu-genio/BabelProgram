import type { DashboardHolding } from "../../../lib/api/portfolioApi";
import { formatCurrency, formatQuantity } from "../utils/format";

type Props = {
  data: DashboardHolding[]; 
};

export default function HoldingsTable({ data }: Props) {
  return (
    <div className="table-section">
      <h2>Holdings</h2>

      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Value</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={4}>No holdings yet. Place a buy trade to get started.</td>
            </tr>
          )}
          {data.map((h) => (
            <tr key={h.symbol}>
              <td>{h.symbol}</td>
              <td>{formatQuantity(h.quantity)}</td>
              <td>{formatCurrency(h.currentPrice)}</td>
              <td>{formatCurrency(h.marketValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}