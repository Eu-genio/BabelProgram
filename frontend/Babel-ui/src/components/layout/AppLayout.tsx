import { Outlet, Link } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/projects" style={{ marginRight: "1rem" }}>Projects</Link>
        <Link to="/trading">Trading</Link>
      </nav>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}