import { Link } from "react-router-dom";
import "../projects.css";

export default function ProjectCard() {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h2 className="project-name">Babel</h2>
        <span className="project-badge">Featured</span>
      </div>

      <p className="project-description">
        A full-stack paper trading simulator built with ASP.NET Core and React. Includes portfolio
        watchlists, trade execution, market data, and a modular monolith backend.
      </p>

      <div className="project-stack">
        <span>C#</span>
        <span>.NET 8</span>
        <span>React</span>
        <span>TypeScript</span>
        <span>SQLite</span>
      </div>

      <div className="project-links">
        <Link to="/login" className="btn btn-hero-primary">
          Open trading simulator →
        </Link>
      </div>
    </article>
  );
}
