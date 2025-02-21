// Component: PokemonSelector.tsx
import React, { useEffect, useRef, useState } from "react";
import "./PokemonSelector.css"; // Import CSS
import exclusiveAlphaData from "../../../../data/alpha-rates.json"; // Import exclusive alpha catch rates
import pokemmoData from "../../../../data/pokemmo-data.json"; // Import all PokeMMO data
import { PokemonState } from '../../CaptureChance'; // Import current pokemon object

interface PokemonSelectorProps {
  pokemonState: PokemonState;
  setPokemonState: React.Dispatch<React.SetStateAction<PokemonState>>;
  isAlpha: boolean;
  setIsAlpha: React.Dispatch<React.SetStateAction<boolean>>;
  filteredPokemon: { name: string; id: number }[];
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({ 
  pokemonState, 
  setPokemonState, 
  isAlpha, 
  setIsAlpha,
  filteredPokemon
  }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const isFetchingDataRef = useRef(false);
    const [hasInteractedWithCheckbox, setHasInteractedWithCheckbox] = useState(false);
    const suggestionBoxRef = useRef<HTMLUListElement | null>(null);
    const inputPokemonRef = useRef<HTMLInputElement | null>(null);
    const alphaStateRef = useRef(isAlpha);

    useEffect(() => {
      // Keep the ref value in sync with the state
      alphaStateRef.current = isAlpha;
    }, [isAlpha]); // Dependencies
      
    useEffect(() => {
      const pokemonName = pokemonState.name.toLowerCase().replace(' ', '-').replace('.', '');
      const pokemon = (pokemmoData as any)[pokemonName];
      // Check if 'isAlpha' checkbox is being checker/unchecked
      if (isAlpha) {
        const alphaCatchRates = exclusiveAlphaData.alpha as Record<string, number>;
        const catchRateToUse = alphaCatchRates[pokemonName] ?? alphaCatchRates.default;
        setPokemonState((prevState) => ({ ...prevState, catchRate: catchRateToUse }));
      }
      // Only fetch capture rate if the checkbox is unchecked (alpha state is false)
      else if (hasInteractedWithCheckbox) {
          setPokemonState((prevState) => ({ ...prevState, catchRate: pokemon.capture_rate }));
      }
    }, [isAlpha, hasInteractedWithCheckbox]); // Dependencies

    
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
        let catchRateToUse: number | null = null;
        let pokemon = (pokemmoData as any)[pokemonName];
        if (!pokemon) {
          throw new Error('Pokémon data not found');
        }

        // Check if the Pokémon is an Alpha Pokémon and handle the catch rate
        if (alphaStateRef.current) {
          if (pokemon.alpha == "yes"){
            const alphaCatchRates = exclusiveAlphaData.alpha as Record<string, number>;
            catchRateToUse = alphaCatchRates[pokemonName] ?? alphaCatchRates.default;
          }
          else{
            setIsAlpha(!isAlpha);
            catchRateToUse = pokemon.capture_rate;
          } 
        } else {
          catchRateToUse = pokemon.capture_rate;
        }
        
        setPokemonState({
          name: name,
          id: pokemon.id,
          stats: {
            hp: pokemon.stats.base_hp,
            speed: pokemon.stats.base_speed,
            weight: pokemon.weight,
          },
          imageUrl: pokemon.sprites.default,
          catchRate: catchRateToUse,
          types: pokemon.types,
      });
      } catch (err) {
        setPokemonState({
          name: "",
          id: null,
          stats: { hp: null, speed: null, weight: null },
          imageUrl: null,
          catchRate: null,
          types: [],
        });
      }
    };
    
    const handleCheckboxChange = () => {
      const pokemonName = pokemonState.name.toLowerCase().replace(' ', '-');
      const pokemon = (pokemmoData as any)[pokemonName];
      // Check if 'isAlpha' checkbox is being checker/unchecked
      if (pokemon.alpha == "yes"){
        setIsAlpha(!isAlpha);
        setHasInteractedWithCheckbox(true);
      } 
    };

    const handleSuggestionClick = (name: string) => {
      setSuggestions([]); // Clear suggestions
      fetchPokemonData(name); // Fetch the Pokémon data for the clicked suggestion
      inputPokemonRef.current?.blur();
      isFetchingDataRef.current = false;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      setPokemonState((prevState) => ({ ...prevState, name: rawValue })); // Update input state
    
      if (!rawValue.trim()) {
        setSuggestions(filteredPokemon.map((pokemon) => pokemon.name)); // Show all if empty
        return;
      }
    
      // Normalize input: Replace spaces with hyphens for consistency
      const normalizedInput = rawValue.toLowerCase().replace(" ", "-");

      // Filter Pokémon names based on the normalized input
      const matches = filteredPokemon
        .filter((pokemon) =>
          pokemon.name.toLowerCase().replace(" ", "-").includes(normalizedInput)
        )
        .map((pokemon) => pokemon.name);

      // Find Pokémon whose name **starts** with the input (for auto-selection logic)
      const prefixMatches = matches.filter((name) =>
        name.toLowerCase().replace(" ", "-").startsWith(normalizedInput)
      );

      // Find an exact match using normalized input
      const exactMatch = filteredPokemon.find(
        (pokemon) =>
          pokemon.name.toLowerCase().replace(" ", "-") === normalizedInput
      );

      if (exactMatch) {
        // If there's an exact match and only one prefix match (meaning we can auto-select)
        if (prefixMatches.length === 1) {
          setSuggestions([]); // Clear suggestions if there's only one match
          fetchPokemonData(exactMatch.name); // Fetch data for that Pokémon
          inputPokemonRef.current?.blur(); // Unfocus input field
          isFetchingDataRef.current = false;
        } else {
          setSuggestions(prefixMatches); // Keep suggestions open if there are multiple matches
          fetchPokemonData(prefixMatches[0]); // Fetch data for the first match
        }
      } else {
        setSuggestions(matches); // Show all matches if no exact match is found
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      // Check if the user clicked outside the input or the suggestion box
      if (
        inputPokemonRef.current &&
        suggestionBoxRef.current &&
        !inputPokemonRef.current.contains(e.target as Node) &&
        !suggestionBoxRef.current.contains(e.target as Node)
      ) {
        // Only clear suggestions if there are any
        setSuggestions([])
        if (isFetchingDataRef.current){
          isFetchingDataRef.current = false;
          return;
        }
        else{
          fetchPokemonData("Pikachu");
          isFetchingDataRef.current = false
        }
      }
    };
    
    const handleInputBlur = () => {
      // Only reset to Pikachu if the user has not written a valid suggestion
      if (pokemonState.name.trim() && !suggestions.length) {
        const isValidPokemon = filteredPokemon.some(
          (pokemon) => pokemon.name.trim().toLowerCase().replace(" ", "-") === pokemonState.name.trim().toLowerCase().replace(" ", "-")
        );
        if (!isValidPokemon) {
          fetchPokemonData("Pikachu");
          isFetchingDataRef.current = false
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
    
  return (
    <div className="pokemon-section">
      {/* Alpha Checkbox */}
      <label className="checkbox-label">
      <input
          type="checkbox"
          className="checkbox"
          checked={isAlpha}
          onChange={handleCheckboxChange}
        />
        Alpha Pokémon?
      </label>
      {/* Pokemon Input Text */}
      <input
        ref={inputPokemonRef}
        type="text"
        value={pokemonState.name}
        onChange={handleInputChange}
        className="pokemon-name"
        placeholder="Enter Pokémon name"
        onBlur={handleInputBlur}
        onFocus={() => {
          setPokemonState({
            name: "",
            id: null,
            stats: { hp: null, speed: null, weight: null },
            imageUrl: null,
            catchRate: null,
            types: [],
          });
          setSuggestions(filteredPokemon.map(pokemon => pokemon.name));
        }}
      />
      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <ul className="suggestion-box" ref={suggestionBoxRef}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {highlightMatch(suggestion, pokemonState.name)}
            </li>
          ))}
        </ul>
      )}
      {/* Pokémon Catch Rate */}
      <div className="pokemon-info">
        <p className="catch-rate">
          Catch Rate: {pokemonState.catchRate !== null ? pokemonState.catchRate : ""}
        </p>
      </div>
    </div>
  );
};

export default PokemonSelector;
