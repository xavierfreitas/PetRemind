import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/AuthLanding.css";
import StarIcon from "@mui/icons-material/Star";

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
                <div className="slide"><img src="src/assets/images/bird.jpg" alt="Bird" /></div>
                <div className="slide"><img src="src/assets/images/fish.jpg" alt="Fish" /></div>
                <div className="slide"><img src="src/assets/images/dog.jpg" alt="Dog" /></div>
                <div className="slide"><img src="src/assets/images/catplaying.jpg" alt="Cat playing" /></div>
                <div className="slide"><img src="src/assets/images/rabbit.jpg" alt="Rabbit" /></div>
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

export default AuthLanding;
