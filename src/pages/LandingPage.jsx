import React from "react";
import "../styles/LandingPage.css";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar";


const LandingPage = () => {
  return (
    <div className="landing-container">
        <div className="images-grid" id="left-images">
            <img src="src/assets/images/bird.jpg" alt="Bird" />
            <img src="src/assets/images/fish.jpg" alt="Fish" />
            <img src="src/assets/images/dog.jpg" alt="Dog" />
        </div>

        <div className="headers">
            <h1 className="title">Welcome to <span>PetRemind!</span></h1>
            <h2 className="subtitle">Where pet needs are never forgotten</h2>
        </div>

        <div className="content">
            <p id="mainpitch">
            Life gets busy, but your pet's needs never stop. <span>PetRemind</span> helps you stay on 
            top of important pet care tasks like feeding, vet visits, grooming, and exercise 
            with smart reminders tailored to your pet's schedule. Whether you're a first-time 
            pet owner or a seasoned pro, our simple and intuitive platform ensures your furry 
            friend gets the love and care they deserve—on time, every time.
            </p>
            <p id="cta">Create an account or sign in!</p>
        </div>

        <div className="images-grid" id="right-images">
            <img src="src/assets/images/kitty.jpg" alt="Kitty" />
            <img src="src/assets/images/guineapig.jpg" alt="Guinea Pig" />
            <img src="src/assets/images/dogandcat.jpg" alt="Dog and a cat" />
        </div>
    </div>
  );
};

export default LandingPage;
