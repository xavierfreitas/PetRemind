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
import { collection, addDoc, setDoc, doc, updateDoc, deleteDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import { useUser } from "../context/UserContext";


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

    return (
        <div id="container">
            <div id="leftSideContainer">
                <div id="profileContainer">
                    <div id="profile">
                        <div id="petProfile">
                            <div>
                                {savedPet.find(pet => pet.id === selectedPetID)?.picture ? (
                                    <img src={savedPet.find(pet => pet.id === selectedPetID)?.picture}
                                        alt="myPet"></img>
                                ) : (
                                    <PetsIcon id="pet_profile_img" />
                                )}
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
                            onClick={() => setSelectedPetID(pet.id)}
                        >
                            {pet.picture ? (
                                <img src={pet.picture} className="additional_pet_img"></img>
                            ) : (
                                <PetsIcon className="additional_pet_img" />
                            )}
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
                            <IconButton id="medInfoButton" color="primary" aria-label="Go to Med Info" onClick={() => navigate("/medicalinfo")}> <AddIcon /> </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PetProfile;