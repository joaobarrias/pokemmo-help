import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><NavLink to="/capture-chance">Capture Chance</NavLink></li>
        <li><NavLink to="/stats-preview">Stats Preview</NavLink></li>
        <li><NavLink to="/type-chart">Type Chart</NavLink></li>
      </ul>
    </nav>
  );
};

export default NavBar;