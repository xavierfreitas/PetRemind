import React, { useEffect } from "react";
import { useState } from "react";
import "../assets/styles/DesktopReminder.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import Popup from 'reactjs-popup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import 'reactjs-popup/dist/index.css';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { colors, Select } from "@mui/material";
import Switch from '@mui/material/Switch';
import { useNavigate, Navigate } from "react-router-dom";
import { db } from "../hosting/firebase";
import { collection, addDoc, setDoc, doc, updateDoc, deleteDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import { useUser } from "../context/UserContext";
import emailjs from "emailjs-com";
import weekday from 'dayjs/plugin/weekday';
import PetsIcon from "@mui/icons-material/Pets";

import dogImage2 from "../assets/images/dog_2.jpg";
import petImage from "../assets/images/247c14e67e1d68913412f29d51559c3b.jpg";
import petImage2 from "../assets/images/2c8fe8c0e2f4de97a1b61213d33190e1.jpg";
import petImage3 from "../assets/images/cat_2.jpeg";
import petImage4 from "../assets/images/dog_3.jpeg";

emailjs.init("NDPI8T0TZIJkB0OGV");
dayjs.extend(weekday);

function DesktopReminder() {
  const { user, loading } = useUser(); // get user from context, get loading state too

  // if loading show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // if user is not logged in, redirect to landing page
  if (!user) {
    return <Navigate to="/" />;
  }

  // Use for navigation to other pages
  const navigate = useNavigate();

  const { setUser } = useUser();

  // https://react.dev/learn/updating-arrays-in-state
  // Storing reminders
  const [reminders, setReminders] = useState(JSON.parse(localStorage.getItem("reminders")) || []);
  // Storing the reminder title, description, and date
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderDate, setReminderDate] = useState(dayjs());
  const [reminderRecurrence, setReminderRecurrence] = useState("none");
  // Storing the filtered reminders based on the ate the user selected
  const [filteredReminders, setFilteredReminders] = useState([]);

  // Storing the state of open and close of MUI dialogs
  const [openNewReminder, setOpenNewReminder] = useState(false);
  const [openEditReminder, setOpenEditReminder] = useState(false);
  const [openDeleteReminder, setOpenDeleteReminder] = useState(false);

  const [savedPet, setSavedPet] = useState([]);
  const [selectedPetID, setSelectedPetID] = useState(null);

  const checkIfReminderShouldBeSentToday = (reminder) => {
    const todayDate = dayjs().startOf('day');
    const reminderDate = dayjs(reminder.date).startOf('day');

    console.log("RECURRENCE", reminder.recurrence);

    if (reminderDate.isSame(todayDate)) {
      return true;
    }

    if (reminder.recurrence === 'daily') {
      return todayDate.isAfter(dayjs(reminder.date))
    }

    if (reminder.recurrence === 'weekly') {
      return todayDate.weekday() === reminderDate.weekday() && todayDate.isAfter(dayjs(reminder.date));
    }

    if (reminder.recurrence === 'monthly') {
      return todayDate.date() === reminderDate.date() && todayDate.isAfter(dayjs(reminder.date));
    }

    return false;
  }

  const sendReminderEmail = async (allPetsReminders) => {
    console.log("sendReminderEmail: ");

    const serviceID = "service_sqb40x7";
    const templateID = "template_ynl27vn";

    const allPetReminders = allPetsReminders.map(reminder => {
      return `
      <h3>Pet: ${reminder.petName}</h3>
      <p><strong>Title:</strong> ${reminder.title}</p>
      <p><strong>Description:</strong> ${reminder.description}</p>
      <p><strong>Due Date:</strong> ${reminder.date}</p>
      <hr />
      `;
    }).join("");

    const emailContent = {
      reminders: allPetReminders,
      email: user.email,
    };

    try {
      const response = await emailjs.send(serviceID, templateID, emailContent);
      console.log("Email sent", response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  const checkIfDailyReminderEmail = async () => {
    if (!user?.uid) {
      console.error("No user logged in");
      return;
    }
  
    const todayDate = dayjs().format("YYYY-MM-DD");
  
    const userDocRef = doc(db, 'reminders', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return;
    }


    const userData = userDoc.data();

    const lastEmailSentDate = userData?.lastEmailSentDate;
    console.log("lastEmailSentDate: ", lastEmailSentDate);

    const yesterdayDate = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    if (!lastEmailSentDate) {
      await setDoc(userDocRef, { lastEmailSentDate: yesterdayDate });

      console.log("lastEmailSentDate is undefined. Auto send.");
    }

    console.log("todayDate: ", todayDate);
    
    // Check if email was already sent today by checking user data
    if (lastEmailSentDate === todayDate) {
      console.log("Daily email already sent");
      return;
    }

    const petsCollection = collection(db, "reminders", user.uid, "pets");
    const petsDocs = await getDocs(petsCollection);
  
    let emailsSentToday = false;
    const allRemindersToSend = [];
  
    for (const petDoc of petsDocs.docs) {
      const petData = petDoc.data();
      const petId = petDoc.id;
  
      const petRemindersCollection = collection(db, "reminders", user.uid, "pets", petId, "remindersList");
      const petReminderDocs = await getDocs(petRemindersCollection);
  
      for (const petReminderDoc of petReminderDocs.docs) {
        const reminder = petReminderDoc.data();
  
        // Check if reminder should be sent today
        if (checkIfReminderShouldBeSentToday(reminder)) {
          allRemindersToSend.push({
            ...reminder,
            petName: petData.name || "Unnamed Pet"
          });
        }
      }
    }
  
    if (allRemindersToSend.length > 0) {
      // Send the email with all reminders at once
      await sendReminderEmail(allRemindersToSend);
      await setDoc(userDocRef, { lastEmailSentDate: todayDate }, { merge: true });
  
      emailsSentToday = true;
      console.log("Email sent with reminders.");
    } else {
      console.log("No reminders due today.");
    }
  
    // If email was sent, update last email sent date
    if (emailsSentToday) {
      await setDoc(userDocRef, { lastEmailSentDate: todayDate }, { merge: true });
      // Optionally store it in localStorage as well
      localStorage.setItem("lastEmailSentDate", todayDate);
      console.log("Last email sent date updated");
    }
  }

  // Function which opens NewReminder dialog
  const handleClickOpenNewReminder = () => {
    setOpenNewReminder(true);
  }
  // Function which closes NewReminder dialog
  const handleCloseNewReminder = () => {
    setOpenNewReminder(false);
  }

  // Function which opens EditReminder dialog
  const handleClickOpenEditReminder = (id) => {
    const selectedReminder = reminders.find(reminder => reminder.id === id);
    setReminderTitle(selectedReminder.title);
    setReminderDescription(selectedReminder.description);
    setReminderDate(selectedReminder.date);

    setOpenEditReminder(true);
  }

  // Function which closes EditReminder dialog
  const handleCloseEditReminder = () => {
    setOpenEditReminder(false);
  }

  // Function which opens DeleteReminder dialog
  const handleClickOpenDeleteReminder = () => {
    setOpenDeleteReminder(true);
  }

  // Function which closes DeleteReminder dialog
  const handleCloseDeleteReminder = () => {
    setOpenDeleteReminder(false);
  }

  const handleDropdownChange = (event) => {
    setReminderRecurrence(event.target.value);
  };

  useEffect(() => {
    filterReminderBasedOnDate(reminderDate)
  }, [reminders, reminderDate]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const updateUser = doc(db, "reminders", user.uid);

        await setDoc(updateUser, {}, { merge: true })

        const updatePetsCollection = collection(db, "pets");
        const updatePetsDocs = await getDocs(updatePetsCollection);

        for (const petDoc of updatePetsDocs.docs) {
          const petData = petDoc.data();
          const petId = petDoc.id;
        
          if (petData.ownerId === user.uid) {
            const petDocRef = doc(db, "reminders", user.uid, "pets", petId);
        
            // Save only that pet's data, not the whole updatedPetIds array
            await setDoc(petDocRef, petData, { merge: true });
          }
        }
        
        const petsCollection = collection(db, "reminders", user?.uid, "pets");
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
  }, [user?.uid], reminders);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        if (!user?.uid || !selectedPetID) {
          return;
        }

        const remindersCollection = collection(db, "reminders", user?.uid, "pets", selectedPetID, "remindersList");
        const remindersDocs = await getDocs(remindersCollection);

        const remindersList = remindersDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: dayjs(doc.data().date)
        }));

        setReminders(remindersList);
      } catch (error) {
        console.error("DesktopReminder: Error fetching reminders: ", error);
      }
    }

    fetchReminders();
  }, [user?.uid, selectedPetID]);

  useEffect(() => {
    if (user && savedPet.length > 0 && reminders.length > 0) {
      checkIfDailyReminderEmail();
    }
  }, [user, savedPet, reminders]);
  

  // Function that add a new reminder based on what the user inputted
  const addReminder = async () => {
    try {
      console.log("Hi: ", user?.uid, selectedPetID);
      if (!user?.uid || !selectedPetID) {
        return;
      }

      const newReminder = {
        title: reminderTitle,
        description: reminderDescription,
        date: reminderDate.toISOString(),
        recurrence: reminderRecurrence,
      }

      const remindersDocs = await addDoc(collection(db, "reminders", user?.uid, "pets", selectedPetID, "remindersList"), newReminder);

      const updatedReminder = {
        id: remindersDocs.id,
        ...newReminder,
        date: dayjs(newReminder.date),
      };

      setReminders([...reminders, updatedReminder]);

      setReminderTitle("");
      setReminderDescription("");
      setReminderDate(dayjs());
      setReminderRecurrence("none");
    } catch (error) {
      console.error("DesktopReminder: Error addReminder: ", error);
    }
  }

  // Function that edit the selected reminder the user selected, and the reminder will be updated to what the user wants
  const editReminder = async (id) => {
    try {
      if (!user?.uid || !selectedPetID) {
        return;
      }

      const remindersDocs = doc(db, "reminders", user?.uid, "pets", selectedPetID, "remindersList", id);

      await updateDoc(remindersDocs, {
        title: reminderTitle,
        description: reminderDescription,
        date: reminderDate.toISOString(),
        recurrence: reminderRecurrence,
      });

      // Search for the reminder that matched the id. The matching id means that's the reminder the user selected to be edited
      const selectedReminder = reminders.map(reminder => {
        if (reminder.id === id) {
          return {
            ...reminder,
            title: reminderTitle,
            description: reminderDescription,
            date: reminderDate.toISOString(),
            recurrence: reminderRecurrence,
          };
        }

        return reminder;
      });

      const selectedReminderDayjs = selectedReminder.map(reminder => ({
        ...reminder,
        date: dayjs(reminder.date),
      }));

      setReminders(selectedReminderDayjs);
      setReminderTitle("");
      setReminderDescription("");
      setReminderDate(dayjs());
      setReminderRecurrence("none");
    } catch (error) {
      console.error("DesktopReminder: Error editReminder: ", error);
    }
  }

  // Function that delete reminder based on the reminder the user selected
  const deleteReminder = async (id) => {
    try {
      if (!user?.uid || !selectedPetID) {
        return;
      }

      const remindersDocs = doc(db, "reminders", user?.uid, "pets", selectedPetID, "remindersList", id);
      await deleteDoc(remindersDocs);

      const selectedReminder = reminders.filter(reminder => reminder.id !== id);
      setReminders(selectedReminder);
      setReminderTitle("");
      setReminderDescription("");
      setReminderDate(dayjs());
      setReminderRecurrence("none");
    } catch (error) {
      console.error("DesktopReminder: Error deleteReminder: ", error);
    }
  }

  // Function that filter reminders based on date the user selected
  const filterReminderBasedOnDate = (date) => {
    const selectedDate = dayjs(date).format('MM/DD/YYYY');
    setFilteredReminders(reminders.filter(reminder => dayjs(reminder.date).format('MM/DD/YYYY') === selectedDate));
  }

  // Function that navigate to the add pet page
  const addPet = () => {
    navigate('/petcenter');
  }

  return (
    <div id="desktop_reminder_container">
      <div id="left_side_container">
        <div id="pet_profile_container">
          <div id="pet_profile_wrapper">
            <div id="pet_profile_img">
              {savedPet.find(pet => pet.id === selectedPetID)?.picture ? (
                <img src={savedPet.find(pet => pet.id === selectedPetID)?.picture}
                  id="pet_profile_img"
                  alt="pet_img"></img>
              ) : (
                <PetsIcon id="pet_profile_img" />
              )}
            </div>
            <div id="pet_profile_info">
              <div id="pet_profile_info_name">
                <h3 id="pet_profile_info_name_h3">{savedPet.find(pet => pet.id === selectedPetID)?.name || "Pet Name"}</h3>
              </div>
              <div id="pet_profile_info_breed">
                <p>{savedPet.find(pet => pet.id === selectedPetID)?.species || "Pet Species"}</p>
              </div>
              <div id="pet_profile_info_additional_info">
                <p>{savedPet.find(pet => pet.id === selectedPetID)?.description || "Pet Description"}</p>
              </div>
            </div>
            <div id="enable_reminder_container">
              <div id="email_reminder_container">
                <Switch defaultChecked id="email_reminder_switch"></Switch>
                <label for="email_reminder_checkbox">Email Reminder</label>
                <p>Send you an email reminder.</p>
              </div>
            </div>
          </div>
          <div id="additional_pet_container">
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
            <div className="additional_pet">
              <IconButton id="add_pet_button" onClick={addPet}>
                <AddIcon id="add_pet_icon" />
              </IconButton>
            </div>
          </div>
        </div>
        {/* All for Reminder */}
        <div className="reminder_header_container">
          <div id="reminder_header">
            <h4 id="reminder_header_h4">Reminder</h4>
          </div>
          {/* Button for adding new reminder */}
          <Button variant="contained" id="new_reminder_button" startIcon={<AddIcon />} onClick={handleClickOpenNewReminder}>
            Add Reminder
          </Button>
          <Dialog open={openNewReminder} onClose={handleCloseNewReminder}>
            <DialogTitle>New Reminder</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Title
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="reminder_title_form"
                label="Reminder Title"
                type="text"
                fullWidth
                variant="standard"
                onChange={e => setReminderTitle(e.target.value)}
              />
              <DialogContentText>
                Description
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="reminder_description_form"
                label="Reminder Description"
                type="text"
                fullWidth
                variant="standard"
                onChange={e => setReminderDescription(e.target.value)}
              />
              <DialogContentText>
                Select Date
              </DialogContentText>
              <br></br>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={reminderDate ? dayjs(reminderDate) : null}
                  onChange={(newValue) => {
                    setReminderDate(newValue);
                  }}
                />
              </LocalizationProvider>
              <DialogContentText>
                Recurrence
              </DialogContentText>
              <select
                value={reminderRecurrence} onChange={handleDropdownChange}>
                <option value="none">Select Reminder Recurrence</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <DialogActions>
                <Button onClick={handleCloseNewReminder}>Cancel</Button>
                <Button onClick={() => { addReminder(); handleCloseNewReminder(); }}>Save</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          {/* Button for editing reminder */}
          <Button variant="contained" id="edit_reminder_button" startIcon={<EditIcon />} onClick={handleClickOpenDeleteReminder}>
            Edit Reminder
          </Button>
          <Dialog open={openDeleteReminder} onClose={handleCloseDeleteReminder} fullWidth={true} maxWidth="lg">
            <DialogTitle>Edit Reminder</DialogTitle>
            <DialogContent>
              <ul id="edit_reminder_list">
                {/* // I had an error that that some reminder is returning null since I was implementing localstorage, so this is a go around for such errors */}
                {reminders.filter(reminder => reminder !== null && reminder !== undefined).map((reminder) => (
                  <li className="reminder_item_container" key={reminder.id}>
                    <div className="reminder_left_side_container">
                      <div className="reminder_title_container">
                        <input type="checkbox" className="reminder_checkbox"></input>
                        <span className="reminder_title">{reminder.title}</span>
                      </div>
                      <p className="reminder_description">{reminder.description}</p>
                    </div>
                    <p className="reminder_date">
                      <span>Due Date: </span>
                      {dayjs(reminder.date).format('MM/DD/YYYY')}
                    </p>
                    <IconButton className="edit_reminder_button" onClick={() => { setReminderTitle(reminder.title); setReminderDescription(reminder.description); setReminderDate(dayjs(dayjs(reminder.date))); handleClickOpenEditReminder(reminder.id); }}>
                      <EditIcon />
                    </IconButton>
                    <Dialog open={openEditReminder} onClose={handleCloseEditReminder}>
                      <DialogTitle>Edit Reminder</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Title
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="reminder_title_form"
                          label="Reminder Title"
                          type="text"
                          fullWidth
                          variant="standard"
                          onChange={e => setReminderTitle(e.target.value)}
                        />
                        <DialogContentText>
                          Description
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="reminder_description_form"
                          label="Reminder Description"
                          type="text"
                          fullWidth
                          variant="standard"
                          onChange={e => setReminderDescription(e.target.value)}
                        />
                        <DialogContentText>
                          Select Date
                        </DialogContentText>
                        <br></br>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Date"
                            value={reminderDate ? dayjs(reminderDate) : null}
                            onChange={(newValue) => {
                              setReminderDate(newValue);
                            }}
                          />
                        </LocalizationProvider>
                        <DialogContentText>
                          Recurrence
                        </DialogContentText>
                        <select
                          value={reminderRecurrence} onChange={handleDropdownChange}>
                          <option value="none">Select Reminder Recurrence</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseEditReminder}>Cancel</Button>
                        <Button onClick={() => { editReminder(reminder.id); handleCloseEditReminder(); }}>Save</Button>
                      </DialogActions>
                    </Dialog>
                    <IconButton class="edit_reminder_button" onClick={() => { deleteReminder(reminder.id); handleCloseDeleteReminder(); }}>
                      <DeleteIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        </div>
        <div className="reminder_container">
          <ul className="reminder_list">
            {/* I had an error that that some reminder is returning null since I was implementing localstorage, so this is a go around for such errors */}
            {reminders.filter(reminder => reminder !== null && reminder !== undefined).map((reminder) => (
              <li className="reminder_item_container" key={reminder.id}>
                <div className="reminder_left_side_container">
                  <div className="reminder_title_container">
                    <input type="checkbox" className="reminder_checkbox"></input>
                    <span className="reminder_title">{reminder.title}</span>
                  </div>
                  <p className="reminder_description">{reminder.description}</p>
                </div>
                <p className="reminder_date">
                  <span>Due Date: </span>
                  {dayjs(reminder.date).format('MM/DD/YYYY')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="right_side_container">
        <div id="calendar_container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* // I couldn't find a way to style the calander in css so I had to do it here */}
            <StaticDatePicker
              slotProps={{
                layout: {
                  sx: {
                    backgroundColor: '#F7E1D7',
                    borderRadius: '32px',
                  }
                }
              }
              }
              orientation="landscape"
              value={reminderDate ? dayjs(reminderDate) : null}
              onChange={(selectedDate) => {
                filterReminderBasedOnDate(selectedDate);
              }} />
          </LocalizationProvider>
          {/* Reminder list that is filtered based on the date the user selected */}
          {/* This filtered reminder list will be displayed below the calendar on the right hand side of the page */}
          <ul id="filtered_reminder_list">
            {/* I had an error that that some reminder is returning null since I was implementing localstorage, so this is a go around for such errors */}
            {filteredReminders.filter(reminder => reminder != null && reminder != undefined).map((reminder) => (
              <li className="reminder_item_container" key={reminder.id}>
                <div className="reminder_left_side_container">
                  <div className="reminder_title_container">
                    <input type="checkbox" className="reminder_checkbox"></input>
                    <span className="reminder_title">{reminder.title}</span>
                  </div>
                  <p className="reminder_description">{reminder.description}</p>
                </div>
                <p className="reminder_date">
                  <span>Due Date: </span>
                  {dayjs(reminder.date).format('MM/DD/YYYY')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DesktopReminder;

