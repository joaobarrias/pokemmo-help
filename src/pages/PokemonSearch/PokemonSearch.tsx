// Page: PokemonSearch.tsx
import React, { useState } from "react";
import "./PokemonSearch.css"; // CSS for page layout
import Moves from "./components/Moves/Moves"; // Moves input component
import Essentials from "./components/Essentials/Essentials"; // Ability and alpha component
import Types from "./components/Types/Types"; // Type selection component
import BaseStats from "./components/BaseStats/BaseStats"; // Stat filters component
import Filter from "./components/Filter/Filter"; // Results table component
import pokemmoData from "./../../data/pokemmo-data.json"; // JSON data for Pokémon

const PokemonSearch: React.FC = () => {
  // State for selected moves (up to 4)
  const [moves, setMoves] = useState<(string | null)[]>([null, null, null, null]);
  // State for selected ability
  const [ability, setAbility] = useState<string | null>(null);
  // State for alpha filter toggle
  const [isAlpha, setIsAlpha] = useState(false);
  // State for selected types
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  // State for type condition mode
  const [typeCondition, setTypeCondition] = useState<"At least one" | "Exactly" | "Only">("At least one");
  // State for stat filters
  const [statsFilters, setStatsFilters] = useState({
    hp: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    attack: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    defense: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    special_attack: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    special_defense: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    speed: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
  });
  // State for filtered Pokémon list
  const [filteredPokemon, setFilteredPokemon] = useState<any[]>([]);

  // State for reset callbacks from Moves and Essentials
  const [resetMovesCallback, setResetMovesCallback] = useState<(() => void) | null>(null);
  const [resetAbilityCallback, setResetAbilityCallback] = useState<(() => void) | null>(null);

  // Resets all filters and input displays
  const resetFilters = () => {
    setMoves([null, null, null, null]);
    setAbility(null);
    setIsAlpha(false);
    setSelectedTypes([]);
    setTypeCondition("At least one");
    setStatsFilters({
      hp: { condition: "More than", value: null },
      attack: { condition: "More than", value: null },
      defense: { condition: "More than", value: null },
      special_attack: { condition: "More than", value: null },
      special_defense: { condition: "More than", value: null },
      speed: { condition: "More than", value: null },
    });
    setFilteredPokemon([]);
    resetMovesCallback?.(); // Reset Moves inputs
    resetAbilityCallback?.(); // Reset Essentials input
  };

  return (
    <div className="pokemon-search-page">
      {/* Page header */}
      <div className="header">
        <h1>Pokémon Search</h1>
      </div>
      {/* Main content */}
      <div className="search-body">
        <div className="search-container">
          {/* First row: Moves, Essentials, Base Stats */}
          <div className="first-row-search">
            <div className="moves-essentials">
              <Moves moves={moves} setMoves={setMoves} setResetMovesCallback={setResetMovesCallback} />
              <Essentials
                ability={ability}
                setAbility={setAbility}
                isAlpha={isAlpha}
                setIsAlpha={setIsAlpha}
                setResetAbilityCallback={setResetAbilityCallback}
              />
            </div>
            <div className="base-stats">
              <BaseStats statsFilters={statsFilters} setStatsFilters={setStatsFilters} />
            </div>
          </div>
          {/* Second row: Types */}
          <div className="second-row-search">
            <Types
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              typeCondition={typeCondition}
              setTypeCondition={setTypeCondition}
            />
          </div>
          {/* Third row: Filter table */}
          <div className="third-row-search">
            <Filter
              moves={moves}
              ability={ability}
              isAlpha={isAlpha}
              selectedTypes={selectedTypes}
              typeCondition={typeCondition}
              statsFilters={statsFilters}
              setFilteredPokemon={setFilteredPokemon}
              filteredPokemon={filteredPokemon}
              pokemonData={pokemmoData as { [key: string]: any }}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonSearch;