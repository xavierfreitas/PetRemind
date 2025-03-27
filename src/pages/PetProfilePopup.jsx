import React from "react";
import { useState } from "react";
import "./DesktopPetProfile.css";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ProfilePopup = ({ addTask, taskType }) => {

    //closed by default
    const [open, setOpen] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };

    //When cancel is clicked (or dialog box closed from clicking somwhere not in dialog box) close the dialog box / form and reset the task name and task description
    const handleClose = () => {
        setOpen(false);
        setTaskName("");
        setTaskDesc("");
    };

    //adds task to the list / map
    const submitNewTask = () => {
        if (taskName && taskDesc) {
            addTask(taskType, taskName, taskDesc);
            handleClose();
        }
    };
    return (
        //Link used to figure out how to create dialog box
        //https://mui.com/material-ui/react-dialog/?srsltid=AfmBOooV0-npiKT5Ltc-owK0Wj_irXp39L0u2M0MdwTj-tV2WnMDG-Ps
        //Dialog button appears when add task is clicked so that the user can input their task name as well as task description. (takes in the task type from the button selected)
        <React.Fragment>
            <Button id="openAddTaskButton" onClick={handleOpen}>Add Task</Button>
            <Dialog id="askingQuestionDialog" open={open} onClose={handleClose}>
                <DialogTitle>Add a {taskType} Task</DialogTitle>
                <DialogContent>
                    <div id="textFieldContainer">
                    {/*field for user to enter task name */}
                    <div>
                    <TextField
                        label="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    </div>
                    {/*field for user to enter their task description*/}
                    <div id="descriptionTextField">
                    <TextField
                        label="Task Description"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        fullWidth
                        variant="outlined"
                        multiline
                        minRows={5}
                    />
                    </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button id="cancelButton" onClick={handleClose}>Cancel</Button>
                    <Button id="subTaskButton"onClick={submitNewTask}>Add Task</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default ProfilePopup;