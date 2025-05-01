import React from "react";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { useEffect } from "react";
import ProfilePopup from "./PetProfilePopup";
import DescPopup from "./taskDescPopup";
import { useNavigate } from "react-router-dom";
import "./DesktopPetProfile.css"
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from "../hosting/firebase";
import PetsIcon from "@mui/icons-material/Pets";
import { useParams } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

import { collection, addDoc, setDoc, doc, updateDoc, deleteDoc, getDocs, getDoc, query, where, serverTimestamp } from "firebase/firestore";
import { useUser } from "../context/UserContext";

import petImage1 from "../assets/images/dog_2.jpg";
import petImage2 from "../assets/images/dog_3.jpeg";
import petImage3 from "../assets/images/247c14e67e1d68913412f29d51559c3b.jpg";

const PetProfile = () => {
    const [taskList, setTaskList] = useState([]);

    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [selectedPetID, setSelectedPetID] = useState(null);
    const [savedPet, setSavedPet] = useState([]);


    const [wDay, setWDay] = useState("");

    const dayListener = (day) => {
        setWDay(day);
    };

    //Truong and I collaboarted with this page (used truongs code) we brainstromed with one another due to the simliarites of our pages (gather the same data)
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const updateUser = doc(db, "tasks", user.uid);

                await setDoc(updateUser, {}, { merge: true })

                const updatePetsCollection = collection(db, "pets");
                const updatePetsQuery = query(updatePetsCollection, where("ownerId", "==", user?.uid));
                const updatePetsDocs = await getDocs(updatePetsQuery);

                const updatedPetIds = [];
                for (const petDoc of updatePetsDocs.docs) {
                    const petId = petDoc.id;
                    updatedPetIds.push(petId);
                    console.log("petID: ", petId);

                    const newSaveDoc = doc(db, "tasks", user.uid, "pets", petId);
                    const existingPetDoc = await getDoc(newSaveDoc)

                    if (!existingPetDoc.exists()) {
                        await setDoc(newSaveDoc, { updatedPetIds }, { merge: true });
                    }
                }

                const petsCollection = collection(db, "tasks", user?.uid, "pets");
                const petsDocs = await getDocs(petsCollection);

                const petsList = [];
                for (const document of petsDocs.docs) {
                    const petData = document.data();
                    const petId = document.id;

                    const petsInfoDoc = await getDoc(doc(db, "pets", petId));

                    if (petsInfoDoc.exists()) {
                        const petInfo = petsInfoDoc.data();

                        console.log("PETINFO ID", petInfo.ownerId);
                        if (petInfo.ownerId === user?.uid) {
                            petsList.push({
                                id: petId,
                                ...petData,
                                ...petInfo,
                            });
                        }
                    }
                }

                setSavedPet(petsList);

                if (petsList.length > 0) {
                    console.log("PETSLIST MORE THAN 1")
                    setSelectedPetID(petsList[0].id);
                }
            } catch (error) {
                console.log("Fetch pet error: ", error);
            }
        }

        if (user?.uid) {
            fetchPets();
        }
    }, [user?.uid]);

    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                console.log("USER ID VALID FROM FETCH TASKS,", user?.uid, "PET ID VALID FROM FETCH TASKS,", selectedPetID);
                if (!user?.uid || !selectedPetID) {
                    return;
                }
                const tasksCollection = collection(db, "tasks", user?.uid, "pets", selectedPetID, "tasksList");
                const tasksDocs = await getDocs(tasksCollection);

                const tasksList = tasksDocs.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setTaskList(tasksList);
            } catch (error) {
                console.error("TASKS DID NOT GET LOADED CORRECTLY", error);
            }
        }
        fetchTasks();
    }, [user?.uid, selectedPetID]);


    /*THIS IS PRE Firestore const addTask = (taskType, taskName, taskDesc, whichDays) => { 
        setTaskList(taskList.concat({ taskName, taskDesc, whichDays }));
    };
    */
    const addTask = async (taskType, taskName, taskDesc, whichDays) => { //based off of group decided naming convention

        try {
            console.log("USER ID VALID FROM ADD TASK,", user?.uid, "PET ID VALID FROM ADD TASK,", selectedPetID);
            if (!user?.uid || !selectedPetID) {
                return;
            }

            const newTask = {
                title: taskName,
                description: taskDesc,
                type: taskType,
                weekdays: whichDays,
            };
            const taskDoc = await addDoc(collection(db, "tasks", user.uid, "pets", selectedPetID, "tasksList"), newTask);
            const updatedTask = {
                id: taskDoc.id,
                ...newTask,
            };
            setTaskList([...taskList, updatedTask]); //change this probably
        } catch (error) {
            console.error("TASK DID NOT GET ADDED CORRECTLY", error);
        }

    };


    /*This is PRE Firestore const removeTask = (taskToRemove) => {
        setTaskList(taskList.filter(task => task !== taskToRemove));
    } */


    const removeTask = async (taskToRemove) => {
        try {
            if (!user?.uid || !selectedPetID) {
                return;
            }
            const specDayTaskDelete = taskToRemove.weekdays.filter(day => day !== wDay);
            const taskDoc = doc(db, "tasks", user?.uid, "pets", selectedPetID, "tasksList", taskToRemove.id);
            if (specDayTaskDelete.length === 0) {
                await deleteDoc(taskDoc);
                setTaskList(taskList.filter(task => task.id !== taskToRemove.id));
            } else {
                await updateDoc(taskDoc, { weekdays: specDayTaskDelete });
                setTaskList(
                    taskList.map(task =>
                        task.id === taskToRemove.id
                            ? { ...task, weekdays: specDayTaskDelete }
                            : task
                    )
                );
            }

        } catch (error) {
            console.error("TASK DID NOT GET DELETED CORRECTLY", error);
        }
    };

    const { id: routePetId } = useParams(); 
    
    // Use selectedPetID for medical info instead of a separate activePetId
    // This fixes the issue of medical info not changing between pets
    
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
        healthOverview: "",
        upcomingAppointments: "",
        emergencyContacts: "",
        medicalHistory: "",
        weight: "",
        age: "",
        vaccinationStatus: "",
        veterinarian: "",
        allergies: ""
    });
    const [editedMedicalInfo, setEditedMedicalInfo] = useState({...medicalInfo});

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

    // When the medical info modal is opened, gets data for the currently selected pet
    const handleOpenMedicalModal = async () => {
        await fetchMedicalInfoForPet(selectedPetID);
        setShowMedicalModal(true);
    };

    // Function to fetch medical info for a specific pet
    const fetchMedicalInfoForPet = async (petId) => {
        if (!petId) {
            console.log("No pet ID provided for fetching medical info");
            return;
        }
        
        console.log("Fetching medical info for pet ID:", petId);
        setLoading(true);
        
        try {
            const petDocRef = doc(db, "pets", petId);
            const petDocSnap = await getDoc(petDocRef);
            
            if (petDocSnap.exists()) {
                const petData = {
                    id: petDocSnap.id,
                    ...petDocSnap.data()
                };
                console.log("Pet data fetched:", petData);
                setPet(petData);
                
                const medInfoDocRef = doc(db, "medinfo", petId);
                const medInfoDocSnap = await getDoc(medInfoDocRef);
                
                if (medInfoDocSnap.exists()) {
                    const medData = medInfoDocSnap.data();
                    console.log("Medical info fetched:", medData);
                    
                    const allergiesString = Array.isArray(medData.allergies) 
                        ? medData.allergies.join(", ")
                        : medData.allergies || "None";
                    
                    const newMedInfo = {
                        healthOverview: medData.healthOverview || "Your pet is generally healthy with no major concerns.",
                        upcomingAppointments: medData.upcomingAppointments || "No upcoming appointments scheduled.",
                        emergencyContacts: medData.emergency_contact || "Emergency Vet: (555) 123-4567",
                        medicalHistory: medData.history || "No medical history recorded.",
                        weight: medData.weight || "",
                        age: medData.age || "",
                        vaccinationStatus: medData.vaccinationStatus || "Unknown",
                        veterinarian: medData.clinic || "",
                        allergies: allergiesString
                    };
                    
                    setMedicalInfo(newMedInfo);
                    setEditedMedicalInfo(newMedInfo); // Also update edited info
                } else {
                    // Reset to default values if no medical info exists
                    const defaultMedInfo = {
                        healthOverview: "Your pet is generally healthy with no major concerns.",
                        upcomingAppointments: "No upcoming appointments scheduled.",
                        emergencyContacts: "Emergency Vet: (555) 123-4567",
                        medicalHistory: "No medical history recorded.",
                        weight: "",
                        age: "",
                        vaccinationStatus: "Unknown",
                        veterinarian: "",
                        allergies: "None"
                    };
                    
                    setMedicalInfo(defaultMedInfo);
                    setEditedMedicalInfo(defaultMedInfo);
                }
            } else {
                console.log("Pet not found in database for ID:", petId);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            showNotification("Error loading pet data", "error");
        } finally {
            setLoading(false);
        }
    };

    // When selectedPetID changes, fetch medical info if medical modal is open
    useEffect(() => {
        if (showMedicalModal && selectedPetID) {
            fetchMedicalInfoForPet(selectedPetID);
        }
    }, [selectedPetID, showMedicalModal]);

    const toggleMedicalEditMode = () => {
        console.log("Toggling medical edit mode, petId:", selectedPetID);
        if (isEditingMedical) {
            saveMedicalInfoToFirebase();
        } else {
            setEditedMedicalInfo({...medicalInfo});
        }
        setIsEditingMedical(!isEditingMedical);
    };

    // Save medical info to Firebase
    const saveMedicalInfoToFirebase = async () => {
        console.log("Attempting to save medical info for petId:", selectedPetID);
        if (!selectedPetID) {
            showNotification("No pet ID available for saving", "error");
            return;
        }

        setSavingMedical(true);
        try {
            const docRef = doc(db, "medinfo", selectedPetID);
            console.log("Using Firestore document reference:", docRef.path);
            const docSnap = await getDoc(docRef);
            
            const allergiesArray = editedMedicalInfo.allergies === "None" || !editedMedicalInfo.allergies
                ? []
                : editedMedicalInfo.allergies.split(",").map(a => a.trim());
            
            const dataToSave = {
                petId: selectedPetID, // Store the pet ID in the document for reference
                ownerId: user?.uid, // Store the owner ID for security
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

    // Handle pet selection - update selectedPetID and also reset medical info
    const handlePetSelection = (petId) => {
        setSelectedPetID(petId);
        
        // Reset medical info when changing pets to prevent showing previous pet's data
        setMedicalInfo({
            healthOverview: "",
            upcomingAppointments: "",
            emergencyContacts: "",
            medicalHistory: "",
            weight: "",
            age: "",
            vaccinationStatus: "",
            veterinarian: "",
            allergies: ""
        });
    };
 
    return (
        <div id="container">
            <div id="leftSideContainer">
                <div id="profileContainer">
                    <div id="profile">
                        <div id="petProfile">
                            <div>
                                <img src={savedPet.find(pet => pet.id === selectedPetID)?.picture} alt="myPet" />
                            </div>
                            <div id="petInfo">
                                <div id="petNameContainer"><h3>{savedPet.find(pet => pet.id === selectedPetID)?.name || "Pet Name"}</h3></div>
                                <div id="petSpeciesContainer"><h6>Species: {savedPet.find(pet => pet.id === selectedPetID)?.species || "Pet Species"}</h6></div>
                                <div id="petDescriptionContainer"><p>{savedPet.find(pet => pet.id === selectedPetID)?.description || "Pet Description"}</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="bottomRowContainer">
                    <div id="weeklySchedule">
                        <h3 id="weeklySchedHeader">Weekly Schedule</h3>
                        <div id="calenderButtons">
                            <div id="dateButtonContainer">
                                <button
                                    className={wDay === "Monday" ? "dateButton active" : "dateButton"}
                                    id="monday"
                                    onClick={() => dayListener("Monday")}>
                                    MON
                                </button>
                                <button
                                    className={wDay === "Tuesday" ? "dateButton active" : "dateButton"}
                                    id="tuesday"
                                    onClick={() => dayListener("Tuesday")}>
                                    TUE
                                </button>
                                <button
                                    className={wDay === "Wednesday" ? "dateButton active" : "dateButton"}
                                    id="wednesday"
                                    onClick={() => dayListener("Wednesday")}>
                                    WED
                                </button>
                                <button
                                    className={wDay === "Thursday" ? "dateButton active" : "dateButton"}
                                    id="thursday"
                                    onClick={() => dayListener("Thursday")}>
                                    THU
                                </button>
                                <button
                                    className={wDay === "Friday" ? "dateButton active" : "dateButton"}
                                    id="friday"
                                    onClick={() => dayListener("Friday")}>
                                    FRI
                                </button>
                                <button
                                    className={wDay === "Saturday" ? "dateButton active" : "dateButton"}
                                    id="saturday"
                                    onClick={() => dayListener("Saturday")}>
                                    SAT
                                </button>
                                <button
                                    className={wDay === "Sunday" ? "dateButton active" : "dateButton"}
                                    id="sunday"
                                    onClick={() => dayListener("Sunday")}>
                                    SUN
                                </button>
                            </div>
                        </div>

                        <h3>Daily Tasks</h3>
                        <div id="taskListContainer">
                            <ul className="listOfTasks">
                                {taskList
                                    .filter(task => task.weekdays.includes(wDay)) //changed based on firetstore update
                                    .map((task) => (
                                        <li key={task.id} className="taskItem">
                                            <div>
                                                <input type="checkbox" />
                                                {task.title}</div>
                                            <div className="descPopupContainer">
                                                <DescPopup task={task} />
                                            </div>
                                            <IconButton onClick={() => removeTask(task)} color="secondary"><DeleteIcon></DeleteIcon></IconButton>
                                        </li>
                                    ))}
                            </ul>

                        </div>

                    </div>
                </div>
            </div>


            <div id="rightSideContainer">
                <div className="otherPets">
                    {savedPet.map((pet) => (
                        <div className={`additional_pet ${pet.id === selectedPetID ? 'selected' : ''}`}
                            key={pet.id}
                            onClick={() => handlePetSelection(pet.id)} // Uses the new handler
                        >
                            <img src={pet.picture} className="additional_pet_img"></img>
                            <p className="additional_pet_name">{pet.name}</p>
                        </div>
                    ))}
                    <IconButton id="addPetBox" color="primary" aria-label="add pet" onClick={() => navigate("/petcenter")}><AddIcon /> </IconButton>

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
                                <p>Add to your pet's exercise schedule here! </p>
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
                            <IconButton id="medInfoButton" color="primary" aria-label="Go to Med Info" onClick={handleOpenMedicalModal}> <AddIcon /> </IconButton>
                        </div>
                    </div>
                </div>
            </div>
            {showMedicalModal && (
                <div className="medical-modal-overlay">
                    <div className="medical-modal">
                        <div className="medical-modal-header">
                            <h2>Medical Information for {savedPet.find(pet => pet.id === selectedPetID)?.name || "Pet"}</h2>
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
                Pet ID: {selectedPetID || "none"}
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
