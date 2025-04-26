import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/LandingPage.css";

import { db, auth, provider } from "../hosting/firebase"
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// pet images for the sliders
import petImage1 from "../assets/images/bird.jpg";
import petImage2 from "../assets/images/fish.jpg";
import petImage3 from "../assets/images/dog.jpg";
import petImage4 from "../assets/images/catplaying.jpg";
import petImage5 from "../assets/images/rabbit.jpg";
import petImage6 from "../assets/images/kitty.jpg";
import petImage7 from "../assets/images/guineapig.jpg"
import petImage8 from "../assets/images/dogandcat.jpg";
import petImage9 from "../assets/images/lizard.jpg";
import petImage10 from "../assets/images/2dogs.jpg";

const LandingPage = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    // https://firebase.google.com/docs/auth/web/google-signin
    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // make reference to users Firestore doc using their UID
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            // checking if user already exists
            if (userSnap.exists()) {
                console.log("User document already exists.");
                // update user document with any new data if needed
                await setDoc(userRef, {
                    name: user.displayName,
                    photoURL: user.photoURL,
                }, { merge: true });  // merge = true only updates fields instead of overwriting
            } else {
                // if a new user, create a new doc
                await setDoc(userRef, {
                    email: user.email,
                    name: user.displayName,
                    photoURL: user.photoURL,
                    userID: user.uid,
                });
                console.log("User data saved to Firestore");
            }

            setUser(user); // set user in context
            navigate("/authlanding"); // redirect to auth landing page
        } catch (error) {
            console.error("SIGN IN WITH GOOGLE ERROR: ", error);
        }
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
    }, []);

    return (
    <div className="landingpage-container container-fluid">

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
            <div className="googleSignIn">
                    { user ? (
                        <div>
                            <p>Welcome back, {user.displayName}</p>
                            <img src={user.photoURL} />
                        </div>
                    ) : (
                        <p id="cta">
                            <span
                            onClick={handleSignIn}
                            style={{ cursor: "pointer", textDecoration: "underline", color: "inherit" }}
                            >
                            Create an account or sign in!
                            </span>
                        </p>
                    )}
            </div>
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

export default LandingPage;
