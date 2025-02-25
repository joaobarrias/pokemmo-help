// Component: Filter.tsx
import React, { useState } from "react";
import "./Filter.css";
import movesData from "../../../../data/moves-data.json";
import abilitiesData from "../../../../data/abilities-data.json";

// Type assertions with index signatures to avoid detailed interfaces
const typedMovesData = movesData as { [key: string]: { type: string; learned_by_pokemon?: { id: number }[] } };
const typedAbilitiesData = abilitiesData as { [key: string]: { pokemon_with_ability: { id: number }[] } };

interface FilterProps {
  moves: (string | null)[];
  ability: string | null;
  isAlpha: boolean;
  selectedTypes: string[];
  typeCondition: "At least one" | "Exactly" | "Only";
  statsFilters: {
    hp: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    attack: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    defense: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    specialAttack: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    specialDefense: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    speed: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
  };
  setFilteredPokemon: React.Dispatch<React.SetStateAction<any[]>>;
  filteredPokemon: any[];
  pokemonData: { [key: string]: any }; // Minimal index signature for pokemonData
  resetFilters: () => void;
}

const Filter: React.FC<FilterProps> = ({
  moves,
  ability,
  isAlpha,
  selectedTypes,
  typeCondition,
  statsFilters,
  setFilteredPokemon,
  filteredPokemon,
  pokemonData,
  resetFilters,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "",
    direction: null,
  });

  const filterPokemon = () => {
    let filtered = Object.entries(pokemonData)
      .filter(([_, data]) => !data.unique_legendary)
      .map(([name, data]) => ({ name, ...data }));

    // Filter by moves
    const validMoves = moves.filter((m) => m) as string[];
    if (validMoves.length > 0) {
      filtered = filtered.filter((pokemon) =>
        validMoves.every((move) =>
          typedMovesData[move]?.learned_by_pokemon?.some((p) => p.id === pokemon.id)
        )
      );
    }

    // Filter by ability
    if (ability) {
      filtered = filtered.filter((pokemon) =>
        typedAbilitiesData[ability]?.pokemon_with_ability?.some((p) => p.id === pokemon.id)
      );
    }

    // Filter by alpha
    if (isAlpha) {
      filtered = filtered.filter((pokemon) => pokemon?.alpha === "yes");
    }

    // Filter by types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((pokemon) => {
        const pokemonTypes = pokemon?.types || [];
        if (typeCondition === "At least one") {
          return selectedTypes.some((type) => pokemonTypes.includes(type));
        } else if (typeCondition === "Exactly") {
          return (
            selectedTypes.length === pokemonTypes.length &&
            selectedTypes.every((type) => pokemonTypes.includes(type))
          );
        } else if (typeCondition === "Only") {
          return pokemonTypes.every((type: string) => selectedTypes.includes(type));
        }
        return true;
      });
    }

    // Filter by stats
    filtered = filtered.filter((pokemon) =>
      statKeys.every((stat) => {
        const filter = statsFilters[stat];
        if (!filter.value) return true;
        const statValue = pokemon?.stats?.[`base_${stat}`];
        if (filter.condition === "More than") return statValue > filter.value;
        if (filter.condition === "Equal to") return statValue === filter.value;
        if (filter.condition === "Less than") return statValue < filter.value;
        return true;
      })
    );

    setFilteredPokemon(filtered);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });

    if (direction) {
      setFilteredPokemon((prev) =>
        [...prev].sort((a, b) => {
          const aValue = key === "name" ? a.name : a.stats?.[`base_${key}`];
          const bValue = key === "name" ? b.name : b.stats?.[`base_${key}`];
          if (direction === "asc") return aValue > bValue ? 1 : -1;
          return aValue < bValue ? 1 : -1;
        })
      );
    } else {
      filterPokemon(); // Reset to original filtered order
    }
  };

  // Get abilities for a Pokémon based on its ID
  const getAbilities = (pokemonId: number) => {
    const abilities = Object.entries(typedAbilitiesData)
      .filter(([_, data]) => data?.pokemon_with_ability?.some((p) => p.id === pokemonId))
      .map(([abilityName]) => abilityName);
    return abilities.length > 0 ? abilities.join("\n") : "N/A";
  };

  return (
    <div className="filter-section">
      <div className="button-container">
        <button onClick={filterPokemon} className="search-button">Search</button>
        <button onClick={resetFilters} className="reset-button">Reset</button>
      </div>
      {filteredPokemon.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>ID</th>
              <th onClick={() => handleSort("name")}>Name</th>
              <th>Type(s)</th>
              <th>Abilitie(s)</th>
              <th onClick={() => handleSort("hp")}>HP</th>
              <th onClick={() => handleSort("attack")}>Attack</th>
              <th onClick={() => handleSort("defense")}>Defense</th>
              <th onClick={() => handleSort("specialAttack")}>Sp. Attack</th>
              <th onClick={() => handleSort("specialDefense")}>Sp. Defense</th>
              <th onClick={() => handleSort("speed")}>Speed</th>
            </tr>
          </thead>
          <tbody>
            {filteredPokemon.map((pokemon) => (
              <tr key={pokemon.id}>
                <td>{pokemon.id}</td>
                <td>{pokemon.formattedName || pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).replace("-", " ")}</td>
                <td>
                  {pokemon.types?.map((type: string) => (
                    <img key={type} src={`/types/icons/${type}.png`} alt={type} className="type-icon" />
                  ))}
                </td>
                <td style={{ whiteSpace: "pre-line" }}>{getAbilities(pokemon.id)}</td>
                <td>{pokemon.stats?.base_hp}</td>
                <td>{pokemon.stats?.base_attack}</td>
                <td>{pokemon.stats?.base_defense}</td>
                <td>{pokemon.stats?.base_special_attack}</td>
                <td>{pokemon.stats?.base_special_defense}</td>
                <td>{pokemon.stats?.base_speed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const statKeys = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"] as const;

export default Filter;