// Component: NavBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'; // Import CSS

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const hamburgerRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo" onClick={(e) => e.currentTarget.blur()}>
        <img src="/icons/icon5.png" alt="Logo" />
        <span className="poke">Poke</span>
        <span className="mmo">MMO</span>
        <span className="help">Help</span>
      </NavLink>

      {/* Menu */}
      <ul ref={menuRef} className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/capture-chance" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Capture Chance
          </NavLink>
        </li>
        <li>
          <NavLink to="/pokemon-search" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Pokemon Search
          </NavLink>
        </li>
        <li>
          <NavLink to="/type-chart" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Type Chart
          </NavLink>
        </li>
      </ul>

      {/* Hamburger Icon */}
      <div ref={hamburgerRef} className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default NavBar;