// Component: NavBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'; // Import CSS

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const hamburgerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleScroll = () => {
    if (window.scrollY > lastScrollY.current) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }

    // Close the menu when scrolling down
    if (isScrollingDown) {
      setIsMenuOpen(false);
    }

    // Update the last scroll position
    lastScrollY.current = window.scrollY;
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

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Clean up scroll event
      document.removeEventListener('mousedown', handleClickOutside); // Clean up click event
    };
  }, [isScrollingDown]);

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo" onClick={(e) => e.currentTarget.blur()}>
        <img src="/icons/logo.png" alt="Logo" />
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
          <NavLink to="/type-coverage" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Type Coverage
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