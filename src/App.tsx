import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import CaptureChance from "./pages/CaptureChance";
//import StatCalculator from "./pages/StatCalculator";
//import TypeEffectiveness from "./pages/TypeEffectiveness";

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/capture-chance" />} />
        <Route path="/capture-chance" element={<CaptureChance />} />
        <Route path="/stats-preview" element="" />
        <Route path="/type-chart" element="" />
      </Routes>
    </Router>
  );
};

export default App;