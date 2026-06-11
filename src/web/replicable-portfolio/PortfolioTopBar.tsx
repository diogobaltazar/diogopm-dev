import { useAuth0 } from "@auth0/auth0-react";
import { Link, NavLink } from "react-router-dom";

export default function PortfolioTopBar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <header className="portfolio-topbar">
      <div className="portfolio-topbar-inner">
        <Link to="/" className="portfolio-brand">
          PEREIRA-MARQUES
        </Link>

        <nav className="portfolio-nav">
          <NavLink
            to="/cv"
            className={({ isActive }) => `portfolio-nav-link${isActive ? " portfolio-nav-link--active" : ""}`}
          >
            /WORK
          </NavLink>
          <NavLink
            to="/essay"
            className={({ isActive }) => `portfolio-nav-link${isActive ? " portfolio-nav-link--active" : ""}`}
          >
            /ESSAY
          </NavLink>
        </nav>

        <div className="portfolio-auth">
          {isAuthenticated ? (
            <button
              type="button"
              className="portfolio-auth-button"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              SIGN OUT
            </button>
          ) : (
            <button
              type="button"
              className="portfolio-auth-button"
              onClick={() => loginWithRedirect({ appState: { returnTo: "/cv" } })}
            >
              CV LOGIN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
