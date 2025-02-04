// Footer.tsx
import { FaDiscord, FaGithub } from "react-icons/fa"; // Import icons
import React from "react";
import "./Footer.css";

interface FooterProps {
  setBackgroundImage: (image: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setBackgroundImage }) => {
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBackgroundImage(event.target.value);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <span className="poke">Poke</span><span className="mmo">MMO</span><span className="help">Help</span>
        </div>
      </div>
      <div className="footer-row">
        {/* Theme Selector  */}
        <div className="theme-selector">
          <label htmlFor="theme">Theme:</label>
          <select id="theme" onChange={handleThemeChange}>
            <option value="background-images/Pikachu.jpg">Pikachu</option>
            <option value="background-images/Ash.jpg">Ash</option>
            <option value="background-images/Jirachi.png">Jirachi</option>
            <option value="background-images/Eevee.jpg">Eevee</option>
            <option value="background-images/OldChateau.jpg">Old Chateau</option>
            <option value="background-images/Battle.jpg">Battle</option>
            <option value="background-images/Haunter.jpg">Haunter</option>
            <option value="/">No Theme</option>
          </select>
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
        <p className="footer-disclaimer">Disclaimer: This is a fan-made website for PokeMMO and is not affiliated with, endorsed, or sponsored by PokeMMO. All Pokémon-related assets and trademarks belong to Nintendo, Game Freak, and The Pokémon Company. This project is ongoing, and I welcome feedback and feature suggestions!</p>
      </div>
    </footer>
  );
};

export default Footer;

