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


const DescPopup = ({ task }) => {
    //closed by default
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        //Link used to figure out how to create dialog box
        //https://mui.com/material-ui/react-dialog/?srsltid=AfmBOooV0-npiKT5Ltc-owK0Wj_irXp39L0u2M0MdwTj-tV2WnMDG-Ps
        //Popup used to display the task description whilst the name of the task is displayed in the list so that it is less cluttered
        <React.Fragment>
            <Button id="openMoreInfoButton" onClick={handleOpen}>More Info</Button>
            <Dialog id="taskDescriptionDialog"open={open} onClose={handleClose}>
                {/* Show the task name and the the corresponding description for aforementioned task */}
                <DialogTitle>{task.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{task.description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button id="closeButton" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default DescPopup;