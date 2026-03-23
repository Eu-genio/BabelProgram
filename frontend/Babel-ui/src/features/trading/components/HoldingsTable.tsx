export default function HoldingsTable() {
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
          <tr>
            <td>AAPL</td>
            <td>10</td>
            <td>$150</td>
            <td>$1500</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}