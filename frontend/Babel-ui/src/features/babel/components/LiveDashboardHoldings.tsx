import StockLogo from "../../../components/StockLogo";
import { usePortfolio } from "../context/PortfolioContext";
import {
  formatCurrency,
  formatSignedCurrency,
  formatSignedPercent,
} from "../../trading/utils/format";

export default function LiveDashboardHoldings() {
  const { data } = usePortfolio();
  const owned = data?.holdings.filter((h) => h.shares > 0).slice(0, 5) ?? [];

  if (owned.length === 0) {
    return <p className="babel-muted">No positions yet. Buy from Portfolio or Markets.</p>;
  }

  return (
    <ul className="babel-holdings-list">
      {owned.map((item) => (
        <li key={item.symbol}>
          <StockLogo symbol={item.symbol} size={36} />
          <div className="babel-holding-meta">
            <strong>{item.symbol}</strong>
            <span>{formatSignedPercent(item.changePercent)} today</span>
          </div>
          <div className="babel-holding-values">
            <strong>{formatCurrency(item.value)}</strong>
            <span className={item.todaysGain >= 0 ? "market-up" : "market-down"}>
              {formatSignedCurrency(item.todaysGain)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
