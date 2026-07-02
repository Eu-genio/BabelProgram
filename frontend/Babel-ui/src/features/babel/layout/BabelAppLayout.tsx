import { Link, NavLink, Outlet } from "react-router-dom";
import PortfolioSelect from "../components/PortfolioSelect";
import { PortfolioProvider, usePortfolio } from "../context/PortfolioContext";
import "../babel.css";

const NAV = [
  { to: "/trading", label: "Dashboard", end: true },
  { to: "/trading/portfolio", label: "Portfolio", end: false },
  { to: "/trading/markets", label: "Markets", end: false },
  { to: "/trading/orders", label: "Orders", end: false },
  { to: "/trading/watchlist", label: "Watchlist", end: false },
  { to: "/trading/settings", label: "Settings", end: false },
];

function NavIcon({ name }: { name: string }) {
  if (name === "Dashboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }
  if (name === "Portfolio") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "Markets") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 18V6M4 18h16M8 14l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "Orders") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "Watchlist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function BabelShellInner() {
  const { portfolios, selectedPortfolioId, setSelectedPortfolioId } = usePortfolio();

  return (
    <div className="babel-app">
      <aside className="babel-sidebar" aria-label="Babel navigation">
        <Link to="/" className="babel-brand">
          Babel
        </Link>
        <nav className="babel-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "babel-nav-link active" : "babel-nav-link")}
            >
              <NavIcon name={item.label} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="babel-back-link">
          ← Back to site
        </Link>
      </aside>

      <div className="babel-content">
        <header className="babel-topbar">
          <div className="babel-topbar-left">
            <span className="babel-portfolio-label">Portfolio</span>
            <PortfolioSelect
              portfolios={portfolios}
              selectedId={selectedPortfolioId}
              onSelect={setSelectedPortfolioId}
            />
          </div>
          <p className="babel-topbar-hint">Paper trading — no real money</p>
        </header>

        <div className="babel-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function BabelAppLayout() {
  return (
    <PortfolioProvider>
      <BabelShellInner />
    </PortfolioProvider>
  );
}
