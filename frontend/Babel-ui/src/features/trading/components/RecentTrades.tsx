import type { DashboardTrade } from "../../../lib/api/portfolioApi";
import { formatCurrency, formatDateTimeUtc, formatQuantity } from "../utils/format";

type Props = {
  data: DashboardTrade[];
};

export default function RecentTrades({ data }: Props) {
  return (
    <div className="table-section">
      <h2>Recent Trades</h2>

      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Side</th>
            <th>Quantity</th>
            <th>Execution price</th>
            <th>Filled (UTC)</th>
            <th>Quote as of (UTC)</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={6}>No trades yet. Submit your first buy order above.</td>
            </tr>
          )}
          {data.map((t) => (
            <tr key={t.id}>
              <td>{t.symbol}</td>
              <td>{t.side}</td>
              <td>{formatQuantity(t.quantity)}</td>
              <td>{formatCurrency(t.price)}</td>
              <td>{formatDateTimeUtc(t.executedAtUtc)}</td>
              <td>{t.quoteAsOfUtc ? formatDateTimeUtc(t.quoteAsOfUtc) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}