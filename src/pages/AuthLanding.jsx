import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/AuthLanding.css";
import StarIcon from "@mui/icons-material/Star";

import petImage1 from "../assets/images/bird.jpg";
import petImage2 from "../assets/images/fish.jpg";
import petImage3 from "../assets/images/dog.jpg";
import petImage4 from "../assets/images/catplaying.jpg";
import petImage5 from "../assets/images/rabbit.jpg";

import petImage6 from "../assets/images/kitty.jpg";
import petImage7 from "../assets/images/guineapig.jpg";
import petImage8 from "../assets/images/dogandcat.jpg";
import petImage9 from "../assets/images/lizard.jpg";
import petImage10 from "../assets/images/2dogs.jpg";

const AuthLanding = () => {
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
    <div className="authlanding-container container-fluid">

        <div className="slider-container sliders" id="slider1">
            <div className="slider-track">
                <div className="slide"><img src={petImage1} alt="Bird" /></div>
                <div className="slide"><img src={petImage2} alt="Fish" /></div>
                <div className="slide"><img src={petImage3} alt="Dog" /></div>
                <div className="slide"><img src={petImage4} alt="Cat playing" /></div>
                <div className="slide"><img src={petImage5} alt="Rabbit" /></div>
            </div>
        </div>

        <div className="headers">
            <h1 className="title">Welcome back <span>User</span>!</h1>
        </div>

        <div className="content">
            <nav className="bottom-navbar">
                <ul>
                    {[
                    { path: "/reminder", label: "Reminders" },
                    { path: "/petprofile", label: "Pet Profile" },
                    { path: "/petcenter", label: "Pet Center" },
                    { path: "/medicalinfo", label: "Medical Info" },
                    { path: "/features", label: "Features" }
                    ].map((tab) => (
                    <li key={tab.path} className={location.pathname === tab.path ? "active" : ""}>
                        <Link to={tab.path} style={{ textDecoration: "none", color: "inherit" }}>
                        <StarIcon className="nav-icon" /><span>{tab.label}</span>
                        </Link>
                    </li>
                    ))}
                </ul>
            </nav>
        </div>

        <div className="slider-container sliders" id="slider2">
            <div className="slider-track">
                <div className="slide"><img src={petImage6} alt="Kitty" /></div>
                <div className="slide"><img src={petImage7} alt="Guinea Pig" /></div>
                <div className="slide"><img src={petImage8} alt="Dog and a cat" /></div>
                <div className="slide"><img src={petImage9} alt="Lizard" /></div>
                <div className="slide"><img src={petImage10} alt="2 Dogs" /></div>
            </div>
        </div>

    </div>
  );
};

export default AuthLanding;
