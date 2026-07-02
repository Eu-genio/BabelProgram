import { useEffect, useRef, useState } from "react";
import type { PortfolioResponse } from "../../../lib/api/portfolioApi";

type Props = {
  portfolios: PortfolioResponse[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function PortfolioSelect({ portfolios, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = portfolios.find((p) => p.id === selectedId);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="portfolio-select" ref={rootRef}>
      <button
        type="button"
        className="portfolio-select-trigger"
        onClick={() => setOpen((value) => !value)}
        disabled={portfolios.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected?.name ?? "No portfolios"}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      </button>

      {open && portfolios.length > 0 && (
        <ul className="portfolio-select-menu" role="listbox">
          {portfolios.map((portfolio) => (
            <li key={portfolio.id}>
              <button
                type="button"
                role="option"
                aria-selected={portfolio.id === selectedId}
                className={portfolio.id === selectedId ? "active" : undefined}
                onClick={() => {
                  onSelect(portfolio.id);
                  setOpen(false);
                }}
              >
                {portfolio.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
