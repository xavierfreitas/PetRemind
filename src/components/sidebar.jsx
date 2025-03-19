import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>PetRemind</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/" className="nav-link">
                <i className="nav-icon">🏠</i>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/medical-info" className="nav-link">
                <i className="nav-icon">🩺</i>
                <span>Medical Info</span>
              </Link>
            </li>
            <li>
              <Link to="/reminders" className="nav-link">
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
              <Link to="/profile" className="nav-link">
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
