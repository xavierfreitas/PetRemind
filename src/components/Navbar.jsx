import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../assets/styles/Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;  // for back-arrow logic

  const hideNavbarRoutes = ['/authlanding', '/'];

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.clear();

        navigate("/authlanding");
      })
      .catch((error) => {
        console.error("Navbar: Failed signing out", error);
      })
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Link className="navbar-link-logo" to="/">PetRemind</Link>
        <a className="divider">|</a>
        {/* back arrow (only if somethign to go back to) */}
        {canGoBack && (
          <ArrowBackIcon
            className="navbar-back-icon"
            onClick={() => navigate(-1)}
          />
        )}
      </div>
      <div className="navbar-right">
        <Link className="navbar-link" to="/authlanding">Home</Link>
        <Link className="navbar-link" to="/petprofile/">Pet Profiles</Link>
        <Link className="navbar-link" to="/reminder">Reminder</Link>
        <Link className="navbar-link" to="/features">Features</Link>
        <a className="divider">|</a>
        <span id="navbar-signout" className="navbar-link" onClick={handleSignOut}>Sign Out</span>
      </div>
    </nav>
  );
}

export default Navbar;
