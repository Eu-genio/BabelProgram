import type { DashboardHolding } from "../../../lib/api/portfolioApi";

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
          {data.map((h) => (
            <tr key={h.assetId}>
              <td>{h.symbol}</td>
              <td>{h.quantity}</td>
              <td>${h.price}</td>
              <td>${h.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}