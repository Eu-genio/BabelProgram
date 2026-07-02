import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import "../projects.css";

export default function ProjectsPage() {
  return (
    <div className="portfolio-page projects-page">
      <header className="portfolio-page-header">
        <span className="portfolio-page-eyebrow">Work</span>
        <h1>Projects</h1>
        <p className="portfolio-page-lead">
          Selected builds that reflect how I approach architecture, reliability, and product thinking.
        </p>
      </header>

      <div className="projects-grid">
        <ProjectCard />
      </div>

      <p className="portfolio-page-footer">
        <Link to="/">← Back home</Link>
      </p>
    </div>
  );
}
