export default function ProjectCard() {
  return (
    <div className="project-card">
      <h2 className="project-name">Babel</h2>

      <p className="project-description">
        A full-stack trading simulator that allows users to simulate buying and
        selling assets using real market data.
      </p>

      <p className="project-description">
        Built with ASP.NET Core (.NET 8) and React, featuring a modular
        monolith architecture and a fully implemented trading engine.
      </p>

      <div className="project-stack">
        <span>.NET 8</span>
        <span>React</span>
        <span>TypeScript</span>
        <span>Entity Framework</span>
        <span>SQLite</span>
      </div>
    </div>
  );
}