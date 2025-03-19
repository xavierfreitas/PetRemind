import React from "react";
import "./medicalinfo.css";

const MedicalInfo = () => {
  return (
    <div className="medical-info-container">
      <h1 className="title">Medical Information</h1>
      
      <div className="content-wrapper">
        {/* Left Section */}
        <div className="left-section">
          <button className="edit-button">Edit Info</button>

          <div className="info-section">
            <h2>Health Overview</h2>
            <p>General health summary of the pet...</p>
          </div>

          <div className="info-section">
            <h2>Upcoming Appointments</h2>
            <p>Next vet visit details...</p>
          </div>

          <div className="info-section">
            <h2>Emergency Contacts</h2>
            <p>Contact details in case of emergency...</p>
          </div>

          <div className="info-section">
            <h2>Medical History</h2>
            <p>Previous treatments, surgeries, conditions...</p>
          </div>
        </div>

        {/* Right Section - Key Info */}
        <div className="right-section">
          <h2>Key Info</h2>
          <div className="key-info-item">
            <strong>Weight:</strong> 15 lbs
          </div>
          <div className="key-info-item">
            <strong>Age:</strong> 2 years
          </div>
          <div className="key-info-item">
            <strong>Vaccination Status:</strong> Up to date
          </div>
          <div className="key-info-item">
            <strong>Veterinarian/Clinic:</strong> ABC Vet Clinic
          </div>
          <div className="key-info-item">
            <strong>Allergies:</strong> None
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInfo;