import React from "react";
import "../assets/styles/MobileReminder.css";

function MobileReminder() {
    return (
        <div className="container">
            <div className="back_container">
                <img src="./src/assets/images/arrow_back_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" id="back_img"></img>
                <p id="back_p">Reminder</p>
            </div>
            <div className="profile_container">
                <div className="pet_profile_container">
                    <div id="pet_img">
                        <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" id="dog_img"></img>
                    </div>
                    <div id="pet_info">
                        <div id="pet_name">
                            <h3 id="pet_name_h3">Max</h3>
                        </div>
                        <div id="pet_type">
                            <p>Golden Retriever</p>
                        </div>
                        <div id="pet_information">
                            <p>Friendly, and playful. Max loves meeting new people and playing fetch</p>
                        </div>
                    </div>
                </div>
                <div class="additional_pet_container">
                    <div class="additional_pet">
                        <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" class="additional_pet_img"></img>
                        <p class="additional_pet_name">Bella</p>
                    </div>
                    <div class="additional_pet">
                        <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" class="additional_pet_img"></img>
                        <p class="additional_pet_name">Luna</p>
                    </div>
                    <div class="additional_pet">
                        <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" class="additional_pet_img"></img>
                        <p class="additional_pet_name">Felix</p>
                    </div>
                    <div class="additional_pet">
                        <img src="./src/assets/images/048b8dbc061a104f266176b1b7bf828c.jpg" class="additional_pet_img"></img>
                        <p class="additional_pet_name">Zoe</p>
                    </div>
                </div>
                <div class="text_message_reminder_container">
                    <div id="text_message_reminder_header">
                        <h4>Text Message Reminder</h4>
                        <p>Send you a text message reminder</p>
                    </div>
                    <div class="email_reminder_container">
                        <h4>Email Reminder</h4>
                        <p>Send you an email reminder</p>
                    </div>
                </div>
            </div>
            <div class="reminder_header_container">
                <div id="reminder_header">
                    <h4 id="reminder_header_h4">Reminder</h4>
                </div>
                <div id="new_reminder">
                    <img src="./src/assets/images/add_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" id="new_reminder_img"></img>
                    <p id="new_reminder_p">New Reminder</p>
                </div>
                <div id="edit_reminder">
                    <img src="./src/assets/images/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" id="edit_reminder_img"></img>
                    <p id="edit_reminder_p">Edit Reminder</p>
                </div>
            </div>
        </div>
    )
}

export default MobileReminder;