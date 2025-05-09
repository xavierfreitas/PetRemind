import { useState } from 'react'
import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/Navbar.jsx"; // Make sure this path is correct

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import DesktopLanding from "./pages/LandingPage.jsx";
import DesktopHome from "./pages/AuthLanding.jsx"
import DesktopPetCenter from "./pages/DesktopPetCenter.jsx"
import DesktopPetProfile from "./pages/DesktopPetProfile.jsx"
import DesktopReminder from "./pages/DesktopReminder.jsx"
import DesktopMedicalInfo from "./pages/DesktopMedicalInfo.jsx"
import DesktopFeatures from "./pages/DesktopFeatures.jsx"

import MobileReminder from './pages/MobileReminder.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DesktopLanding />} />
        <Route path="/authlanding" element={<DesktopHome />} />
        <Route path="/petcenter" element={<DesktopPetCenter />} />
        <Route path="/petprofile/" element={< DesktopPetProfile/>} /> 
        <Route path="/reminder" element={< DesktopReminder/>} />
        <Route path="/medicalinfo" element={< DesktopMedicalInfo/>} />
        <Route path="/features" element={< DesktopFeatures/>} /> 
      </Routes>
    </Router>
  );
}

export default App;