import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/Navbar.css";
import { getAuth, signOut } from "firebase/auth";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

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
    <nav className="navbar_container">
      <div className="navbar_left">
        <Link id="navbar_link_logo" className="navbar_link_logo" to="/">PetRemind</Link>
      </div>
      <div className="navbar_right">
        <Link id="navbar_link_home" className="navbar_link" to="/authlanding">Home</Link>
        <Link id="navbar_link_petprofile" className="navbar_link" to="/petprofile">Pet Profile</Link>
        <Link id="navbar_link_reminder" className="navbar_link" to="/reminder">Reminder</Link>
        <Link id="navbar_link_features" className="navbar_link" to="/features">Features</Link>
        <span id="navbar_link_signout" className="navbar_link" onClick={handleSignOut}>Sign Out</span>
      </div>
    </nav>
  );
}

export default Navbar;
