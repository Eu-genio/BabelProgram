import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import BabelDashboardPreview from "../components/BabelDashboardPreview";
import "../home.css";

export default function FeaturedProjectSection() {
  const { token } = useAuth();

  return (
    <section className="featured-section">
      <div className="featured-inner">
        <header className="featured-header">
          <div>
            <span className="portfolio-page-eyebrow">Featured project</span>
            <h2>Babel Trading Simulator</h2>
            <p>
              A full-stack paper trading platform built with ASP.NET Core and React. Portfolio
              watchlists, trade execution, and live market data, designed as a modular monolith for
              learning and demonstration.
            </p>
          </div>
          <Link to={token ? "/trading" : "/login"} className="btn btn-hero-primary">
            Try the simulator →
          </Link>
        </header>

        <BabelDashboardPreview />
      </div>
    </section>
  );
}
