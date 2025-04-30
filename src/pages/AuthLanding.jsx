import React, { useState } from "react";
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import StarIcon from "@mui/icons-material/Star";
import "../styles/AuthLanding.css";

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
import petImage11 from "../assets/images/ferret.jpg";
import petImage12 from "../assets/images/froggy.jpg";
import petImage13 from "../assets/images/lizard_2.jpg";
import petImage14 from "../assets/images/bunny.jpg";
import petImage15 from "../assets/images/snake.jpg";
import petImage16 from "../assets/images/turtle.jpg";

const AuthLanding = () => {
    const { user, loading } = useUser(); // get user from context, get loading state too

    // if loading show a loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // if user is not logged in, redirect to landing page
    if (!user) {
        return <Navigate to="/" />;
    }

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

        // only dupe again if a smaller screen
        if (window.matchMedia("(max-width: 899px)").matches) {
            dupeSlides("slider1");
            dupeSlides("slider2");
        }
  }, []);

    return (
    <div className="authlanding-container container-fluid">
        <div className="slider-container sliders" id="slider1">
            <div className="slider-track">
                <div className="slide"><img src={petImage1} alt="Bird" /></div>
                <div className="slide"><img src={petImage11} alt="Ferret" /></div>
                <div className="slide"><img src={petImage2} alt="Fish" /></div>
                <div className="slide"><img src={petImage3} alt="Dog" /></div>
                <div className="slide"><img src={petImage4} alt="Cat playing" /></div>
                <div className="slide"><img src={petImage12} alt="Frog" /></div>
                <div className="slide"><img src={petImage5} alt="Rabbit" /></div>
                <div className="slide"><img src={petImage13} alt="Lizard" /></div>
            </div>
        </div>
        <div className="page-center">

            <div className="welcome-container">
                {user?.photoURL && (
                <img
                    src={user.photoURL}
                    alt="Profile"
                    className="profile-pic"
                />
                )}
                <h1 className="title">Welcome back <br></br><span>{user?.displayName || user?.name || "User"}</span>!</h1>
            </div>

            <div className="content">
                <nav className="bottom-navbar">
                    <ul>
                        {[
                        { path: "/reminder", label: "Reminders" },
                        { path: "/petcenter", label: "Pet Center" },
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

        </div>
        <div className="slider-container sliders" id="slider2">
            <div className="slider-track">
                <div className="slide"><img src={petImage8} alt="Dog and a cat" /></div>
                <div className="slide"><img src={petImage16} alt="Turtle" /></div>
                <div className="slide"><img src={petImage7} alt="Guinea Pig" /></div>
                <div className="slide"><img src={petImage15} alt="Snake" /></div>
                <div className="slide"><img src={petImage6} alt="Kitty" /></div>
                <div className="slide"><img src={petImage9} alt="Lizard" /></div>
                <div className="slide"><img src={petImage10} alt="2 Dogs" /></div>
                <div className="slide"><img src={petImage14} alt="Bunny" /></div>
            </div>
        </div>
    </div>
  );
};

export default AuthLanding;
