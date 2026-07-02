import type { PortfolioNewsItem } from "../../../../lib/api/portfolioApi";
import { formatDateTimeUtc } from "../../utils/format";

type Props = {
  items: PortfolioNewsItem[];
};

export default function NewsTab({ items }: Props) {
  return (
    <div className="table-section">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Headline</th>
            <th>Source</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4}>No news for your followed symbols.</td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={`${item.url}-${item.symbol}`}>
              <td>{item.symbol}</td>
              <td>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.headline}
                </a>
              </td>
              <td>{item.source}</td>
              <td>{formatDateTimeUtc(item.publishedAtUtc)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
