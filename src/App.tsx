import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import CaptureChance from "./pages/CaptureChance/CaptureChance";
//import PokemonSearch from "./pages/PokemonSearch";
//import TypeEffectiveness from "./pages/TypeEffectiveness";

const App: React.FC = () => {
  return (
    <Router>
    <div className="app-container">
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/capture-chance" />} />
          <Route path="/capture-chance" element={<CaptureChance />} />
          <Route path="/pokemon-search" element="" />
          <Route path="/type-chart" element="" />
        </Routes>
      </div>
      <Footer />
    </div>
  </Router>
  );
};

export default App;