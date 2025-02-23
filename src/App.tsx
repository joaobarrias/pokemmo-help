// Main: App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css"; // Import CSS
import pokemmoData from "./data/pokemmo-data.json"; // Import PokeMMO data
import NavBar from "./components/NavBar/NavBar"; // Import Navigation Bar Menu
import Footer from "./components/Footer/Footer"; // Import Footer
import Home from "./pages/Home/Home"; // Import Home page
import CaptureChance from "./pages/CaptureChance/CaptureChance"; // Import Capture Chance page
import PokemonSearch from "./pages/PokemonSearch/PokemonSearch"; // Import Pokemon Search page
import TypeCoverage from "./pages/TypeCoverage/TypeCoverage"; // Import Type Coverage page

const App: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<{ name: string; id: number }[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<{ name: string; id: number }[]>([]);
  const [isSplashVisible, setIsSplashVisible] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  // Load the theme from localStorage or set a default theme
  const [backgroundImage, setBackgroundImage] = useState(() => {
    const savedTheme = localStorage.getItem("backgroundImage");
    return savedTheme || "background-images/Darkrai.jpg"; // Default to Darkrai if no saved theme
  });

  useEffect(() => {
    // Detect if running as a PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    setIsPWA(isStandalone);

    const loadPokemonData = () => {
      try {
        const pokemonList = Object.entries(pokemmoData).map(([name, data]: [string, any]) => {
          const pokemonName = data.formattedName
            ? data.formattedName
            : name.charAt(0).toUpperCase() + name.slice(1);

          return {
            name: pokemonName,
            id: data.id,
            originalName: name,
          };
        });

        setAllPokemon(pokemonList);
        const filtered = pokemonList
          .filter((pokemon) => (pokemmoData as any)[pokemon.originalName.toLowerCase()].capture_rate !== 0)
          .map(({ name, id }) => ({ name, id }));

        setFilteredPokemon(filtered);
      } catch (err) {
        console.error("Failed to fetch Pokémon data:", err);
      }
    };
    loadPokemonData();

    // Show splash screen only if PWA
    if (isStandalone) {
      setIsSplashVisible(true);
      const splashTimer = setTimeout(() => {
        setIsSplashVisible(false);
      }, 2000); // 2 seconds for mobile PWA
      return () => clearTimeout(splashTimer);
    }
  }, []);

  // Save the selected theme to localStorage whenever it changes
  useEffect(() => {
    if (backgroundImage !== "background-images/Pikachu.jpg") {
      localStorage.setItem("backgroundImage", backgroundImage);
    }
  }, [backgroundImage]);

  if (isSplashVisible && isPWA) {
    return (
      <div className="splash-screen">
        <img src="icons/logo-512.png" alt="PokeMMO Help Logo" className="splash-logo" width="200" height="200"/>
        <h1 className="splash-title">
        <span className="poke">Poke</span>
        <span className="mmo">MMO</span>
        <span className="help">Help</span>
      </h1>
      </div>
    );
  }

  return (
    <Router>
      <AppWithRouter
        filteredPokemon={filteredPokemon}
        allPokemon={allPokemon}
        backgroundImage={backgroundImage}
        setBackgroundImage={setBackgroundImage}
      />
    </Router>
  );
};

const AppWithRouter: React.FC<{
  filteredPokemon: { name: string; id: number }[];
  allPokemon: { name: string; id: number }[];
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
}> = ({ filteredPokemon, allPokemon, backgroundImage, setBackgroundImage }) => {
  const location = useLocation();
  const isValidPage = location.pathname === "/capture-chance" || location.pathname === "/" || location.pathname === "/type-coverage";

  useEffect(() => {
    if (isValidPage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [backgroundImage, isValidPage]);

  return (
    <div className="app-container">
      <NavBar />
      <div className={`content ${isValidPage ? "content-with-bg" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capture-chance" element={<CaptureChance filteredPokemon={filteredPokemon} />} />
          <Route path="/pokemon-search" element={<PokemonSearch />} />
          <Route path="/type-coverage" element={<TypeCoverage allPokemon={allPokemon} />} />
        </Routes>
      </div>
      <Footer setBackgroundImage={setBackgroundImage} />
    </div>
  );
};

export default App;