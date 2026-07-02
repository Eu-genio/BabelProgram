import type { PortfolioResponse } from "../../../lib/api/portfolioApi";

type Props = {
  portfolios: PortfolioResponse[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAdd: () => void;
};

export default function PortfolioSidebar({ portfolios, selectedId, onSelect, onAdd }: Props) {
  return (
    <aside className="portfolio-sidebar" aria-label="Portfolios">
      <h2 className="portfolio-sidebar-title">Portfolios</h2>
      <ul className="portfolio-sidebar-list">
        {portfolios.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={p.id === selectedId ? "portfolio-sidebar-item active" : "portfolio-sidebar-item"}
              onClick={() => onSelect(p.id)}
            >
              {p.name}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-secondary portfolio-sidebar-add" onClick={onAdd}>
        + New portfolio
      </button>
    </aside>
  );
}
