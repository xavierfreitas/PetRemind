import React from "react";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import ProfilePopup from "./PetProfilePopup";
import DescPopup from "./taskDescPopup";
import { useNavigate } from "react-router-dom";
import "./DesktopPetProfile.css"

import petImage1 from "../assets/images/dog_2.jpg";
import petImage2 from "../assets/images/dog_3.jpeg";
import petImage3 from "../assets/images/247c14e67e1d68913412f29d51559c3b.jpg";

const PetProfile = () => {
    const [taskList, setTaskList] = useState([]);

    const navigate = useNavigate();

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
                    <img src={petImage2} alt="morePet" />
                    <img src={petImage3} alt="morePet" />
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
                        <button className="dateButton" id="goToMed" onClick={()=> navigate("/medicalInfo")}>+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PetProfile;