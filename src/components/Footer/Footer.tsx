import { FaDiscord, FaGithub } from "react-icons/fa"; // Import icons
import React, { useEffect, useState } from "react";
import "./Footer.css"; // Import CSS

interface FooterProps {
  setBackgroundImage: (image: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setBackgroundImage }) => {
  const [selectedTheme, setSelectedTheme] = useState("background-images/darkrai.jpg"); // Default to Darkrai

  useEffect(() => {
    // Retrieve the stored background image from localStorage (if any)
    const savedTheme = localStorage.getItem('backgroundImage');
    if (savedTheme) {
      setBackgroundImage(savedTheme); // Set background image
      setSelectedTheme(savedTheme); // Set selected option in the dropdown
    }
  }, [setBackgroundImage]);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    setBackgroundImage(selectedTheme); // Update the background
    setSelectedTheme(selectedTheme); // Update the dropdown selection

    // Store the selected theme in localStorage
    localStorage.setItem('backgroundImage', selectedTheme);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <span className="poke">Poke</span><span className="mmo">MMO</span><span className="help">Help</span>
        </div>
      </div>
      <div className="footer-row">
        {/* Theme Selector */}
        <div className="theme-submit-container">
          <div className="theme-selector">
            <label htmlFor="theme">Theme:</label>
            <select id="theme" value={selectedTheme} onChange={handleThemeChange}>
              <option value="background-images/pikachu.jpg">Pikachu</option>
              <option value="background-images/pokemon-go.jpg">Pokemon GO</option>
              <option value="background-images/old-chateau.jpg">Old Chateau</option>
              <option value="background-images/darkrai.jpg">Darkrai</option>
              <option value="background-images/chandelure.jpg">Chandelure</option>
              <option value="background-images/halloween.jpg">Halloween</option>
              <option value="background-images/kyogre.jpg">Kyogre</option>
              <option value="background-images/regice.jpg">Regice</option>
              <option value="background-images/black-rayquaza.jpg">Rayquaza</option>
              <option value="background-images/cofagrigus.jpg">Cofagrigus</option>
              <option value="background-images/banette.jpg">Banette</option>
              <option value="/">No Theme</option>
            </select>
          </div>
          <p className="submit-art">🎨 Submit your art on Discord</p>
        </div>

        {/* Footer Menu */}
        <ul className="footer-menu">
          <li><a href="https://github.com/joaobarrias/pokemmo-help" target="_blank" rel="noopener noreferrer">
                <FaGithub /> GitHub
              </a></li>
          <li><a href="https://discord.gg/syryMAF4Kr" target="_blank" rel="noopener noreferrer">
                <FaDiscord /> Discord
              </a></li>
          <li><a href="#">Help us translate!</a></li>
        </ul>

        {/* Language Selector */}
        <div className="language-selector">
          <label htmlFor="language">Language:</label>
          <select id="language">
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 PokeMMO Help. All Rights Reserved.</p>
        <p className="footer-disclaimer">Disclaimer: This is a fan-made website for PokeMMO and is not affiliated with, endorsed, or sponsored by PokeMMO. 
          All Pokémon-related assets and trademarks belong to Nintendo, Game Freak, and The Pokémon Company. 
          This project is ongoing, and I welcome feedback and feature suggestions!</p>
      </div>
    </footer>
  );
};

export default Footer;
