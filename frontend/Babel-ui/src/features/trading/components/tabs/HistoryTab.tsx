import type { DashboardTrade } from "../../../../lib/api/portfolioApi";
import { formatCurrency, formatDateTimeUtc, formatQuantity } from "../../utils/format";

type Props = {
  trades: DashboardTrade[];
};

export default function HistoryTab({ trades }: Props) {
  return (
    <div className="table-section table-scroll">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Side</th>
            <th>Quantity</th>
            <th>Execution price</th>
            <th>Filled (UTC)</th>
            <th>Quote as of (UTC)</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 && (
            <tr>
              <td colSpan={6}>No trades yet.</td>
            </tr>
          )}
          {trades.map((t) => (
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
