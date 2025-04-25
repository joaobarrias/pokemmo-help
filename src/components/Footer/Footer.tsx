// Footer.tsx
import { FaDiscord, FaGithub } from "react-icons/fa"; // Import icons
import React, { useEffect, useState } from "react";
import "./Footer.css"; // Import CSS

interface FooterProps {
  setBackgroundImage: (image: string) => void;
  setBrightness: (value: number) => void; // New prop for brightness control
}

const Footer: React.FC<FooterProps> = ({ setBackgroundImage, setBrightness }) => {
  const [selectedTheme, setSelectedTheme] = useState("background-images/v3-darkrai.jpg"); // Default to Darkrai
  // State for brightness slider, defaults to 0.8 (Darkrai’s default)
  const [brightness, setLocalBrightness] = useState(0.8);

  // Default brightness values for each theme
  const defaultBrightness: { [key: string]: number } = {
    "background-images/v4-pikachu.png": 0.5,
    "background-images/v3-pokemon-go.jpg": 0.3,
    "background-images/v3-old-chateau.jpg": 0.4,
    "background-images/v3-darkrai.jpg": 0.3,
    "background-images/v3-chandelure.jpg": 0.4,
    "background-images/v3-kyogre.jpg": 0.4,
    "background-images/v3-regice.jpg": 0.25,
    "background-images/v3-black-rayquaza.jpg": 0.25,
    "background-images/v3-cofagrigus.jpg": 0.15,
    "background-images/v3-banette.jpg": 0.25,
    "background-images/eeveelutions.jpg": 0.15,
    "background-images/eevee.png": 0.2,
    "background-images/eevee-v2.jpg": 0.2,
    "/": 1.0, // No Theme
  };

  useEffect(() => {
    // Retrieve the stored background image from localStorage (if any)
    const savedTheme = localStorage.getItem('backgroundImage');
    if (savedTheme) {
      setBackgroundImage(savedTheme); // Set background image
      setSelectedTheme(savedTheme); // Set selected option in the dropdown
    }
    // Retrieve stored brightness or use default for the theme
    const savedBrightness = localStorage.getItem("brightness");
    const initialBrightness = savedBrightness ? parseFloat(savedBrightness) : defaultBrightness[savedTheme || "background-images/v3-darkrai.jpg"];
    setLocalBrightness(initialBrightness);
    setBrightness(initialBrightness);
  }, [setBackgroundImage, setBrightness]);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    setBackgroundImage(selectedTheme); // Update the background
    setSelectedTheme(selectedTheme); // Update the dropdown selection

    // Set default brightness for the selected theme
    const newBrightness = defaultBrightness[selectedTheme];
    setLocalBrightness(newBrightness);
    setBrightness(newBrightness);

    // Store the selected theme and brightness in localStorage
    localStorage.setItem('backgroundImage', selectedTheme);
    localStorage.setItem("brightness", newBrightness.toString());
  };

  // Handle brightness slider changes
  const handleBrightnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBrightness = parseFloat(event.target.value);
    setLocalBrightness(newBrightness);
    setBrightness(newBrightness);
    localStorage.setItem("brightness", newBrightness.toString());
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
              <option value="background-images/v4-pikachu.png">Pikachu</option>
              <option value="background-images/v3-pokemon-go.jpg">Pokemon GO</option>
              <option value="background-images/v3-old-chateau.jpg">Old Chateau</option>
              <option value="background-images/v3-darkrai.jpg">Darkrai</option>
              <option value="background-images/v3-chandelure.jpg">Chandelure</option>
              <option value="background-images/v3-kyogre.jpg">Kyogre</option>
              <option value="background-images/v3-regice.jpg">Regice</option>
              <option value="background-images/v3-black-rayquaza.jpg">Rayquaza</option>
              <option value="background-images/v3-cofagrigus.jpg">Cofagrigus</option>
              <option value="background-images/v3-banette.jpg">Banette</option>
              <option value="background-images/eeveelutions.jpg">Eeveelutions</option>
              <option value="background-images/eevee.png">Eevee</option>
              <option value="background-images/eevee-v2.jpg">Eevee (2)</option>
              <option value="/">No Theme</option>
            </select>
          </div>
          <p className="submit-art">🎨 Submit your art on Discord</p>
          {/* Brightness Slider */}
          <div className="brightness-slider">
            <label htmlFor="brightness">Brightness:</label>
            <input
              type="range"
              id="brightness"
              min="0"
              max="1"
              step="0.01"
              value={brightness}
              onChange={handleBrightnessChange}
            />
          </div>
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
        <p>© 2025 PokeMMO Help. All Rights Reserved.</p>
        <p className="footer-disclaimer">Disclaimer: This is a fan-made website for PokeMMO and is not affiliated with, endorsed, or sponsored by PokeMMO. 
          All Pokémon-related assets and trademarks belong to Nintendo, Game Freak, and The Pokémon Company. 
          This project is ongoing, and I welcome feedback and feature suggestions!</p>
      </div>
    </footer>
  );
};

export default Footer;