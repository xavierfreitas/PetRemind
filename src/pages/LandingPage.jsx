import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {

    /* function to dupe slider elements for longer track */
    function dupeSlides(sliderID) {
        const sliderTrack = document.querySelector(`#${sliderID} .slider-track`);
        
        if (!sliderTrack) {
            console.error(`No element found with ID "${sliderID}" and class "slider-track"`);
            return; // exit if no slider found
        }

        const slides = Array.from(sliderTrack.children);
        slides.forEach((slide) => {
            const clone = slide.cloneNode(true);
            sliderTrack.appendChild(clone);
        });
    }

    /* run dupeSlides once everything loaded */
    useEffect(() => {
        dupeSlides("slider1");
        dupeSlides("slider2");
    }, []);

    return (
    <div className="landingpage-container container-fluid">

        <div className="slider-container sliders" id="slider1">
            <div className="slider-track">
                <div className="slide"><img src="src/assets/images/bird.jpg" alt="Bird" /></div>
                <div className="slide"><img src="src/assets/images/fish.jpg" alt="Fish" /></div>
                <div className="slide"><img src="src/assets/images/dog.jpg" alt="Dog" /></div>
                <div className="slide"><img src="src/assets/images/catplaying.jpg" alt="Cat playing" /></div>
                <div className="slide"><img src="src/assets/images/rabbit.jpg" alt="Rabbit" /></div>
            </div>
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
            pet owner or a seasoned pro, this simple and intuitive platform will ensure our little 
            friends gets the love and care they deserve—on time, every time.
            </p>
            <p id="cta">
                <Link to="/AuthLanding" style={{ textDecoration: "none", color: "inherit" }}>
                Create an account or sign in!
                </Link>
            </p>
        </div>

        <div className="slider-container sliders" id="slider2">
            <div className="slider-track">
                <div className="slide"><img src="src/assets/images/kitty.jpg" alt="Kitty" /></div>
                <div className="slide"><img src="src/assets/images/guineapig.jpg" alt="Guinea Pig" /></div>
                <div className="slide"><img src="src/assets/images/dogandcat.jpg" alt="Dog and a cat" /></div>
                <div className="slide"><img src="src/assets/images/lizard.jpg" alt="Lizard" /></div>
                <div className="slide"><img src="src/assets/images/2dogs.jpg" alt="2 Dogs" /></div>
            </div>
        </div>

    </div>
  );
};

export default LandingPage;
