import React from "react";
import "../assets/styles/DesktopReminder.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function DesktopReminder() {
  return (
    <div id="desktop_reminder_container">
      <div id="left_side_container">
        <div id="pet_profile_container">
          <div id="pet_profile_wrapper">
            <div id="pet_profile_img">
              <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" id="dog_img"></img>
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
                <input type="checkbox" id="text_message_reminder_checkbox"></input>
                <label for="text_message_reminder_checkbox">Text Message Reminder</label>
                <p>Send you a text message reminder.</p>
              </div>
              <div id="email_reminder_container">
                <input type="checkbox" id="email_reminder_checkbox"></input>
                <label for="email_reminder_checkbox">Email Reminder</label>
                <p>Send you an email reminder.</p>
              </div>
            </div>
          </div>
          <div id="additional_pet_container">
            <div class="additional_pet">
              <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" class="additional_pet_img"></img>
              <p class="additional_pet_name">Bella</p>
            </div>
            <div class="additional_pet">
              <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" class="additional_pet_img"></img>
              <p class="additional_pet_name">Bella</p>
            </div>
            <div class="additional_pet">
              <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" class="additional_pet_img"></img>
              <p class="additional_pet_name">Bella</p>
            </div>
            <div class="additional_pet">
              <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" class="additional_pet_img"></img>
              <p class="additional_pet_name">Bella</p>
            </div>
          </div>
        </div>
        <div class="reminder_header_container">
          <div id="reminder_header">
            <h4 id="reminder_header_h4">Reminder</h4>
          </div>
          <div id="new_reminder">
            <img src="./src/assets/images/add_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" id="new_reminder_img"></img>
            <Popup trigger={<p id="new_reminder_button">New Reminder</p>} position="center">
              <div id="Popup_id">POP</div>
              <input type="text" id="form_example"></input>
            </Popup>
          </div>
          <div id="edit_reminder">
            <img src="./src/assets/images/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" id="edit_reminder_img"></img>
            <p id="edit_reminder_p">Edit Reminder</p>
          </div>
        </div>
        <div class="reminder_container">
          <p>Reminder</p>
        </div>
      </div>
      <div id="right_side_container">
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
          <DatePicker />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
          <div id="date_calendar_container">
            <DateCalendar />
          </div>
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default DesktopReminder;
