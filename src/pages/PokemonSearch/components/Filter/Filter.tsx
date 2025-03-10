// Component: Filter.tsx
import React, { useState } from "react";
import "./Filter.css"; // CSS 
import movesData from "../../../../data/moves-data.json"; // JSON data for move details
import abilitiesData from "../../../../data/abilities-data.json"; // JSON data for ability details
import heldItemsData from "../../../../data/held-items-data.json"; // JSON data for held items
import eggGroupsData from "../../../../data/egg-groups-data.json"; // JSON data for egg groups

// Type assertions for JSON data to ensure correct property access
const typedMovesData = movesData as { [key: string]: { type: string; learned_by_pokemon?: number[] } };
const typedAbilitiesData = abilitiesData as { [key: string]: { pokemon_with_ability: number[] } };
const typedHeldItemsData = heldItemsData as { [key: string]: { held_by: number[] } };
const typedEggGroupsData = eggGroupsData as { [key: string]: { name: string; pokemon_species: number[] } };

// Props interface defining filter criteria and state setters
interface FilterProps {
  moves: (string | null)[];
  ability: string | null;
  heldItem: string | null;
  isAlpha: boolean;
  selectedTypes: string[];
  typeCondition: "At least one" | "Exactly" | "Only";
  eggGroupCondition: "Any of" | "Both of";
  eggGroups: (string | null)[];
  statsFilters: {
    hp: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    attack: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    defense: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    special_attack: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    special_defense: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
    speed: { condition: "More than" | "Equal to" | "Less than"; value: number | null };
  };
  setFilteredPokemon: React.Dispatch<React.SetStateAction<any[]>>;
  filteredPokemon: any[];
  pokemonData: { [key: string]: any };
  resetFilters: () => void;
}

