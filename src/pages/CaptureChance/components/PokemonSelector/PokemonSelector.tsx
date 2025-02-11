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
        let pokemonName = name.toLowerCase().replace(' ', '-').replace('.', '');
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
      const pokemonName = pokemonState.name.toLowerCase().replace(' ', '-').replace('.', '');
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
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.trim();
      const value = input ? input.charAt(0).toUpperCase() + input.slice(1).toLowerCase() : ""; 
      setPokemonState((prevState) => ({ ...prevState, name: value }));
      if (!value) {
        // If the input is empty, show the entire list of Pokémon
        setSuggestions(filteredPokemon.map(pokemon => pokemon.name));
        return;
      }
      
      const matches = filteredPokemon
      .filter(pokemon => pokemon.name.includes(value))
      .map(pokemon => pokemon.name);

      // Check if there's an exact match
      const exactMatch = matches.some(
        (pokemon) => pokemon === value
      );

      if (exactMatch) {
        // If there's an exact match, clear suggestions and fetch data
        setSuggestions([]);
        fetchPokemonData(value);
        inputPokemonRef.current?.blur(); // Unfocus the input text
      } else {
        // Otherwise, show filtered suggestions
        setSuggestions(matches);
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      // Reset to Pikachu if the user has clicked out of the input text
      if (
        inputPokemonRef.current &&
        suggestionBoxRef.current &&
        !inputPokemonRef.current.contains(e.target as Node) &&
        !suggestionBoxRef.current.contains(e.target as Node)
      ) {
        fetchPokemonData("Pikachu");
        setSuggestions([]);
      }
    };
    
    const handleInputBlur = () => {
      // Only reset to Pikachu if the user has not written a valid suggestion
      if (pokemonState.name.trim() && !suggestions.length) {
        const isValidPokemon = filteredPokemon.some(
        (pokemon) => pokemon.name.toLowerCase() === pokemonState.name.trim().toLowerCase()
        );
        if (!isValidPokemon) {
          fetchPokemonData("Pikachu");
        }
      }
    };

    const highlightMatch = (name: string, match: string) => {
      const index = name.toLowerCase().indexOf(match.toLowerCase());
      if (index === -1) return name;
  
      const before = name.slice(0, index);
      const bold = name.slice(index, index + match.length);
      const after = name.slice(index + match.length);
  
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
