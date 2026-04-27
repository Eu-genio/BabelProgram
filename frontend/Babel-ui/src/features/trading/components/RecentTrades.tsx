import type { DashboardTrade } from "../../../lib/api/portfolioApi";

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
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => (
            <tr key={t.id}>
              <td>{t.symbol}</td>
              <td>{t.side}</td>
              <td>{t.quantity}</td>
              <td>${t.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}