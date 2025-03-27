import { useState } from 'react'
import './App.css'

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/sidebar.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from './pages/LandingPage.jsx';
import DesktopPetProfile from "./pages/DesktopPetProfile.jsx"
import DesktopReminder from "./pages/DesktopReminder.jsx"
import DesktopMedicalInfo from "./pages/DesktopMedicalInfo.jsx"
import DesktopFeatures from "./pages/DesktopFeatures.jsx"

import MobileReminder from './pages/MobileReminder.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={< LandingPage/>} />
        <Route path="/petprofile" element={< DesktopPetProfile/>} /> 
        <Route path="/reminder" element={< DesktopReminder/>} />
        <Route path="/medicalinfo" element={< DesktopMedicalInfo/>} />
        <Route path="/features" element={< DesktopFeatures/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
