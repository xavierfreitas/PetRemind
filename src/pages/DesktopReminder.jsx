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
import { colors } from "@mui/material";
import Switch from '@mui/material/Switch';
import { useNavigate } from "react-router-dom";

localStorage.clear();

function DesktopReminder() {
  // Use for navigation to other pages
  const navigate = useNavigate();

  // https://react.dev/learn/updating-arrays-in-state
  // Storing reminders
  const [reminders, setReminders] = useState(JSON.parse(localStorage.getItem("reminders")) || []);
  // Storing the reminder title, description, and date
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderDate, setReminderDate] = useState(dayjs());

  // Storing the filtered reminders based on the ate the user selected
  const [filteredReminders, setFilteredReminders] = useState([]);

  // Storing the state of open and close of MUI dialogs
  const [openNewReminder, setOpenNewReminder] = useState(false);
  const [openEditReminder, setOpenEditReminder] = useState(false);
  const [openDeleteReminder, setOpenDeleteReminder] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    filterReminderBasedOnDate(reminderDate)
  }, [reminders, reminderDate]);

  // Function that add a new reminder based on what the user inputted
  const addReminder = () => {
    const newReminder = {
      // Setting the reminder id so it's easier to keep track of each reminder if needed
      id: reminders.length ? reminders[reminders.length - 1].id + 1 : 1,
      title: reminderTitle,
      description: reminderDescription,
      date: reminderDate,
    };

    setReminders([...reminders, newReminder]);
    setReminderTitle("");
    setReminderDescription("");
    setReminderDate(dayjs());

    localStorage.setItem("reminders", JSON.stringify([...reminders, newReminder]));
    console.log(JSON.parse(localStorage.getItem("reminders")));
  }

  // Function that edit the selected reminder the user selected, and the reminder will be updated to what the user wants
  const editReminder = (id) => {
    // Search for the reminder that matched the id. The matching id means that's the reminder the user selected to be edited
    const selectedReminder = reminders.map(reminder => {
      if (reminder.id === id) {
        return {
          ...reminder,
          title: reminderTitle,
          description: reminderDescription,
          date: reminderDate,
        };
      }
      return reminder;
    });

    setReminders(selectedReminder);
    setReminderTitle("");
    setReminderDescription("");
    setReminderDate(dayjs());

    localStorage.setItem("reminders", JSON.stringify(selectedReminder));
    console.log(JSON.parse(localStorage.getItem("reminders")));
  }

  // Function that delete reminder based on the reminder the user selected
  const deleteReminder = (id) => {
    if (id != null) {
      const selectedReminder = reminders.filter(reminder => reminder.id !== id);
      setReminders(selectedReminder);
      setReminderTitle("");
      setReminderDescription("");
      setReminderDate(dayjs());

      localStorage.setItem("reminders", JSON.stringify(selectedReminder));
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
              <img src="./src/assets/images/dog_2.jpg" id="dog_img"></img>
            </div>
            <div id="pet_profile_info">
              <div id="pet_profile_info_name">
                <h3 id="pet_profile_info_name_h3">Max</h3>
              </div>
              <div id="pet_profile_info_breed">
                <p>Golden Retriever</p>
              </div>
              <div id="pet_profile_info_additional_info">
                <p>Friendly, and playful. Max loves meeting new people and playing fetch</p>
              </div>
            </div>
            <div id="enable_reminder_container">
              <div id="text_message_reminder_container">
                <Switch defaultChecked id="text_message_reminder_switch"></Switch>
                <label for="text_message_reminder_checkbox">Text Message Reminder</label>
                <p>Send you a text message reminder.</p>
              </div>
              <div id="email_reminder_container">
                <Switch defaultChecked id="email_reminder_switch"></Switch>
                <label for="email_reminder_checkbox">Email Reminder</label>
                <p>Send you an email reminder.</p>
              </div>
            </div>
          </div>
          <div id="additional_pet_container">
            <div class="additional_pet">
              <img src="./src/assets/images/247c14e67e1d68913412f29d51559c3b.jpg" class="additional_pet_img"></img>
              <p class="additional_pet_name">Bella</p>
            </div>
            <div class="additional_pet">
              <img src="./src/assets/images/2c8fe8c0e2f4de97a1b61213d33190e1.jpg" class="additional_pet_img"></img>
              <p class="additional_pet_name">Luna</p>
            </div>
            <div class="additional_pet">
              <img src="./src/assets/images/dog_3.jpeg" class="additional_pet_img"></img>
              <p class="additional_pet_name">Felix</p>
            </div>
            <div class="additional_pet">
              <img src="./src/assets/images/cat_2.jpeg" class="additional_pet_img"></img>
              <p class="additional_pet_name">Zoe</p>
            </div>
            <div class="additional_pet">
              <IconButton id="add_pet_button" onClick={addPet}>
                <AddIcon id="add_pet_icon" />
              </IconButton>
            </div>
          </div>
        </div>
        {/* All for Reminder */}
        <div class="reminder_header_container">
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
                  value={reminderDate}
                  onChange={(newValue) => {
                    setReminderDate(newValue);
                  }}
                />
              </LocalizationProvider>
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
                  <li class="reminder_item_container" key={reminder.id}>
                    <div class="reminder_left_side_container">
                      <div class="reminder_title_container">
                        <input type="checkbox" class="reminder_checkbox"></input>
                        <span class="reminder_title">{reminder.title}</span>
                      </div>
                      <p class="reminder_description">{reminder.description}</p>
                    </div>
                    <p class="reminder_date">
                      <span>Due Date: </span>
                      {dayjs(reminder.date).format('MM/DD/YYYY')}
                    </p>
                    <IconButton class="edit_reminder_button" onClick={() => { setReminderTitle(reminder.title); setReminderDescription(reminder.description); setReminderDate(dayjs(dayjs(reminder.date))); handleClickOpenEditReminder(reminder.id); }}>
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
                            value={reminderDate}
                            onChange={(newValue) => {
                              setReminderDate(newValue);
                            }}
                          />
                        </LocalizationProvider>
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
        <div class="reminder_container">
          <ul class="reminder_list">
            {/* I had an error that that some reminder is returning null since I was implementing localstorage, so this is a go around for such errors */}
            {reminders.filter(reminder => reminder !== null && reminder !== undefined).map((reminder) => (
              <li class="reminder_item_container" key={reminder.id}>
                <div class="reminder_left_side_container">
                  <div class="reminder_title_container">
                    <input type="checkbox" class="reminder_checkbox"></input>
                    <span class="reminder_title">{reminder.title}</span>
                  </div>
                  <p class="reminder_description">{reminder.description}</p>
                </div>
                <p class="reminder_date">
                  <span>Due Date: </span>
                  {reminder.date.format('MM/DD/YYYY')}
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
              value={reminderDate}
              onChange={(selectedDate) => {
                filterReminderBasedOnDate(selectedDate);
              }} />
          </LocalizationProvider>
          {/* Reminder list that is filtered based on the date the user selected */}
          {/* This filtered reminder list will be displayed below the calendar on the right hand side of the page */}
          <ul id="filtered_reminder_list">
            {/* I had an error that that some reminder is returning null since I was implementing localstorage, so this is a go around for such errors */}
            {filteredReminders.filter(reminder => reminder != null && reminder != undefined).map((reminder) => (
              <li class="reminder_item_container" key={reminder.id}>
                <div class="reminder_left_side_container">
                  <div class="reminder_title_container">
                    <input type="checkbox" class="reminder_checkbox"></input>
                    <span class="reminder_title">{reminder.title}</span>
                  </div>
                  <p class="reminder_description">{reminder.description}</p>
                </div>
                <p class="reminder_date">
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

