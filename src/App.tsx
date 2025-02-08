// Main: App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css"; // Import CSS
import excludedPokemonData from "./data/pokemmo-condition.json"; // Import pokemons name that don't exist in PokeMMO
import NavBar from "./components/NavBar/NavBar"; // Import Navegation Bar Menu
import Footer from "./components/Footer/Footer"; // Import Footer
import Home from "./pages/Home/Home";  // Import Type Effectiveness page
import CaptureChance from "./pages/CaptureChance/CaptureChance"  // Import Capture Chance page
import PokemonSearch from "./pages/PokemonSearch/PokemonSearch";  // Import Pokemon Search page
import TypeEffectiveness from "./pages/TypeEffectiveness/TypeEffectiveness";  // Import Type Effectiveness page


const App: React.FC = () => {

  const [allPokemon, setAllPokemon] = useState<{ name: string; id: number }[]>([]);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        // Exclude other gens except the ones bellow
        const urls = [
          "https://pokeapi.co/api/v2/generation/1",
          "https://pokeapi.co/api/v2/generation/2",
          "https://pokeapi.co/api/v2/generation/3",
          "https://pokeapi.co/api/v2/generation/4",
          "https://pokeapi.co/api/v2/generation/5",
        ];

        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const generations = await Promise.all(responses.map((res) => res.json()));

        const pokemonList = generations.flatMap((gen) =>
          gen.pokemon_species.map((species: { name: string; url: string }) => {
            const id = parseInt(species.url.split("/")[6]); // Extract ID from the URL
            return { name: species.name.charAt(0).toUpperCase() + species.name.slice(1), id };
          })
        );

         // Filter out excluded Pokémon names
        const filteredPokemonList = pokemonList.filter(
          (pokemon) => !excludedPokemonData.excludePokemon.includes(pokemon.name.toLowerCase())
        );
  
        setAllPokemon(filteredPokemonList.sort((a, b) => a.id - b.id));
      } catch (err) {
        console.error("Failed to fetch Pokémon list:", err);
      }
    };

    fetchAllPokemon();

  }, []);

  return (
    <Router>
      <AppWithRouter allPokemon={allPokemon}/>
    </Router>
  );
};

const AppWithRouter: React.FC<{ allPokemon: { name: string; id: number }[] }> = ({ allPokemon }) => {
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
          <Route path="/capture-chance" element={<CaptureChance allPokemon={allPokemon}  />} />
          <Route path="/pokemon-search" element={<PokemonSearch  />} />
          <Route path="/type-chart" element={<TypeEffectiveness  />} />
        </Routes>
      </div>
      <Footer setBackgroundImage={setBackgroundImage} />
    </div>
  );
};

export default App;
