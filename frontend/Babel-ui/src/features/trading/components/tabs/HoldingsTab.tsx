import type { HoldingsRow, SummaryRow } from "../../../../lib/api/portfolioApi";
import {
  colorClassForValue,
  formatCurrency,
  formatQuantity,
  formatSignedCurrency,
  formatSignedPercent,
  formatVolume,
} from "../../utils/format";

type Props = {
  owned: HoldingsRow[];
  followedNotOwned: SummaryRow[];
  onTrade: (symbol: string) => void;
};

export default function HoldingsTab({ owned, followedNotOwned, onTrade }: Props) {
  return (
    <div className="holdings-tab">
      <section className="portfolio-table-card">
        <h2 className="section-heading">Stocks you own</h2>
        <div className="table-section">
          <table className="portfolio-table portfolio-table--owned">
            <thead>
              <tr>
                <th className="col-symbol">Symbol</th>
                <th>Price</th>
                <th>Chg</th>
                <th>Chg %</th>
                <th>Wt %</th>
                <th>Shares</th>
                <th>Cost</th>
                <th>Today</th>
                <th>Today %</th>
                <th>Est inc</th>
                <th>Tot chg</th>
                <th>Tot %</th>
                <th>Value</th>
                <th className="col-actions">Trade</th>
              </tr>
            </thead>
            <tbody>
              {owned.length === 0 && (
                <tr>
                  <td colSpan={14}>You don&apos;t own any shares yet. Buy from the section below.</td>
                </tr>
              )}
              {owned.map((row) => (
                <tr key={row.symbol}>
                  <td className="col-symbol">{row.symbol}</td>
                  <td>{formatCurrency(row.price)}</td>
                  <td className={colorClassForValue(row.change)}>{formatCurrency(row.change)}</td>
                  <td className={colorClassForValue(row.changePercent)}>
                    {formatSignedPercent(row.changePercent)}
                  </td>
                  <td>{row.weight.toFixed(2)}%</td>
                  <td>{formatQuantity(row.shares)}</td>
                  <td>{formatCurrency(row.cost)}</td>
                  <td className={colorClassForValue(row.todaysGain)}>
                    {formatSignedCurrency(row.todaysGain)}
                  </td>
                  <td className={colorClassForValue(row.todaysGainPercent)}>
                    {formatSignedPercent(row.todaysGainPercent)}
                  </td>
                  <td>{row.estAnnualIncome != null ? formatCurrency(row.estAnnualIncome) : "—"}</td>
                  <td className={colorClassForValue(row.totalChange)}>
                    {formatSignedCurrency(row.totalChange)}
                  </td>
                  <td className={colorClassForValue(row.totalChangePercent)}>
                    {formatSignedPercent(row.totalChangePercent)}
                  </td>
                  <td>{formatCurrency(row.value)}</td>
                  <td className="col-actions">
                    <button
                      type="button"
                      className="btn btn-secondary trade-inline-btn"
                      onClick={() => onTrade(row.symbol)}
                    >
                      Buy / Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="portfolio-table-card">
        <h2 className="section-heading">Followed — not owned</h2>
        <p className="trade-form-hint holdings-section-hint">
          Symbols you follow but haven&apos;t bought yet.
        </p>
        <div className="table-section">
          <table className="portfolio-table portfolio-table--watchlist">
            <thead>
              <tr>
                <th className="col-symbol">Symbol</th>
                <th>Price</th>
                <th>Chg</th>
                <th>Chg %</th>
                <th>Volume</th>
                <th>Avg vol</th>
                <th>Prev close</th>
                <th>Open</th>
                <th className="col-actions">Trade</th>
              </tr>
            </thead>
            <tbody>
              {followedNotOwned.length === 0 && (
                <tr>
                  <td colSpan={9}>All followed symbols are in your portfolio. Add more from Summary.</td>
                </tr>
              )}
              {followedNotOwned.map((row) => (
                <tr key={row.symbol}>
                  <td className="col-symbol">{row.symbol}</td>
                  <td>{formatCurrency(row.price)}</td>
                  <td className={colorClassForValue(row.change)}>{formatCurrency(row.change)}</td>
                  <td className={colorClassForValue(row.changePercent)}>
                    {formatSignedPercent(row.changePercent)}
                  </td>
                  <td>{formatVolume(row.volume)}</td>
                  <td>{formatVolume(row.averageVolume)}</td>
                  <td>{formatCurrency(row.previousClose)}</td>
                  <td>{formatCurrency(row.open)}</td>
                  <td className="col-actions">
                    <button
                      type="button"
                      className="btn btn-primary trade-inline-btn"
                      onClick={() => onTrade(row.symbol)}
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
