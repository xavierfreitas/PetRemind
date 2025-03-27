import React, { useState } from "react";
import "../assets/styles/DesktopMedicalInfo.css";
import { useNavigate } from "react-router-dom";

const DesktopMedicalInfo = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [petInfo, setPetInfo] = useState({
    healthOverview: "Your pet is generally healthy with no major concerns.",
    upcomingAppointments: "Annual checkup on May 15, 2025",
    emergencyContacts: "Emergency Vet: (555) 123-4567",
    medicalHistory: "Vaccinations up to date. Minor surgery in 2023.",
    weight: "10.7 Lbs",
    age: "7",
    vaccinationStatus: "Up to date",
    veterinarian: "Dr. Cahill",
    allergies: "None"
  });
  
  const [editedInfo, setEditedInfo] = useState({...petInfo});
  const toggleEditMode = () => {
    if (isEditing) {
      setPetInfo({...editedInfo});
    } else {
      setEditedInfo({...petInfo});
    }
    setIsEditing(!isEditing);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSetRemindersClick = () => {
    navigate("/reminder");
  };
  
  return (
    <div className="medical-page-container">
      <h1 className="medical-title">Medical Information</h1>
      <div className="medical-content">
        <div className="left-column">
          <div className="edit-buttons">
            <button className="edit-info-btn" onClick={toggleEditMode}>
              {isEditing ? "Save Info" : "Edit Info"}
            </button>
            {!isEditing && <button className="edit-icon" onClick={toggleEditMode}>✏️</button>}
          </div>

          <div className="info-section">
            <div className="info-icon">❤️</div>
            <div className="info-label">Health Overview:</div>
            {isEditing ? (
              <textarea
                name="healthOverview"
                value={editedInfo.healthOverview}
                onChange={handleChange}
                className="edit-textarea"
              />
            ) : (
              <div className="info-value">{petInfo.healthOverview}</div>
            )}
          </div>

          <div className="info-section">
            <div className="info-icon">🕒</div>
            <div className="info-label">Upcoming Appointments:</div>
            {isEditing ? (
              <textarea
                name="upcomingAppointments"
                value={editedInfo.upcomingAppointments}
                onChange={handleChange}
                className="edit-textarea"
              />
            ) : (
              <div className="info-value">{petInfo.upcomingAppointments}</div>
            )}
          </div>

          <div className="info-section">
            <div className="info-icon">📞</div>
            <div className="info-label">Emergency Contacts:</div>
            {isEditing ? (
              <textarea
                name="emergencyContacts"
                value={editedInfo.emergencyContacts}
                onChange={handleChange}
                className="edit-textarea"
              />
            ) : (
              <div className="info-value">{petInfo.emergencyContacts}</div>
            )}
          </div>

          <div className="info-section">
            <div className="info-icon">📋</div>
            <div className="info-label">Medical History:</div>
            {isEditing ? (
              <textarea
                name="medicalHistory"
                value={editedInfo.medicalHistory}
                onChange={handleChange}
                className="edit-textarea"
              />
            ) : (
              <div className="info-value">{petInfo.medicalHistory}</div>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className="key-info-item">
            {isEditing ? (
              <input
                type="text"
                name="weight"
                value={editedInfo.weight}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <div className="key-info-text">Weight: {petInfo.weight}</div>
            )}
            <span className="dropdown-arrow">▼</span>
          </div>
          
          <div className="key-info-item">
            {isEditing ? (
              <input
                type="text"
                name="age"
                value={editedInfo.age}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <div className="key-info-text">Age: {petInfo.age}</div>
            )}
            <span className="dropdown-arrow">▼</span>
          </div>
          
          <div className="key-info-item">
            {isEditing ? (
              <input
                type="text"
                name="vaccinationStatus"
                value={editedInfo.vaccinationStatus}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <div className="key-info-text">Vaccination Status: {petInfo.vaccinationStatus}</div>
            )}
            <span className="dropdown-arrow">▼</span>
          </div>
          
          <div className="key-info-item">
            {isEditing ? (
              <input
                type="text"
                name="veterinarian"
                value={editedInfo.veterinarian}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <div className="key-info-text">Veterinarian/Clinic: {petInfo.veterinarian}</div>
            )}
            <span className="dropdown-arrow">▼</span>
          </div>
          
          <div className="key-info-item">
            {isEditing ? (
              <input
                type="text"
                name="allergies"
                value={editedInfo.allergies}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <div className="key-info-text">Allergies: {petInfo.allergies}</div>
            )}
            <span className="dropdown-arrow">▼</span>
          </div>
          
          <div className="reminders-section">
            <button className="set-reminders-btn" onClick={handleSetRemindersClick}>
              Set Reminders
            </button>
            <span className="bell-icon">🔔</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopMedicalInfo;