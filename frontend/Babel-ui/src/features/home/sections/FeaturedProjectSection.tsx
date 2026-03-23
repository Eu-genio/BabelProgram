import "../home.css";
export default function FeaturedProjectSection() {
  return (
    <section className="section">
      <h2 className="section-title">Featured Project</h2>

      <h3 className="project-title">Babel</h3>

      <p className="text-body">
        A full-stack trading simulator built with ASP.NET Core and React.
      </p>

      <p className="text-body">
        Includes portfolio tracking, asset management, and a complete trade
        execution engine.
      </p>

      <p className="text-muted text-body">
        Designed using a modular monolith architecture with clean separation
        across application layers.
      </p>
    </section>
  );
}