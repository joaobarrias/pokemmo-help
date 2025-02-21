// Component: PokemonSelector.tsx
import React, { useState, useRef, useEffect } from "react";
import "./PokemonSelector.css"; // Import CSS
import pokemmoData from "../../../../data/pokemmo-data.json"; // Import all PokeMMO data
import { PokemonState } from '../../TypeCoverage'; // Import current pokemon object

type PokemonSelectorProps = {
  allPokemon: { name: string; id: number }[];
  selectedPokemon: PokemonState;
  setSelectedPokemon: React.Dispatch<React.SetStateAction<PokemonState>>;
  pokemonTypes: string[];
  setPokemonTypes: React.Dispatch<React.SetStateAction<string[]>>;
};

const PokemonSelector: React.FC<PokemonSelectorProps> = ({
  allPokemon,
  selectedPokemon,
  setSelectedPokemon,
  pokemonTypes,
  setPokemonTypes
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionBoxRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFetchingDataRef = useRef(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch chosen pokemon data
  const fetchPokemonData = async (name: string) => {
    if (!name.trim()) return; // Don't fetch if the name is empty
    try {
      isFetchingDataRef.current = true;
      let pokemonName = name.toLowerCase().replace(' ', '-');
      let pokemon = (pokemmoData as any)[pokemonName];

      if (!pokemon) {
        throw new Error('Pokémon data not found');
      }
      
      setSelectedPokemon({
        name: name,
        id: pokemon.id,
        imageUrl: pokemon.sprites.default,
    });
    setPokemonTypes(pokemon.types);
    } catch (err) {
        setSelectedPokemon({
        name: "",
        id: null,
        imageUrl: null,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setSelectedPokemon((prevState) => ({ ...prevState, name: rawValue })); // Update input state
  
    if (!rawValue.trim()) {
      setSuggestions(allPokemon.map((pokemon) => pokemon.name)); // Show all if empty
      return;
    }
  
    // Normalize input: Replace spaces with hyphens for consistency
    const normalizedInput = rawValue.toLowerCase().replace(" ", "-");
  
    // Filter Pokémon names based on the normalized input
    const matches = allPokemon
      .filter((pokemon) =>
        pokemon.name.toLowerCase().replace(" ", "-").includes(normalizedInput)
      )
      .map((pokemon) => pokemon.name);
  
    // Find Pokémon whose name **starts** with the input (for auto-selection logic)
    const prefixMatches = matches.filter((name) =>
      name.toLowerCase().replace(" ", "-").startsWith(normalizedInput)
    );
  
    // Find an exact match using normalized input
    const exactMatch = allPokemon.find(
      (pokemon) =>
        pokemon.name.toLowerCase().replace(" ", "-") === normalizedInput
    );
  
    if (exactMatch) {
      // If there's an exact match and only one prefix match (meaning we can auto-select)
      if (prefixMatches.length === 1) {
        setSuggestions([]); // Clear suggestions if there's only one match
        fetchPokemonData(exactMatch.name); // Fetch data for that Pokémon
        inputRef.current?.blur(); // Unfocus input field
        isFetchingDataRef.current = false;
      } else {
        setSuggestions(prefixMatches); // Keep suggestions open if there are multiple matches
        fetchPokemonData(prefixMatches[0]); // Fetch data for the first match
      }
    } else {
      setSuggestions(matches); // Show all matches if no exact match is found
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSuggestions([]);
    fetchPokemonData(name); // Fetch the Pokémon data for the clicked suggestion
    inputRef.current?.blur();
    isFetchingDataRef.current = false;
  };

  const handleClickOutside = (e: MouseEvent) => {
    // Check if the user clicked outside the input or the suggestion box
    if (
        inputRef.current &&
        suggestionBoxRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        !suggestionBoxRef.current.contains(e.target as Node)
    ) {
      // Only clear suggestions if there are any
      setSuggestions([])
      if (isFetchingDataRef.current){
        isFetchingDataRef.current = false;
        return;
      }
      else{
        fetchPokemonData("Gyarados");
        isFetchingDataRef.current = false;
      }
    }
  };

  const handleInputBlur = () => {
    // Only reset to Gyarados if the user has not written a valid suggestion
    if (selectedPokemon.name.trim() && !suggestions.length) {
      const isValidPokemon = allPokemon.some(
      (pokemon) => pokemon.name.trim().toLowerCase().replace(" ", "-") === selectedPokemon.name.trim().toLowerCase().replace(" ", "-")
      );
      if (!isValidPokemon) {
        fetchPokemonData("Gyarados");
        isFetchingDataRef.current = false;
      }
    }
  };

  const highlightMatch = (name: string, match: string) => {
    // Normalize both name and match (treat spaces & hyphens as the same)
    const normalizedName = name.toLowerCase().replace(/[- ]/g, "-");
    const normalizedMatch = match.toLowerCase().replace(/[- ]/g, "-");
  
    const index = normalizedName.indexOf(normalizedMatch);
    if (index === -1) return name; // No match, return original name
  
    // Find the actual position in the original name
    let matchStart = -1;
  
    for (let i = 0, j = 0; i < name.length; i++) {
      if (name[i].match(/[- ]/)) continue; // Skip spaces and hyphens when matching
  
      if (j === index) {
        matchStart = i;
        break;
      }
  
      j++;
    }
  
    if (matchStart === -1) return name; // Fallback
  
    // Slice the original name at the found position
    const before = name.slice(0, matchStart);
    const bold = name.slice(matchStart, matchStart + match.length);
    const after = name.slice(matchStart + match.length);
  
    return (
      <>
        {before}
        <span className="bold">{bold}</span>
        {after}
      </>
    );
  };

  // Handle type click
  const handleTypeClick = (type: string) => {
    // Clear selected Pokémon only if it exists
    if (selectedPokemon.id !== null) {
      setSelectedPokemon({
        name: "",
        id: null,
        imageUrl: null,
      });
    }

    if (pokemonTypes.includes(type)) {
      // If the type is already selected, remove it
      const updatedTypes = pokemonTypes.filter((t) => t !== type);
  
      // If no types are selected, reset the pokemonTypes
      if (updatedTypes.length === 0) {
        setPokemonTypes([]); // Clear pokemonTypes array
      } else {
        setPokemonTypes(updatedTypes); // Update with remaining types
      }
    } else if (pokemonTypes.length < 2) {
      // If less than two types are selected, just add the new type
      setPokemonTypes([...pokemonTypes, type]);
    } else {
      // If two types are selected, replace the first selected type with the new type
      setPokemonTypes([pokemonTypes[1], type]);
    }
  };
  

  return (
    <div className="chart-pokemon-selector">
      <h2>Select a Pokémon</h2>
      
      {/* Wrapper for Input and Suggestion Box */}
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={selectedPokemon.name}
          onChange={handleInputChange}
          className="chart-pokemon-name"
          placeholder="Enter Pokémon name"
          onBlur={handleInputBlur}
          onFocus={() => {
            setSelectedPokemon({
              name: "",
              id: null,
              imageUrl: null
            });
            setSuggestions(allPokemon.map(pokemon => pokemon.name));
          }}
        />
        {suggestions.length > 0 && (
          <ul className="chart-suggestion-box" ref={suggestionBoxRef}>
            {suggestions.map((suggestion) => (
              <li key={suggestion} className="chart-suggestion" onClick={() => handleSuggestionClick(suggestion)}>
                {highlightMatch(suggestion, selectedPokemon.name)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Image Section */}
      <div className="image-section">
        {selectedPokemon.imageUrl ? (
          <img
            key={selectedPokemon.imageUrl}
            src={selectedPokemon.imageUrl}
            alt={selectedPokemon.name}
            className="selected-image"
          />
        ) : (
          <div className="substitute-placeholder" />
        )}
      </div>

      {/* Type Selection Section */}
      <div className="type-selection">
      <h2>or choose Type(s)</h2>
        <div className="type-images">
          {["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel"].map((type) => (
            <div
              key={type}
              className={`type-image ${pokemonTypes.includes(type) ? "selected" : ""}`}
              onClick={() => handleTypeClick(type)}
            >
              <img src={`/types/icons/${type}.png`} alt={type} />
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default PokemonSelector;
