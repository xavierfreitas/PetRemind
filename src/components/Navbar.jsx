import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar_container">
      <Link id="navbar_link_home" className="navbar_link" to="/">Home</Link>
      <Link id="navbar_link_petprofile" className="navbar_link" to="/petprofile">Pet Profile</Link>
      <Link id="navbar_link_reminder" className="navbar_link" to="/reminder">Reminder</Link>
      <Link id="navbar_link_medicalinfo" className="navbar_link" to="/medicalinfo">Medical Info.</Link>
      <Link id="navbar_link_features" className="navbar_link" to="/features">Features</Link>
    </nav>
  );
}

export default Navbar;
