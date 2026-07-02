import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";

export default function SettingsPage() {
  const { logout, user } = useAuth();
  const { data } = usePortfolio();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <header className="babel-page-header">
        <div>
          <h1>Settings</h1>
          <p className="babel-muted">Account and simulator preferences.</p>
        </div>
      </header>

      <section className="babel-panel babel-settings-card">
        <h2>Account</h2>
        <dl className="babel-settings-list">
          <div>
            <dt>Signed in as</dt>
            <dd>{user?.email ?? "N/A"}</dd>
          </div>
          <div>
            <dt>Active portfolio</dt>
            <dd>{data?.name ?? "N/A"}</dd>
          </div>
        </dl>
        <div className="babel-settings-actions">
          <Link to="/trading/portfolio" className="btn btn-babel-secondary">
            Manage portfolios
          </Link>
          <button type="button" className="btn btn-babel-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>
    </>
  );
}
