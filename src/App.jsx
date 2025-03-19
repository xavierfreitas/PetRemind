import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicalInfo from "./pages/medicalinfo";
import Sidebar from "./components/sidebar";
import "./App.css";

// Blank page component
const BlankPage = ({ title }) => {
  return (
    <div className="blank-page">
      <h1>{title}</h1>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<BlankPage title="Home Page" />} />
            <Route path="/medical-info" element={<MedicalInfo />} />
            <Route path="/reminders" element={<BlankPage title="Reminders Page" />} />
            <Route path="/schedule" element={<BlankPage title="Schedule Page" />} />
            <Route path="/profile" element={<BlankPage title="Profile Page" />} />
            <Route path="/settings" element={<BlankPage title="Settings Page" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;