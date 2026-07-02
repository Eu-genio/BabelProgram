import { Link } from "react-router-dom";
import TechStackBar from "../components/TechStackBar";
import TerminalCard from "./TerminalCard";
import "../home.css";

const EXPERIENCE_PILLS = ["Full-stack development", "QA & testing", "Production support"];

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v10m0 0l4-4m-4 4l-4-4M5 18h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="hero-badge">Full-stack developer</span>
          <h1 className="hero-title">
            Full-stack developer with a practical eye for{" "}
            <span className="hero-title-accent">quality, support, and maintainable systems.</span>
          </h1>
          <p className="hero-description">
            I work across .NET, React, QA, and production support. I care about building systems
            that are not just functional, but understandable, reliable, and easy to improve.
          </p>

          <aside className="hero-callout">
            Experience across development, testing, documentation, and production support gives
            me a grounded view of how software behaves after it ships.
          </aside>

          <div className="hero-experience-row" aria-label="Areas of experience">
            {EXPERIENCE_PILLS.map((item) => (
              <span key={item} className="hero-experience-pill">
                {item}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <Link to="/projects" className="btn btn-hero-primary">
              View my projects →
            </Link>
            <a
              href="/EugenioBorgnolo_CV.pdf"
              download="EugenioBorgnolo_CV.pdf"
              className="btn btn-hero-secondary"
            >
              <DownloadIcon />
              Download CV
            </a>
          </div>

          <TechStackBar />
        </div>

        <TerminalCard />
      </div>
    </section>
  );
}
