import { Link } from "react-router-dom";
import "../home.css";

const EXPERIENCE = [
  {
    role: "Associate Analyst Developer (Full Stack)",
    company: "FNZ",
    location: "Brno, Czechia",
    period: "July 2024 – December 2025",
    highlights: [
      "Full-stack development with C# .NET MVC and React, focused on reusability and maintainability.",
      "Monitored production platform performance and resolved issues under time constraints.",
      "Integrated new data sources into stored procedures and views for evolving business needs.",
      "Built documentation and support systems to reduce repeat questions across teams.",
      "Hands-on QA experience: defect tracking, regression testing, and release validation.",
    ],
  },
  {
    role: "Release Engineer Intern",
    company: "Oracle",
    location: "Dublin",
    period: "June 2020 – July 2021",
    highlights: [
      "Resolved automated and manual tickets across translation workflows and customer issues.",
      "Maintained automated tools to improve workflow efficiency and dataset filtering.",
    ],
  },
  {
    role: "Computer Science Tutor",
    company: "Maynooth University",
    location: "Maynooth",
    period: "June 2020 – August 2021",
    highlights: [
      "Taught programming to 30+ students aged 13–18 with varying skill levels.",
      "Planned and delivered full-day curricula with clear learning objectives.",
    ],
  },
];

export default function ExperiencePage() {
  return (
    <div className="portfolio-page">
      <header className="portfolio-page-header">
        <span className="portfolio-page-eyebrow">Career</span>
        <h1>Experience</h1>
        <p className="portfolio-page-lead">
          Four years across fintech development, production support, QA, and release engineering.
        </p>
      </header>

      <div className="timeline">
        {EXPERIENCE.map((item) => (
          <article key={`${item.company}-${item.period}`} className="timeline-card">
            <div className="timeline-meta">
              <span className="timeline-period">{item.period}</span>
              <span className="timeline-location">{item.location}</span>
            </div>
            <h2>{item.role}</h2>
            <p className="timeline-company">{item.company}</p>
            <ul>
              {item.highlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="portfolio-page-footer">
        <Link to="/">← Back home</Link>
      </p>
    </div>
  );
}
