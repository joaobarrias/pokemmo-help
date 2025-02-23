// App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  const [installPromptEvent, setInstallPromptEvent] = useState<Event | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState(() => {
    const savedTheme = localStorage.getItem("backgroundImage");
    return savedTheme || "background-images/Darkrai.jpg";
  });

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    setIsPWA(isStandalone);

    // Detect touch device
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

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

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      if (!isStandalone && isTouchDevice) setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (isStandalone) {
      setIsSplashVisible(true);
      const splashTimer = setTimeout(() => {
        setIsSplashVisible(false);
      }, 2000);
      return () => {
        clearTimeout(splashTimer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    } else if (isTouchDevice) {
      setShowInstallPrompt(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if (backgroundImage !== "background-images/Pikachu.jpg") {
      localStorage.setItem("backgroundImage", backgroundImage);
    }
  }, [backgroundImage]);

  const handleAddToHomeScreen = () => {
    if (installPromptEvent) {
      (installPromptEvent as any).prompt();
      (installPromptEvent as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User added to home screen");
        } else {
          console.log("User dismissed install prompt");
        }
        setInstallPromptEvent(null);
        setShowInstallPrompt(false);
      });
    } else {
      alert('To add to home screen, tap the "Share" icon and select "Add to Home Screen".');
      setShowInstallPrompt(false);
    }
  };

  const dismissInstallPrompt = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowInstallPrompt(false);
      setIsExiting(false);
    }, 300);
  };

  if (isSplashVisible && isPWA) {
    return (
      <div className="splash-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <img src="icons/logo512.png" alt="PokeMMO Help Logo" className="splash-logo" width="200" height="200"/>
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
        showInstallPrompt={showInstallPrompt}
        handleAddToHomeScreen={handleAddToHomeScreen}
        dismissInstallPrompt={dismissInstallPrompt}
        isExiting={isExiting}
      />
    </Router>
  );
};

const AppWithRouter: React.FC<{
  filteredPokemon: { name: string; id: number }[];
  allPokemon: { name: string; id: number }[];
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
  showInstallPrompt: boolean;
  handleAddToHomeScreen: () => void;
  dismissInstallPrompt: () => void;
  isExiting: boolean;
}> = ({ filteredPokemon, allPokemon, backgroundImage, setBackgroundImage, showInstallPrompt, handleAddToHomeScreen, dismissInstallPrompt, isExiting }) => {
  return (
    <div className="app-container">
      <div className="background-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capture-chance" element={<CaptureChance filteredPokemon={filteredPokemon} />} />
          <Route path="/pokemon-search" element={<PokemonSearch />} />
          <Route path="/type-coverage" element={<TypeCoverage allPokemon={allPokemon} />} />
        </Routes>
      </div>
      <Footer setBackgroundImage={setBackgroundImage} />
      {showInstallPrompt && (
        <div className={`install-prompt ${isExiting ? 'exiting' : ''}`}>
          <button className="add-button" onClick={handleAddToHomeScreen}>Add</button>
          <span className="install-text">To Home Screen</span>
          <button className="dismiss-button" onClick={dismissInstallPrompt}>✕</button>
        </div>
      )}
    </div>
  );
};

export default App;