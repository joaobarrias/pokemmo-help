// Main: App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css"; // Import CSS
import pokemmoData from "./data/pokemmo-data.json"; // Import PokeMMO data
import NavBar from "./components/NavBar/NavBar"; // Import Navegation Bar Menu
import Footer from "./components/Footer/Footer"; // Import Footer
import Home from "./pages/Home/Home";  // Import Type Effectiveness page
import CaptureChance from "./pages/CaptureChance/CaptureChance"  // Import Capture Chance page
import PokemonSearch from "./pages/PokemonSearch/PokemonSearch";  // Import Pokemon Search page
import TypeEffectiveness from "./pages/TypeEffectiveness/TypeEffectiveness";  // Import Type Effectiveness page


const App: React.FC = () => {

  //const [allPokemon, setAllPokemon] = useState<{ name: string; id: number }[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<{ name: string; id: number }[]>([]);

  useEffect(() => {
    const loadPokemonData  = () => {
      try {
        // Extract Pokémon names and IDs from JSON
        const pokemonList = Object.entries(pokemmoData).map(([name, data]: [string, any]) => {
          // Check if formattedName exists in the data
          const pokemonName = data.formattedName ? data.formattedName : name.charAt(0).toUpperCase() + name.slice(1); // Use formattedName if available, otherwise apply default name formatting
  
          return {
            name: pokemonName, // Assign formattedName or original name
            id: data.id,
            originalName: name,
          };
        });

        //setAllPokemon(pokemonList);
        const filtered = pokemonList
        .filter(pokemon => (pokemmoData as any)[pokemon.originalName.toLowerCase()].capture_rate !== 0)
        .map(({ name, id }) => ({ name, id }));

      setFilteredPokemon(filtered);
      } catch (err) {
        console.error("Failed to fetch Pokémon data:", err);
      }
    };
    loadPokemonData();
  }, []);

  return (
    <Router>
      <AppWithRouter filteredPokemon={filteredPokemon}/>
    </Router>
  );
};

const AppWithRouter: React.FC<{ filteredPokemon: { name: string; id: number }[] }> = ({ filteredPokemon }) => {
  const location = useLocation();
  const isCaptureChancePage = location.pathname === "/capture-chance" || location.pathname === "/";
  const [backgroundImage, setBackgroundImage] = useState("background-images/Pikachu.jpg");

  return (
    <div className="app-container">
      <NavBar />
      <div 
        className={`content ${isCaptureChancePage ? "content-with-bg" : ""}`} 
        style={isCaptureChancePage ? { backgroundImage: `url(${backgroundImage})` } : {}}
      >
        <Routes>
          <Route path="/" element={<Home  />} />
          <Route path="/capture-chance" element={<CaptureChance filteredPokemon={filteredPokemon}  />} />
          <Route path="/pokemon-search" element={<PokemonSearch  />} />
          <Route path="/type-chart" element={<TypeEffectiveness  />} />
        </Routes>
      </div>
      <Footer setBackgroundImage={setBackgroundImage} />
    </div>
  );
};

export default App;
