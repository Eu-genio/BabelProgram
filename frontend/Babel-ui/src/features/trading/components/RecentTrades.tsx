export default function RecentTrades() {
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
          <tr>
            <td>AAPL</td>
            <td>Buy</td>
            <td>10</td>
            <td>$150</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}