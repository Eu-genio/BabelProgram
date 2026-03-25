import { Outlet, Link } from "react-router-dom";
import "./layout.css";
import { useAuth } from "../../auth/useAuth";

export default function AppLayout() {
  const {logout} = useAuth();
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <Link to="/" className="nav-link">Eugenio</Link>
          </div>

          <div className="nav-right">
            <Link to="/projects" className="nav-link">Projects</Link>
            <Link to="/trading" className="nav-link">Trading</Link>
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}