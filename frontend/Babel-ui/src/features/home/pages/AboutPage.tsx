import { Link } from "react-router-dom";
import "../home.css";

export default function AboutPage() {
  return (
    <div className="portfolio-page">
      <header className="portfolio-page-header">
        <span className="portfolio-page-eyebrow">Profile</span>
        <h1>About</h1>
        <p className="portfolio-page-lead">
          Software engineer based in Ireland, focused on full-stack systems that hold up in production.
        </p>
      </header>

      <div className="about-content">
        <p>
          After graduating from Maynooth University with a 2:1 in Computer Science and Software
          Engineering, I joined FNZ in the Czech Republic as a Technology Solutions Graduate. My
          role spanned development, QA, and production support — giving me a practical view of how
          software behaves outside the IDE.
        </p>
        <p>
          I spent four months as a tester, which shaped how I write code today: clearer
          documentation, empathy for QA, and thorough defect analysis. I also supported production
          environments, monitored platform performance, and collaborated across departments to keep
          systems stable.
        </p>
        <p>
          At Maynooth I explored machine learning, computer vision, networks, and NLP — including a
          year-long internship at Oracle. I enjoy building modular, explainable systems and learning
          tools that solve real problems.
        </p>
      </div>

      <div className="about-actions">
        <a
          href="/EugenioBorgnolo_CV.pdf"
          download="EugenioBorgnolo_CV.pdf"
          className="btn btn-hero-primary"
        >
          Download CV
        </a>
        <a
          href="https://www.linkedin.com/in/eu-genio/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-hero-secondary"
        >
          LinkedIn
        </a>
      </div>

      <p className="portfolio-page-footer">
        <Link to="/">← Back home</Link>
      </p>
    </div>
  );
}
