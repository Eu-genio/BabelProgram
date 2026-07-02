import type { PortfolioNewsItem, SummaryRow } from "../../../../lib/api/portfolioApi";
import {
  colorClassForValue,
  formatCurrency,
  formatRelativeTime,
  formatSignedPercent,
  formatVolume,
} from "../../utils/format";

type Props = {
  rows: SummaryRow[];
  news: PortfolioNewsItem[];
  onAddSymbol: () => void;
};

export default function SummaryTab({ rows, news, onAddSymbol }: Props) {
  return (
    <div className="summary-tab">
      <div className="section-toolbar">
        <h2 className="section-heading">Followed stocks</h2>
        <button type="button" className="btn btn-babel-primary" onClick={onAddSymbol}>
          + Add symbol
        </button>
      </div>

      <div className="table-section portfolio-table-card">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Volume</th>
              <th>Avg. Vol</th>
              <th>Prev Close</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8}>No followed symbols yet. Use Add symbol to follow stocks.</td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.symbol}>
                <td>{row.symbol}</td>
                <td>{formatCurrency(row.price)}</td>
                <td className={colorClassForValue(row.change)}>{formatCurrency(row.change)}</td>
                <td className={colorClassForValue(row.changePercent)}>
                  {formatSignedPercent(row.changePercent)}
                </td>
                <td>{formatVolume(row.volume)}</td>
                <td>{formatVolume(row.averageVolume)}</td>
                <td>{formatCurrency(row.previousClose)}</td>
                <td>{formatCurrency(row.open)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="summary-news-section portfolio-table-card">
        <h2 className="section-heading">News for your followed stocks</h2>
        {news.length === 0 ? (
          <p className="trade-form-hint">No recent news for your followed symbols.</p>
        ) : (
          <ul className="summary-news-grid">
            {news.map((item) => (
              <li key={`${item.url}-${item.symbol}`} className="summary-news-card">
                <div className="summary-news-card-top">
                  <span className="summary-news-symbol">{item.symbol}</span>
                  <span className="summary-news-source">{item.source}</span>
                </div>
                <a href={item.url} target="_blank" rel="noreferrer" className="summary-news-headline">
                  {item.headline}
                </a>
                {item.summary && <p className="summary-news-summary">{item.summary}</p>}
                <span className="summary-news-meta">{formatRelativeTime(item.publishedAtUtc)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
