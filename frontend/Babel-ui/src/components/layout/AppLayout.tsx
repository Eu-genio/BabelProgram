import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import "./layout.css";

export default function AppLayout() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <Link to="/" className="nav-link">Eugenio</Link>
          </div>

          <div className="nav-right">
            <Link to="/projects" className="nav-link">Projects</Link>

            {token ? (
              <>
                <span className="nav-user">
                  {user?.email ?? "Signed in"}
                </span>
                <Link to="/trading" className="nav-link">Trading</Link>
                <button onClick={handleLogout} className="nav-link nav-button">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Login</Link>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}