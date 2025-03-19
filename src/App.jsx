import { useState } from 'react'
import './App.css'

import Navbar from "./components/Navbar.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import DesktopHome from "./pages/DesktopHome.jsx";
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
        <Route path="/" element={<DesktopHome />} />
        <Route path="/petprofile" element={< DesktopPetProfile/>} /> 
        <Route path="/reminder" element={< DesktopReminder/>} />
        <Route path="/medicalinfo" element={< DesktopMedicalInfo/>} />
        <Route path="/features" element={< DesktopFeatures/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
