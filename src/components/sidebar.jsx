import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../components/sidebar.css"

const Sidebar = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleHeaderClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div 
        className="sidebar-header" 
        onClick={handleHeaderClick}
        style={{ cursor: 'pointer' }}
      >
        <h1>PetRemind</h1>
      </div>
      <nav className={`sidebar-nav ${isCollapsed ? 'hidden' : ''}`}>
        <ul>
          <li>
            <Link to="/authlanding" className="nav-link">
              <i className="nav-icon">🏠</i>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/petcenter" className="nav-link">
              <i className="nav-icon">🐕</i>
              <span>Pet Center</span>
            </Link>
          </li>
          <li>
            <Link to="/medicalinfo" className="nav-link">
              <i className="nav-icon">🩺</i>
              <span>Medical Info</span>
            </Link>
          </li>
          <li>
            <Link to="/reminder" className="nav-link">
              <i className="nav-icon">🔔</i>
              <span>Reminders</span>
            </Link>
          </li>
          <li>
            <Link to="/schedule" className="nav-link">
              <i className="nav-icon">📅</i>
              <span>Schedule</span>
            </Link>
          </li>
          <li>
            <Link to="/petprofile" className="nav-link">
              <i className="nav-icon">👤</i>
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="nav-link">
              <i className="nav-icon">⚙️</i>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
  
  export default Sidebar;