const Filter: React.FC<FilterProps> = ({
  moves,
  ability,
  heldItem,
  isAlpha,
  selectedTypes,
  typeCondition,
  eggGroupCondition,
  eggGroups,
  statsFilters,
  setFilteredPokemon,
  filteredPokemon,
  pokemonData,
  resetFilters,
}) => {
  // State for sorting configuration (column key and direction)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "",
    direction: null,
  });
  // State to track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  // Filters Pokémon based on moves, ability, held item, alpha status, types, egg groups, and stats
  const filterPokemon = () => {
    setSortConfig({ key: "", direction: null }); // Reset sorting on search
    // Start with all non-unique legendary Pokémon from the dataset
    let filtered = Object.entries(pokemonData)
      .filter(([_, data]) => !data.unique_legendary)
      .map(([name, data]) => ({ name, ...data }));

    // Filter by valid moves (non-null)
    const validMoves = moves.filter((m) => m) as string[];
    if (validMoves.length > 0) {
      filtered = filtered.filter((pokemon) =>
        validMoves.every((move) =>
          typedMovesData[move]?.learned_by_pokemon?.includes(pokemon.id)
        )
      );
    }

    // Filter by selected ability
    if (ability) {
      filtered = filtered.filter((pokemon) =>
        typedAbilitiesData[ability]?.pokemon_with_ability?.includes(pokemon.id)
      );
    }

    // Filter by selected held item
    if (heldItem) {
      filtered = filtered.filter((pokemon) =>
        typedHeldItemsData[heldItem]?.held_by?.includes(pokemon.id)
      );
    }

    // Filter by Alpha status
    if (isAlpha) {
      filtered = filtered.filter((pokemon) => pokemon?.alpha === "yes");
    }

    // Filter by selected types based on type condition
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

    // Filter by egg groups based on condition
    const validEggGroups = eggGroups.filter((g) => g) as string[];
    if (validEggGroups.length > 0) {
      filtered = filtered.filter((pokemon) => {
        const pokemonEggGroups = Object.values(typedEggGroupsData)
          .filter((group) => group.pokemon_species.includes(pokemon.id))
          .map((group) => group.name);
        if (eggGroupCondition === "Any of") {
          return validEggGroups.some((group) => pokemonEggGroups.includes(group));
        } else if (eggGroupCondition === "Both of") {
          return validEggGroups.every((group) => pokemonEggGroups.includes(group));
        }
        return true;
      });
    }

    // Filter by stat conditions
    filtered = filtered.filter((pokemon) =>
      statKeys.every((stat) => {
        const filter = statsFilters[stat];
        if (!filter.value) return true; // Skip if no value set
        const statValue = pokemon?.stats?.[`base_${stat}`];
        if (filter.condition === "More than") return statValue > filter.value;
        if (filter.condition === "Equal to") return statValue === filter.value;
        if (filter.condition === "Less than") return statValue < filter.value;
        return true;
      })
    );

    // Update filtered Pokémon list and mark search as completed
    setFilteredPokemon(filtered);
    setHasSearched(true);
  };

  // Handles sorting of table columns (asc, desc, or reset)
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction }); // Update sorting state

    if (direction) {
      // Sort filtered Pokémon by selected column
      setFilteredPokemon((prev) =>
        [...prev].sort((a, b) => {
          const aValue = key === "name" ? a.name : key === "id" ? a.id : a.stats?.[`base_${key}`];
          const bValue = key === "name" ? b.name : key === "id" ? b.id : b.stats?.[`base_${key}`];
          if (direction === "asc") return aValue > bValue ? 1 : -1;
          return aValue < bValue ? 1 : -1;
        })
      );
    } else {
      filterPokemon(); // Reset to original filtered order
    }
  };

  // Formats ability names (e.g., "water-absorb" to "Water Absorb")
  const formatAbilityName = (ability: string) =>
    ability
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Retrieves formatted list of abilities for a given Pokémon ID
  const getAbilities = (pokemonId: number) => {
    const abilities = Object.entries(typedAbilitiesData)
      .filter(([_, data]) => data?.pokemon_with_ability?.includes(pokemonId))
      .map(([abilityName]) => formatAbilityName(abilityName));
    return abilities.length > 0 ? abilities.join("\n") : "N/A"; // Join with newlines or return N/A
  };

  // Retrieves formatted list of egg groups for a given Pokémon ID
  const getEggGroups = (pokemonId: number) => {
    const eggGroups = Object.values(typedEggGroupsData)
      .filter((group) => group.pokemon_species.includes(pokemonId))
      .map((group) => formatAbilityName(group.name));
    return eggGroups.length > 0 ? eggGroups.join(" | ") : "N/A";
  };

  return (
    <div className="filter-section">
      {/* Search and reset buttons */}
      <div className="button-container">
        <button onClick={filterPokemon} className="search-button">Search</button>
        <button
          onClick={() => {
            resetFilters();
            setHasSearched(false); // Clear search state
            setSortConfig({ key: "", direction: null }); // Reset sorting on reset
          }}
          className="reset-button"
        >
          Reset
        </button>
      </div>
      {/* Conditional rendering: no results message or table */}
      {hasSearched && filteredPokemon.length === 0 ? (
        <p className="no-results">No results found</p>
      ) : filteredPokemon.length > 0 ? (
        <table className="results-table">
          {/* Table header with sortable columns */}
          <thead>
            <tr>
              <th className={sortConfig.key === "id" ? `sort-${sortConfig.direction}` : ""} onClick={() => handleSort("id")}>Icon</th>
              <th className={sortConfig.key === "name" ? `sort-${sortConfig.direction}` : ""} onClick={() => handleSort("name")}>Name</th>
              <th>Type(s)</th>
              <th>Abilitie(s)</th>
              <th className={sortConfig.key === "hp" ? `sort-${sortConfig.direction}` : ""} onClick={() => handleSort("hp")}>HP</th>
              <th className={sortConfig.key === "attack" ? `sort-${sortConfig.direction}` : ""} onClick={() => handleSort("attack")}>Atk</th>
              <th className={sortConfig.key === "defense" ? `sort-${sortConfig.direction}` : ""} onClick={() => handleSort("defense")}>Def</th>
              <th className={sortConfig.key === "special_attack" ? `sort-${sortConfig.direction}` : ""} onClick={() => handleSort("special_attack")}>Sp Atk</th>
              <th className={sortConfig.key === "special_defense" ? `sort-${sortConfig.direction}` : ""} onClick={() => handleSort("special_defense")}>Sp Def</th>
              <th className={sortConfig.key === "speed" ? `sort-${sortConfig.direction}` : ""} onClick={() => handleSort("speed")}>Speed</th>
            </tr>
          </thead>
          {/* Table body with filtered Pokémon data */}
          <tbody>
            {filteredPokemon.map((pokemon) => (
              <tr key={pokemon.id}>
                <td><img src={`/sprites/icon/${pokemon.id}.png`} alt={pokemon.name} className="pokemon-icon" /></td>
                <td>
                  <div className="name-egg-group">
                    <span className="pokemon-table-name">
                      {pokemon.formattedName || pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).replace("-", " ")}
                    </span>
                    <span className="egg-group">{getEggGroups(pokemon.id)}</span>
                  </div>
                </td>
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
      ) : null}
    </div>
  );
};

// Constant array of stat keys for filtering and sorting
const statKeys = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"] as const;

export default Filter;