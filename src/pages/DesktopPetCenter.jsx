import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/DesktopPetCenter.css";

import PetsIcon from "@mui/icons-material/Pets";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem } from "@mui/material";

import { db } from "../hosting/firebase";
import { doc, getDoc, setDoc, collection, updateDoc, arrayUnion, serverTimestamp, arrayRemove, deleteDoc } from "firebase/firestore";


const DesktopPetCenter = () => {
    const MAX_PETS = 5;
    const navigate = useNavigate();
    const { user, loading } = useUser(); // get user from context, get loading state too

    // state variables
    const [petCount, setPetCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [petInfo, setPetInfo] = useState({
        picture: "",
        name: "",
        age: "",
        species: "",
        description: "",
    });
    const [petList, setPetList] = useState([]);

    // different options for pet species
    const speciesOptions = [
        "Bird",
        "Cat",
        "Dog",
        "Ferret",
        "Fish",
        "Frog",
        "Guinea Pig",
        "Hamster",
        "Hedgehog",
        "Horse",
        "Lizard",
        "Mouse",
        "Rabbit",
        "Snake",
        "Tarantula",
        "Tortoise",
        "Turtle",
        "Other"
    ];

    // check if modal form is complete (except for picture + description)
    const isFormComplete = petInfo.name && petInfo.age && petInfo.species

    // upon mount:
    useEffect(() => {
        if (!user?.uid) return;

        const loadPetsFromFirestore = async () => {
            try {
                // get user's doc
                const userRef  = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) return;

                const { petIDs = [] } = userSnap.data();

                // fetch each pet by ID
                const petDocs = await Promise.all(
                    petIDs.map(id => getDoc(doc(db, "pets", id)))
                );

                // build pet array
                const pets = petDocs
                    .filter(snap => snap.exists())
                    .map(snap => ({ id: snap.id, ...snap.data() }));

                // set state
                setPetList(pets);
                setPetCount(pets.length);

                // sync back to localStorage
                localStorage.setItem("pets", JSON.stringify(pets));
                localStorage.setItem("petCount", String(pets.length));
            } catch (err) {
                console.error("Failed to load pets:", err);
            }
        };

        loadPetsFromFirestore();
    }, [user]);

    // if loading show a loading message
    if (loading) { return <div>Loading...</div>; }

    // if user is not logged in, redirect to landing page
    if (!user) { return <Navigate to="/" />; }

    // opening modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // closing the modal and clear prompts
    const handleClose = () => {
        setOpen(false);
        setPetInfo({ picture: "", name: "", age: "", species: "", description: "" });
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
    const handleAddPet = async () => {
        if (petList.length >= MAX_PETS) {
            alert(`You can only have up to ${MAX_PETS} pets.`);
            return;
        }

        try {
            // create new pet document in Firestore
            const petsCol = collection(db, "pets");
            const newPetRef = doc(petsCol);  // auto-ID
            const petPayload = {
            ...petInfo,
            ownerId:   user.uid,
            createdAt: serverTimestamp()
            };

            await setDoc(newPetRef, petPayload);

            // update user's petIDs array in Firestore
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                petIDs: arrayUnion(newPetRef.id)
            });

            // update local state and localStorage
            const newEntry = { id: newPetRef.id, ...petPayload };
            const updated = [...petList, newEntry];
            const newPetCount = updated.length;

            setPetList(updated);
            setPetCount(newPetCount);
            localStorage.setItem("pets", JSON.stringify(updated));
            localStorage.setItem("petCount", newPetCount.toString());
        } catch (err) {
            console.error("Error adding pet: ", err);
            alert("Something went wrong. Please try again.");
        } finally {
            // close modal
            handleClose();
        }
    };

    // delete pet function
    const handleDeletePet = async (index) => {
        // check if user REALLY wants to delete pet
        const petName = petList[index]?.name || "this pet";
        if (!window.confirm(`Are you sure you want to delete ${petName}?`)) {
            return; // user cancelled
        }

        // get the petID from the petList
        const petToDelete = petList[index];
        const petId = petToDelete.id;

        try {
            // remove petID from user's petIDs array
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
            petIDs: arrayRemove(petId),
            });

            // delete pet's own doc
            const petRef = doc(db, "pets", petId);
            await deleteDoc(petRef);

            // update local state and localStorage
            const updated = petList.filter((_, i) => i !== index);
            setPetList(updated);
            setPetCount(updated.length);
            localStorage.setItem("pets", JSON.stringify(updated));
            localStorage.setItem("petCount", String(updated.length));
        } catch (err) {
            console.error("Error deleting pet:", err);
            alert("Could not delete pet. Please try again.");
        }
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
        <div className="petcenter-container container-fluid col-8 justify-content-center">
            <div id={petCount === 0 ? "no-pets" : "pets-exist"}>
                <div className="headers">
                    {petCount === 0 ? (
                        <h1 className="title">
                            <span>Oh no! </span>It looks like you don't have a pet registered with us.
                        </h1>
                    ) : (
                        <h1 className="title">Your Pets: {petCount} / {MAX_PETS}</h1>
                    )}
                </div>

                <div className="content">
                    {petCount === 0 ? (
                        <p>Add a pet to start keeping track of their needs!</p>
                    ) : (
                        <div className="pet-list">
                            {petList.map((pet, index) => (
                                <div
                                    key={pet.id} 
                                    className="pet-card"
                                    onClick={() => navigate(`/petprofile/${pet.id}`, { state: { pet } })} // click to go to pet profile
                                    style={{ cursor: "pointer" }}
                                    >
                                    {/* delete button */}
                                    <HighlightOffIcon 
                                        className="delete-pet" 
                                        onClick={e => {
                                            e.stopPropagation(); // prevent click from going to pet profile
                                            handleDeletePet(index);
                                        }}
                                    />
                                    {/* pet picture */}
                                    {pet.picture && pet.picture.trim() !== "" ? (
                                        <img src={pet.picture} alt={pet.name} className="pet-icon" />
                                    ) : (
                                        <PetsIcon className="pet-icon" /> /* if no pet icon is chosen, use default */
                                    )}
                                    {/* pet name and age */}
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
            </div>
            {/* modal for adding pets */}
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-paper": { // modal styling
                        backgroundColor: "#f7e1d7",
                        borderRadius: "25px", // rounded corners
                        border: "2px solid rgb(0, 0, 0)", // border color
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
                        select
                        label="Pet Species"
                        name="species"
                        value={petInfo.species}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        {speciesOptions.map((species) => (
                            <MenuItem key={species} value={species}>
                                {species}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Short Description"
                        name="description"
                        value={petInfo.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
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