import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/DesktopPetCenter.css";
import PetsIcon from "@mui/icons-material/Pets";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import petCenterBackground from "../assets/images/petcenter_background.png";
import landingPageBackground from "../assets/images/landingpage_background.png";


const DesktopPetCenter = () => {
    const [petCount, setPetCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [petInfo, setPetInfo] = useState({
        picture: "",
        name: "",
        age: "",
        species: "",
    });
    const [petList, setPetList] = useState([]);

    // check if the form is complete (except for picture)
    const isFormComplete = petInfo.name && petInfo.age && petInfo.species

    // upon mount:
    useEffect(() => {
        // fetch pet count from localStorage and update state on component mount
        const storedPetCount = parseInt(localStorage.getItem("petCount") || "0");
        setPetCount(storedPetCount);

        // fetch pet list from localStorage and update state on component mount
        const storedPets = JSON.parse(localStorage.getItem("pets")) || [];
        setPetList(storedPets);

        // set PetCenter background
        document.body.style.backgroundImage = `url(${petCenterBackground})`;
    
        return () => {
            // unset PetCenter background
            document.body.style.backgroundImage = `url(${landingPageBackground})`;
        };
    }, []);

    // opening modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // closing the modal and clear prompts
    const handleClose = () => {
        setOpen(false);
        setPetInfo({ picture: "", name: "", age: "", type: "" });
    };

    // handle modal user input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    // add pet function
    const handleAddPet = () => {
        const newPet = { ...petInfo }; // create a new pet object
        const updatedPets = [...petList, newPet]; // add new pet to list
        const newPetCount = updatedPets.length; // update count with new list
        
        setPetList(updatedPets);
        setPetCount(newPetCount);
        localStorage.setItem("pets", JSON.stringify(updatedPets));
        localStorage.setItem("petCount", newPetCount.toString());
        
        handleClose();
    };

    // delete pet function
    const handleDeletePet = (index) => {
        const updatedPets = petList.filter((_, i) => i !== index); // remove pet by index
        setPetList(updatedPets);
        setPetCount(updatedPets.length);
        localStorage.setItem("pets", JSON.stringify(updatedPets)); // save updated list
    };

    // picture selection function
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // get first selected file
        if (file) {
            const imageUrl = URL.createObjectURL(file); // create a URL for the selected image
            setPetInfo((prevInfo) => ({
                ...prevInfo,
                picture: imageUrl, // update state with image URL
            }));
        }
    };

    return (
        <div className="petcenter-container container-fluid">
            <div className="headers">
                {petCount === 0 ? (
                    <h1 className="title">
                        <span>Oh no! </span>It looks like you don't have a pet registered with us.
                    </h1>
                ) : (
                    <h1 className="title">Your Pets:</h1>
                )}
            </div>

            <div className="content">
                {petCount === 0 ? (
                    <p>Add a pet to start keeping track of their needs!</p>
                ) : (
                    <div className="pet-list">
                        {petList.map((pet, index) => (
                            <div key={index} className="pet-card">
                                {/* delete button */}
                                <HighlightOffIcon className="delete-pet" onClick={() => handleDeletePet(index)}></HighlightOffIcon>
                                {pet.picture ? (
                                    <img src={pet.picture} alt={pet.name} className="pet-icon" />
                                ) : (
                                    <PetsIcon className="pet-icon" /> /* if no pet icon is chosen */
                                )}
                                <p id="petcard_petname">{pet.name}</p>
                                <p id="petcard_petage">({pet.age} yrs)</p>
                            </div>
                        ))}
                    </div>
                )}
                <AddCircleOutlineIcon 
                    className="add-pet-icon"
                    onClick={handleClickOpen}
                />
            </div>

            {/* modal for adding pets */}
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-paper": { // modal styling
                        backgroundColor: "#ffffff",
                        borderRadius: "15px", // rounded corners
                        padding: "20px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // slight shadow
                        maxWidth: "500px", // max width for the modal
                        justifyContent: "center",
                        alignItems: "center",
                    }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 'bold', fontSize: "2rem", textAlign: 'center' }}>
                    Add a Pet
                </DialogTitle>
                <DialogContent sx={{ padding: "10px 0" }}>
                    <input
                        type="file"
                        accept="image/*" // only accept images
                        onChange={handleImageChange}
                        style={{ display: "none" }} // hide file input
                        id="pet-image-upload"
                    />
                    <label htmlFor="pet-image-upload" id="petimgselect-button">
                        <Button variant="contained" color="primary" component="span" fullWidth>
                            Select Pet Picture
                        </Button>
                    </label>
                    {petInfo.picture && (
                        <div className="image-preview" id="img-prev">
                            <img src={petInfo.picture} alt="Pet Preview"/>
                        </div>
                    )}
                    <TextField
                        label="Pet Name"
                        name="name"
                        value={petInfo.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Pet Age (years)"
                        name="age"
                        value={petInfo.age}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        type="number"
                        required
                    />
                    <TextField
                        label="Pet Species"
                        name="species"
                        value={petInfo.species}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button 
                        onClick={handleClose} 
                        color="primary" 
                        sx={{ padding: "10px 20px" }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAddPet} 
                        color="primary" 
                        sx={{ padding: "10px 20px" }} 
                        disabled={!isFormComplete}
                    >
                        Add Pet
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default DesktopPetCenter;