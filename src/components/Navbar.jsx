import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/styles/Navbar.css";

function Navbar() {
  const location = useLocation();

  const hideNavbarRoutes = ['/authlanding'];

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navbar_container">
      <div className="navbar_left"></div>
      <Link id="navbar_link_logo" className="navbar_link_logo" to="/">PetRemind</Link>
      <div className="navbar_right">
        <Link id="navbar_link_home" className="navbar_link" to="/authlanding">Home</Link>
        <Link id="navbar_link_petprofile" className="navbar_link" to="/petprofile">Pet Profile</Link>
        <Link id="navbar_link_reminder" className="navbar_link" to="/reminder">Reminder</Link>
        <Link id="navbar_link_features" className="navbar_link" to="/features">Features</Link>
      </div>
    </nav>
  );
}

export default Navbar;
