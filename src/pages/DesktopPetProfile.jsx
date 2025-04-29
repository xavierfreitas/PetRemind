import React from "react";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { useEffect } from "react";
import ProfilePopup from "./PetProfilePopup";
import DescPopup from "./taskDescPopup";
import { useNavigate, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./DesktopPetProfile.css"
import DeleteIcon from '@mui/icons-material/Delete';
import { firestore } from "../firebase";
import { collection, doc, getDocs, addDoc, deleteDoc } from "firebase/firestore";


import petImage1 from "../assets/images/dog_2.jpg";
import petImage2 from "../assets/images/dog_3.jpeg";
import petImage3 from "../assets/images/247c14e67e1d68913412f29d51559c3b.jpg";

const PetProfile = () => {
    const { user, loading } = useUser(); // get user from context, get loading state too
    
    // if loading show a loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // if user is not logged in, redirect to landing page
    if (!user) {
        return <Navigate to="/" />;
    }
    
    const [taskList, setTaskList] = useState([]);

    const navigate = useNavigate();

    const [wDay, setWDay] = useState("");

    const dayListener = (day) => {
        setWDay(day);
    };

    useEffect(() => {
        getExistingTasks();
    }, []);

    const getExistingTasks = async () => { //Completed with help
        try {
            const getTasks = collection(firestore, "tasks");
            const taskSnapshot = await getDocs(getTasks);
            const taskList = taskSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setTaskList(taskList);
        } catch (error) {
            console.error("TASKS DID NOT GET LOADED CORRECTLY", error);
        }
    };
    /*THIS IS PRE Firestore const addTask = (taskType, taskName, taskDesc, whichDays) => { 
        setTaskList(taskList.concat({ taskName, taskDesc, whichDays }));
    };
    */
    const addTask = async (taskType, taskName, taskDesc, whichDays) => { //based off of group decided naming convention
        const newTask = {
            title: taskName,
            description: taskDesc,
            type: taskType,
            weekdays: whichDays,
            userID: "testerID",
            petId: "testerPetID",
        };

        try {
            const addedDoc = await addDoc(collection(firestore, "tasks"), newTask);
            const taskWithId = { ...newTask, id: addedDoc.id };
            setTaskList(taskList.concat(taskWithId));
        } catch (error) {
            console.error("TASK DID NOT GET ADDED CORRECTLY", error);
        }

    };


    /*This is PRE Firestore const removeTask = (taskToRemove) => {
        setTaskList(taskList.filter(task => task !== taskToRemove));
    } */

    const removeTask = async (taskToRemove) => {
        try {
            const taskDoc = doc(firestore, "tasks", taskToRemove.id);
            await deleteDoc(taskDoc);
            setTaskList(taskList.filter(task => task.id !== taskToRemove.id));
        } catch (error) {
            console.error("TASK DID NOT GET DELETED CORRECTLY", error);
        }
    };

    return (
        <div id="container">
            <div id="rightSideContainer">
                <div id="profileContainer">
                    <div id="profile">
                        <div id="petProfile">
                            <div>
                                <img src={petImage1} alt="myPet" />
                            </div>
                            <div id="petInfo">
                                <div id="petNameContainer"><h2>Name of Pet</h2></div>
                                <div id="petDescriptionContainer"><p>PUT ADDITIONAL INFORMATION ABOUT PETS HERE</p></div>
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
                                    .map((task, index) => (
                                        <li key={index} className="taskItem">
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


            <div id="leftSideContainer">
                <div className="otherPets">
                    <img src={petImage2} alt="morePet" />
                    <img src={petImage3} alt="morePet" />
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
                            <button className="dateButton" id="goToMed" onClick={() => navigate("/medicalInfo")}>+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PetProfile;