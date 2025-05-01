import React from "react";
import "../assets/styles/DesktopFeatures.css";

import reminderIcon from "../assets/icons/reminder.png";
import statisticsIcon from "../assets/icons/bar-chart.png";
import medicalIcon from "../assets/icons/hospital.png";
import petTypesIcon from "../assets/icons/livestock.png";

const DesktopFeatures = () => {
  return (
    <div className="features-container">
      <h1 className="features-title">Features</h1>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <img src={reminderIcon} alt="Reminders icon" />
          </div>
          <h3 className="feature-title">Reminders</h3>
          <p className="feature-description">
            PetRemind prompts users with constant reminders about everyday tasks, such as feeding, exercise, vet visits, etc
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <img src={statisticsIcon} alt="User Statistics icon" />
          </div>
          <h3 className="feature-title">User Statistics</h3>
          <p className="feature-description">
            Based on the user's tendencies and activity with certain tasks, PetRemind will store and provide relevant data pertaining specifically to the user themselves
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <img src={medicalIcon} alt="Medical Information icon" />
          </div>
          <h3 className="feature-title">Medical Information</h3>
          <p className="feature-description">
            PetRemind is focused on keeping your pets healthy, accordingly, we have made it easy to store and look up any medical information revolving your pets that you might want to note down.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <img src={petTypesIcon} alt="Many Pet Types icon" />
          </div>
          <h3 className="feature-title">Many Pet Types</h3>
          <p className="feature-description">
            Unlike most other pet applications, PetRemind is very inclusive and supports many different types of pets
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopFeatures;