import { Link } from "react-router-dom";
import "../home.css";

const SKILL_GROUPS = [
  {
    title: "Languages & frameworks",
    items: ["C#", ".NET MVC", "React", "TypeScript", "JavaScript", "Visual Basic"],
  },
  {
    title: "Data & platforms",
    items: ["SQL", "Entity Framework", "REST APIs", "Azure / Git"],
  },
  {
    title: "Practices",
    items: ["OOP", "Clean architecture", "QA & regression testing", "Production support"],
  },
];

export default function SkillsPage() {
  return (
    <div className="portfolio-page">
      <header className="portfolio-page-header">
        <span className="portfolio-page-eyebrow">Capabilities</span>
        <h1>Skills</h1>
        <p className="portfolio-page-lead">
          Tools and practices I use to ship reliable, maintainable software.
        </p>
      </header>

      <div className="skills-grid">
        {SKILL_GROUPS.map((group) => (
          <section key={group.title} className="skills-card">
            <h2>{group.title}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="portfolio-page-footer">
        <Link to="/">← Back home</Link>
      </p>
    </div>
  );
}
