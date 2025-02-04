// NavBar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
      <img src="/icons/icon5.png" alt="Logo" />
      <span className="poke">Poke</span><span className="mmo">MMO</span> 
      <span className="help">Help</span>
      </NavLink>
      <ul className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <li>
          <NavLink
            to="/capture-chance"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Capture Chance
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pokemon-search"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Pokemon Search
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/type-chart"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Type Chart
          </NavLink>
        </li>
      </ul>
      <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default NavBar;
