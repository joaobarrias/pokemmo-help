// Page: PokemonSearch.tsx
import React, { useState } from "react";
import "./PokemonSearch.css";
import Moves from "./components/Moves/Moves";
import Essentials from "./components/Essentials/Essentials";
import Types from "./components/Types/Types";
import BaseStats from "./components/BaseStats/BaseStats";
import Filter from "./components/Filter/Filter";
import pokemmoData from "./../../data/pokemmo-data.json";

const PokemonSearch: React.FC = () => {
  const [moves, setMoves] = useState<(string | null)[]>([null, null, null, null]);
  const [ability, setAbility] = useState<string | null>(null);
  const [isAlpha, setIsAlpha] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [typeCondition, setTypeCondition] = useState<"At least one" | "Exactly" | "Only">("At least one");
  const [statsFilters, setStatsFilters] = useState({
    hp: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    attack: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    defense: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    special_attack: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    special_defense: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
    speed: { condition: "More than" as "More than" | "Equal to" | "Less than", value: null as number | null },
  });
  const [filteredPokemon, setFilteredPokemon] = useState<any[]>([]);

  const [resetMovesCallback, setResetMovesCallback] = useState<(() => void) | null>(null);
  const [resetAbilityCallback, setResetAbilityCallback] = useState<(() => void) | null>(null);
  
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
    resetMovesCallback?.();
    resetAbilityCallback?.();
  };

  return (
    <div className="pokemon-search-page">
      <div className="header">
        <h1>Pokémon Search</h1>
      </div>
      <div className="search-body">
        <div className="search-container">
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
          <div className="second-row-search">
            <Types
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              typeCondition={typeCondition}
              setTypeCondition={setTypeCondition}
            />
          </div>
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