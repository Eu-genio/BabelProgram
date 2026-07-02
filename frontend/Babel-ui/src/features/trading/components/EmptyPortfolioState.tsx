type Props = {
  portfolioName: string;
  onAddSymbols: () => void;
  onDeletePortfolio: () => void;
};

export default function EmptyPortfolioState({ portfolioName, onAddSymbols, onDeletePortfolio }: Props) {
  return (
    <section className="empty-portfolio-card">
      <h2>{portfolioName}</h2>
      <h3>Your portfolio is empty</h3>
      <p>Add symbols to get news and analysis on your stocks and ETFs.</p>
      <div className="empty-portfolio-card-actions">
        <button type="button" className="btn btn-primary" onClick={onAddSymbols}>
          + Add symbols
        </button>
        <button type="button" className="btn btn-danger-outline" onClick={onDeletePortfolio}>
          Delete portfolio
        </button>
      </div>
    </section>
  );
}
