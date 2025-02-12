// Component: PokemonSelector.tsx
import React from "react";
import "./PokemonSelector.css"; // Import CSS

type PokemonSelectorProps = {
    allPokemon: { name: string; id: number }[];
    setSelectedPokemon: React.Dispatch<React.SetStateAction<any>>;
};

const PokemonSelector : React.FC<PokemonSelectorProps> = ({
    allPokemon,
    setSelectedPokemon
  }) => {

    return (
      <div className="pokemon-selector">
        <h2>Select a Pokémon</h2>
        <select onChange={(e) => setSelectedPokemon(e.target.value)}>
          <option value="">Choose...</option>
          {/* Dynamically load Pokémon options later */}
        </select>
      </div>
    );
  };
  
  export default PokemonSelector;
  