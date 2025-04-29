import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ProfilePopup from "./PetProfilePopup";
import DescPopup from "./taskDescPopup";
import { useNavigate, useParams } from "react-router-dom";
import "./DesktopPetProfile.css";
import { db } from "../firebase/config";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

const PetProfile = () => {
    // Get petId from route parameters
    const { id: routePetId } = useParams(); 
    
    const [activePetId, setActivePetId] = useState(routePetId || localStorage.getItem("selectedPetId") || "test-pet-1");
    
    const [taskList, setTaskList] = useState([]);
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [savingMedical, setSavingMedical] = useState(false);
    
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const [showMedicalModal, setShowMedicalModal] = useState(false);
    const [isEditingMedical, setIsEditingMedical] = useState(false);
    const [medicalInfo, setMedicalInfo] = useState({
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
    const [editedMedicalInfo, setEditedMedicalInfo] = useState({...medicalInfo});

    useEffect(() => {
        if (routePetId) {
            setActivePetId(routePetId);
            localStorage.setItem("selectedPetId", routePetId);
        }
    }, [routePetId]);
    
    console.log("PetProfile rendered with petId:", activePetId);

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };
    
    const handleCloseNotification = () => {
        setNotification({...notification, open: false});
    };

    useEffect(() => {
        const fetchPetData = async () => {
            if (!activePetId) {
                console.log("No petId available, using default data");
                return;
            }
            
            console.log("Fetching data for petId:", activePetId);
            setLoading(true);
            try {
                const petDocRef = doc(db, "pets", activePetId);
                const petDocSnap = await getDoc(petDocRef);
                
                if (petDocSnap.exists()) {
                    const petData = {
                        id: petDocSnap.id,
                        ...petDocSnap.data()
                    };
                    console.log("Pet data fetched:", petData);
                    setPet(petData);
                    
                    const medInfoDocRef = doc(db, "medinfo", activePetId);
                    const medInfoDocSnap = await getDoc(medInfoDocRef);
                    
                    if (medInfoDocSnap.exists()) {
                        const medData = medInfoDocSnap.data();
                        console.log("Medical info fetched:", medData);
                        
                        const allergiesString = Array.isArray(medData.allergies) 
                            ? medData.allergies.join(", ")
                            : medData.allergies || "None";
                        
                        setMedicalInfo({
                            healthOverview: medData.healthOverview || "Your pet is generally healthy with no major concerns.",
                            upcomingAppointments: medData.upcomingAppointments || "No upcoming appointments scheduled.",
                            emergencyContacts: medData.emergency_contact || "Emergency Vet: (555) 123-4567",
                            medicalHistory: medData.history || "No medical history recorded.",
                            weight: medData.weight || "",
                            age: medData.age || "",
                            vaccinationStatus: medData.vaccinationStatus || "Unknown",
                            veterinarian: medData.clinic || "",
                            allergies: allergiesString
                        });
                    }
                } else {
                    console.log("Pet not found in database for ID:", activePetId);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification("Error loading pet data", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
    }, [activePetId]);

    const toggleMedicalEditMode = () => {
        console.log("Toggling medical edit mode, petId:", activePetId);
        if (isEditingMedical) {
            saveMedicalInfoToFirebase();
        } else {
            setEditedMedicalInfo({...medicalInfo});
        }
        setIsEditingMedical(!isEditingMedical);
    };

    // Save medical info to Firebase
    const saveMedicalInfoToFirebase = async () => {
        console.log("Attempting to save medical info for petId:", activePetId);
        if (!activePetId) {
            showNotification("No pet ID available for saving", "error");
            return;
        }

        setSavingMedical(true);
        try {
            const docRef = doc(db, "medinfo", activePetId);
            console.log("Using Firestore document reference:", docRef.path);
            const docSnap = await getDoc(docRef);
            
            const allergiesArray = editedMedicalInfo.allergies === "None" || !editedMedicalInfo.allergies
                ? []
                : editedMedicalInfo.allergies.split(",").map(a => a.trim());
            
            const dataToSave = {
                healthOverview: editedMedicalInfo.healthOverview || "",
                upcomingAppointments: editedMedicalInfo.upcomingAppointments || "",
                emergency_contact: editedMedicalInfo.emergencyContacts || "",
                history: editedMedicalInfo.medicalHistory || "",
                weight: editedMedicalInfo.weight || "",
                age: editedMedicalInfo.age || "",
                vaccinationStatus: editedMedicalInfo.vaccinationStatus || "",
                clinic: editedMedicalInfo.veterinarian || "",
                allergies: allergiesArray,
                updated_at: serverTimestamp()
            };
            
            console.log("Data being saved to Firestore:", dataToSave);
            
            if (docSnap.exists()) {
                await updateDoc(docRef, dataToSave);
                console.log("Document updated successfully");
            } else {
                await setDoc(docRef, {
                    ...dataToSave,
                    created_at: serverTimestamp()
                });
                console.log("New document created successfully");
            }
            
            setMedicalInfo({...editedMedicalInfo});
            showNotification("Medical information saved successfully", "success");
        } catch (error) {
            console.error("Error saving medical info:", error);
            showNotification("Error saving medical information", "error");
        } finally {
            setSavingMedical(false);
        }
    };

    // Handle medical info input changes
    const handleMedicalChange = (e) => {
        const { name, value } = e.target;
        setEditedMedicalInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addTask = (taskType, taskName, taskDesc) => {
        setTaskList(taskList.concat({ taskName, taskDesc }));
    };

    return (
        <div id="container">
            <div id="rightSideContainer">
                <div id="profileContainer">
                    <div id="profile">
                        <div id="petProfile">
                            <div>
                                {pet && pet.picture ? (
                                    <img src={pet.picture} alt={pet.name} />
                                ) : (
                                    <img src="./src/assets/images/dog_2.jpg" alt="myPet" />
                                )}
                            </div>
                            <div id="petInfo">
                                <div id="petNameContainer">
                                    <h2>{pet ? pet.name : "Name of Pet"}</h2>
                                </div>
                                <div id="petDescriptionContainer">
                                    <p>{pet ? `${pet.type || 'Pet'}, ${pet.age || ''} years old` : "PUT ADDITIONAL INFORMATION ABOUT PETS HERE"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="bottomRowContainer">
                    <div id="weeklySchedule">
                        <h3 id="weeklySchedHeader">Weekly Schedule</h3>
                        <div id="calenderButtons">
                            <div id="dateButtonContainer">
                                <button className="dateButton" id="monday">MON</button>
                                <button className="dateButton" id="tuesday">TUE</button>
                                <button className="dateButton" id="wednesday">WED</button>
                                <button className="dateButton"id="thursday">THU</button>
                                <button className="dateButton" id="friday">FRI</button>
                                <button className="dateButton" id="saturday">SAT</button>
                                <button className="dateButton" id="sunday">SUN</button>
                            </div>
                        </div>
                        
                        <h3>Daily Tasks</h3>
                        <div id="taskListContainer">
                            <ul className="listOfTasks">
                                {taskList.map((task, index) => (
                                    <li key={index} className="taskItem">
                                        <div>
                                            <input type="checkbox" />
                                            {task.taskName}</div>
                                        <div className="descPopupContainer">
                                            <DescPopup task={task} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div id="leftSideContainer">
                <div className="otherPets">
                    <img src="./src/assets/images/dog_3.jpeg" alt="morePet" />
                    <img src="./src/assets/images/247c14e67e1d68913412f29d51559c3b.jpg" alt="morePet" />
                    <IconButton id="addPetBox" color="primary" aria-label="add pet" onClick={()=> navigate("/petcenter")}><AddIcon /> </IconButton>
                    
                </div>
                <h3 id="petCareHeader">Pet Care</h3>
                <div id="petCare">
                    <div id="feedingSched" className="taskBoxes">
                        <div>
                        <h3>Feeding Schedule</h3>
                        <div className="taskBoxDescription">
                        <p>Add to your pet's feeding schedule here! </p>
                        </div>
                        </div>
                        <div className="addTaskContainer">
                             <ProfilePopup addTask={addTask} taskType="Feeding" />
                             </div>
                    </div>
                    <div id="exerciseSched" className="taskBoxes">
                        <div>
                        <h3>Exercise Schedule</h3>
                        <div className="taskBoxDescription">
                        <p>Add to your pet's enrichment and exercise schedule here! </p>
                        </div>
                        </div>
                        <div className="addTaskContainer">
                            <ProfilePopup addTask={addTask} taskType="Exercise" />
                            </div>

                    </div>
                    <div id="medicalSched" className="taskBoxes">
                        <div>
                        <h3>Medical Schedule</h3>
                        <div className="taskBoxDescription">
                        <p>Add to your pet's medical schedule here! </p>
                        </div>
                        </div>
                        <div className="addTaskContainer">
                            <ProfilePopup addTask={addTask} taskType="Medical" />
                            </div>
                    </div>
                    <div id="groomingSched" className="taskBoxes">
                        <div>
                        <h3>Grooming Schedule</h3>
                        <div className="taskBoxDescription">
                        <p>Add to your pet's grooming schedule here! </p>
                        </div>
                        </div>
                        <div className="addTaskContainer">
                            <ProfilePopup addTask={addTask} taskType="Grooming" />
                            </div>
                    </div>
                    <div id="medicalInfo" className="taskBoxes">
                        <div>
                        <h3>Medical Information</h3>
                        <div className="taskBoxDescription">
                        <p>Here you can view any important medical information</p>
                        </div>
                        </div>
                        <div className="addTaskContainer">
                            <button className="dateButton" id="goToMed" onClick={() => setShowMedicalModal(true)}>View</button>
                        </div>
                    </div>
                </div>
            </div>

            {showMedicalModal && (
                <div className="medical-modal-overlay">
                    <div className="medical-modal">
                        <div className="medical-modal-header">
                            <h2>Medical Information</h2>
                            <button 
                                className="close-modal-btn" 
                                onClick={() => setShowMedicalModal(false)}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        
                        <div className="medical-modal-content">
                            {loading ? (
                                <div className="loading-container">
                                    <CircularProgress size={40} />
                                    <p>Loading medical information...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="edit-buttons">
                                        <button 
                                            className="edit-info-btn" 
                                            onClick={toggleMedicalEditMode}
                                            disabled={savingMedical}
                                        >
                                            {savingMedical ? (
                                                <>
                                                    <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
                                                    Saving...
                                                </>
                                            ) : (
                                                isEditingMedical ? "Save Info" : "Edit Info"
                                            )}
                                        </button>
                                    </div>
                                    
                                    <div className="medical-content">
                                        <div className="medical-left-column">
                                            <div className="info-section">
                                                <div className="info-label">Health Overview:</div>
                                                {isEditingMedical ? (
                                                    <textarea
                                                        name="healthOverview"
                                                        value={editedMedicalInfo.healthOverview}
                                                        onChange={handleMedicalChange}
                                                        className="edit-textarea"
                                                    />
                                                ) : (
                                                    <div className="info-value">{medicalInfo.healthOverview}</div>
                                                )}
                                            </div>

                                            <div className="info-section">
                                                <div className="info-label">Upcoming Appointments:</div>
                                                {isEditingMedical ? (
                                                    <textarea
                                                        name="upcomingAppointments"
                                                        value={editedMedicalInfo.upcomingAppointments}
                                                        onChange={handleMedicalChange}
                                                        className="edit-textarea"
                                                    />
                                                ) : (
                                                    <div className="info-value">{medicalInfo.upcomingAppointments}</div>
                                                )}
                                            </div>

                                            <div className="info-section">
                                                <div className="info-label">Emergency Contacts:</div>
                                                {isEditingMedical ? (
                                                    <textarea
                                                        name="emergencyContacts"
                                                        value={editedMedicalInfo.emergencyContacts}
                                                        onChange={handleMedicalChange}
                                                        className="edit-textarea"
                                                    />
                                                ) : (
                                                    <div className="info-value">{medicalInfo.emergencyContacts}</div>
                                                )}
                                            </div>

                                            <div className="info-section">
                                                <div className="info-label">Medical History:</div>
                                                {isEditingMedical ? (
                                                    <textarea
                                                        name="medicalHistory"
                                                        value={editedMedicalInfo.medicalHistory}
                                                        onChange={handleMedicalChange}
                                                        className="edit-textarea"
                                                    />
                                                ) : (
                                                    <div className="info-value">{medicalInfo.medicalHistory}</div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Right Side - Key Info */}
                                        <div className="medical-right-column">
                                            <h3>Key Info</h3>
                                            
                                            <div className="key-info-item">
                                                {isEditingMedical ? (
                                                    <div className="edit-key-info">
                                                        <label>Weight:</label>
                                                        <input
                                                            type="text"
                                                            name="weight"
                                                            value={editedMedicalInfo.weight}
                                                            onChange={handleMedicalChange}
                                                            className="edit-input"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="key-info-text">Weight: {medicalInfo.weight}</div>
                                                )}
                                            </div>
                                            
                                            <div className="key-info-item">
                                                {isEditingMedical ? (
                                                    <div className="edit-key-info">
                                                        <label>Age:</label>
                                                        <input
                                                            type="text"
                                                            name="age"
                                                            value={editedMedicalInfo.age}
                                                            onChange={handleMedicalChange}
                                                            className="edit-input"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="key-info-text">Age: {medicalInfo.age}</div>
                                                )}
                                            </div>
                                            
                                            <div className="key-info-item">
                                                {isEditingMedical ? (
                                                    <div className="edit-key-info">
                                                        <label>Vaccination Status:</label>
                                                        <input
                                                            type="text"
                                                            name="vaccinationStatus"
                                                            value={editedMedicalInfo.vaccinationStatus}
                                                            onChange={handleMedicalChange}
                                                            className="edit-input"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="key-info-text">Vaccination Status: {medicalInfo.vaccinationStatus}</div>
                                                )}
                                            </div>
                                            
                                            <div className="key-info-item">
                                                {isEditingMedical ? (
                                                    <div className="edit-key-info">
                                                        <label>Veterinarian/Clinic:</label>
                                                        <input
                                                            type="text"
                                                            name="veterinarian"
                                                            value={editedMedicalInfo.veterinarian}
                                                            onChange={handleMedicalChange}
                                                            className="edit-input"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="key-info-text">Veterinarian/Clinic: {medicalInfo.veterinarian}</div>
                                                )}
                                            </div>
                                            
                                            <div className="key-info-item">
                                                {isEditingMedical ? (
                                                    <div className="edit-key-info">
                                                        <label>Allergies:</label>
                                                        <input
                                                            type="text"
                                                            name="allergies"
                                                            value={editedMedicalInfo.allergies}
                                                            onChange={handleMedicalChange}
                                                            className="edit-input"
                                                            placeholder="Enter allergies, comma separated"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="key-info-text">Allergies: {medicalInfo.allergies}</div>
                                                )}
                                            </div>
                                            
                                            <button className="set-reminders-btn" onClick={() => navigate("/reminder")}>
                                                Set Reminders 🔔
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: '#f1f1f1', padding: '8px', borderRadius: '4px', fontSize: '12px', opacity: 0.8 }}>
                Pet ID: {activePetId || "none"}
            </div>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default PetProfile;