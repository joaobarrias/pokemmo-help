// PokemonSelector.tsx
import React, { useEffect, useRef, useState } from "react";
import "./PokemonSelector.css";
import customRates from "../../data/custom-rates.json"; // Import custom rates for PokeMMO
import exclusivePokemonData from "../../data/pokemmo-condition.json"; // Import exclusive alpha catch rates
import { PokemonState } from '../../pages/CaptureChance/CaptureChance';

interface PokemonSelectorProps {
    pokemonState: PokemonState;
    setPokemonState: React.Dispatch<React.SetStateAction<PokemonState>>;
    isAlpha: boolean;
    setIsAlpha: React.Dispatch<React.SetStateAction<boolean>>;
    allPokemon: { name: string; id: number }[];
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({ 
  pokemonState, 
  setPokemonState, 
  isAlpha, 
  setIsAlpha,
  allPokemon
  }) => {

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [hasInteractedWithCheckbox, setHasInteractedWithCheckbox] = useState(false);
    const suggestionBoxRef = useRef<HTMLUListElement | null>(null);
    const inputPokemonRef = useRef<HTMLInputElement | null>(null);
    const alphaStateRef = useRef(isAlpha);

    useEffect(() => {
        // Keep the ref value in sync with the state
        alphaStateRef.current = isAlpha;
    }, [isAlpha]);
      
    useEffect(() => {
        // Check if 'isAlpha' checkbox is being checker/unchecked
        if (isAlpha) {
          const pokemonName = pokemonState.name.toLowerCase();
          const alphaCatchRates = exclusivePokemonData.alpha as Record<string, number>;
          const catchRateToUse = alphaCatchRates[pokemonName] ?? alphaCatchRates.default;
        
          setPokemonState((prevState) => ({ ...prevState, catchRate: catchRateToUse }));
        }
        // Only fetch data if the checkbox hasn't been checked (alpha state is false)
        else if (hasInteractedWithCheckbox) {
          fetchPokemonData(pokemonState.name);
        }
      }, [isAlpha, hasInteractedWithCheckbox]); // Run when 'isAlpha' or 'hasInteractedWithCheckbox' changes

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    
    // Fetch selected pokemon data
    const fetchPokemonData = async (name: string) => {
        if (!name.trim()) return; // Don't fetch if the name is empty
        try {
        let apiName = name.toLowerCase();
        let catchRateToUse: number | null = null;
        let speciesData: any = null;
        // First, check if the Pokémon is an Alpha Pokémon and handle the catch rate
        if (alphaStateRef.current) {
          const alphaCatchRates = exclusivePokemonData.alpha as Record<string, number>;
          catchRateToUse = alphaCatchRates[apiName] ?? alphaCatchRates.default;
        } else {
            // If not an Alpha Pokémon, use the normal fetch
            const customCatchRate = customRates[apiName as keyof typeof customRates]?.catchRate;
            const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${apiName}`
            );
            if (!response.ok) throw new Error("Pokémon not found in species endpoint");
            speciesData = await response.json(); // Get species data from the API
    
            // Use the custom catch rate if available, otherwise use the PokeAPI one
            catchRateToUse = customCatchRate !== undefined ? customCatchRate : speciesData.capture_rate;
        }
    
        setPokemonState((prevState) => ({ ...prevState, catchRate: catchRateToUse }));
    
        // Fetch the Pokémon's data (e.g., image) using the correct variant
        const forms = speciesData?.varieties.map((variety: { pokemon: { name: string } }) => variety.pokemon.name);
    
        if (forms?.includes(`${apiName}-standard`)) {
            apiName = `${apiName}-standard`;
        } else {
            apiName = forms ? forms[0] : apiName; // Ensure there's a fallback to the original apiName
        }
    
        // Now fetch the Pokémon's data (e.g., image)
        const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${apiName}`
        );
        if (!pokemonResponse.ok) throw new Error("Pokemon not found");
    
        const pokemonData = await pokemonResponse.json();

        // Map through the types and handle the "fairy" type conversion.
        const transformedTypes = pokemonData.types.map((type: { type: { name: string } }, index: number) => {
          const typeName = type.type.name;
          if (typeName === 'fairy') {
            // If the type is fairy and it's the only type, replace it with "normal".
            // If it's the first type (index === 0), replace it with "normal".
            if (pokemonData.types.length === 1 || index === 0) {
              return 'normal';
            }
            // If it's the second type (index === 1), remove it (return null to filter it out later).
            return null;
          }
          return typeName;
        }).filter(Boolean);

        setPokemonState({
          name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
          id: pokemonData.id,
          stats: {
            hp: pokemonData.stats.find((stat: any) => stat.stat.name === "hp")?.base_stat || null,
            speed: pokemonData.stats.find((stat: any) => stat.stat.name === "speed")?.base_stat || null,
            weight: pokemonData.weight || null,
          },
          imageUrl: pokemonData.sprites.front_default,
          catchRate: catchRateToUse,
          types: transformedTypes,
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
        setIsAlpha(!isAlpha); // Toggle the checkbox state
        setHasInteractedWithCheckbox(true); // Mark as interacted with checkbox
    };

    const handleSuggestionClick = (name: string) => {
        setPokemonState((prevState) => ({ ...prevState, name })); // Set the input value to the clicked suggestion
        setSuggestions([]); // Clear suggestions
        fetchPokemonData(name); // Fetch the Pokémon data for the clicked suggestion
        inputPokemonRef.current?.blur();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim().toLowerCase();
        setPokemonState((prevState) => ({ ...prevState, name: value }));
        const filtered = allPokemon.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(value.toLowerCase())
        );
  
        // Check if there's an exact match
        const exactMatch = filtered.some(
          (pokemon) => pokemon.name.toLowerCase() === value.toLowerCase()
        );
  
        if (exactMatch) {
          // If there's an exact match, clear suggestions and fetch data
          setSuggestions([]);
          const formattedName = formatPokemonName(value);
          setPokemonState((prevState) => ({ ...prevState, name: formattedName }));
          fetchPokemonData(value);
          inputPokemonRef.current?.blur(); // Unfocus the input text
        } else {
          // Otherwise, show filtered suggestions
          setSuggestions(filtered.map(pokemon => pokemon.name));
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
          setPokemonState((prevState) => ({ ...prevState, name: "Pikachu" }))
          fetchPokemonData("Pikachu");
          setSuggestions([]);
      }
    };
    
    const handleInputBlur = () => {
      // Only reset to Pikachu if the user has not written a valid suggestion
      if (pokemonState.name.trim() && !suggestions.length) {
          const isValidPokemon = allPokemon.some(
          (pokemon) => pokemon.name.toLowerCase() === pokemonState.name.trim().toLowerCase()
          );
          if (!isValidPokemon) {
          setPokemonState((prevState) => ({ ...prevState, name: "Pikachu" }))
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
            <b>{bold}</b>
            {after}
        </>
        );
    };
        
    const formatPokemonName = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
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
                setSuggestions(allPokemon.map(pokemon => pokemon.name));
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
