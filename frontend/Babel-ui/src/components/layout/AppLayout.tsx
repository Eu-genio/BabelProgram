import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import "./layout.css";

const LINKEDIN_URL = "https://www.linkedin.com/in/eu-genio/";

function LockIcon() {
  return (
    <svg className="nav-lock-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export default function AppLayout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tradingHref = token ? "/trading" : "/login";
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            Eugenio
          </Link>

          <nav className="nav-center" aria-label="Main">
            <Link to="/about" className={isActive("/about") ? "nav-link active" : "nav-link"}>
              About
            </Link>
            <Link to="/projects" className={isActive("/projects") ? "nav-link active" : "nav-link"}>
              Projects
            </Link>
            <Link
              to="/experience"
              className={isActive("/experience") ? "nav-link active" : "nav-link"}
            >
              Experience
            </Link>
            <Link
              to={tradingHref}
              className={`nav-link nav-link-locked${isActive("/trading") ? " active" : ""}`}
            >
              Trading Simulator
              {!token && <LockIcon />}
            </Link>
          </nav>

          <div className="nav-right">
            {token ? (
              <button type="button" onClick={handleLogout} className="nav-signout">
                Log out
              </button>
            ) : (
              <Link to="/login" className="nav-signout">
                Sign in
              </Link>
            )}
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="nav-cta">
              <span>Get in touch</span> →
            </a>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
