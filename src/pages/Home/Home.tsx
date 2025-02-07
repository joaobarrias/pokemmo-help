// Page: Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";


const Home: React.FC = () => {
  
  return (
    <div className="home-container">
      <h1>Welcome to PokeMMO Help! 🎮✨</h1>
      <p className="home-description">Your go-to tool for PokeMMO trainers! Calculate capture chances, search for Pokémon, and analyze type effectiveness.</p>
      
      <div className="feature-list">
        <div className="feature-card">
          <h2>🎯 Capture Chance</h2>
          <p>Calculate the probability of catching a Pokémon in PokeMMO with real-time updates.</p>
          <Link to="/capture-chance" className="feature-button">Try Now</Link>
        </div>
        
        <div className="feature-card">
          <h2>🔍 Pokémon Search (Coming Soon)</h2>
          <p>Find Pokémon by abilities, moves, stats, egg groups, and more.</p>
        </div>
        
        <div className="feature-card">
          <h2>⚔️ Type Chart (Coming Soon)</h2>
          <p>Analyze battle effectiveness with a dynamic type calculator.</p>
        </div>
      </div>
      
      <p className="discord-link">
        Join our <a href="https://discord.com/invite/syryMAF4Kr" target="_blank" rel="noopener noreferrer">Discord</a> for updates and community contributions!
      </p>
    </div>
  );
};

export default Home;
