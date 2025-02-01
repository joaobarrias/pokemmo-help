// PokemonSelector.tsx
import React, { useEffect, useRef } from "react";
import "./PokemonSelector.css";
import customRates from "../../data/custom-rates.json"; // Import custom rates for PokeMMO
import excludedPokemonData from "../../data/excluded-pokemons.json"; // Import pokemons name that don't exist in PokeMMO

interface PokemonSelectorProps {
    pokemonInputValue: string;
    setBaseHP: React.Dispatch<React.SetStateAction<number | null>>;
    setWeight: React.Dispatch<React.SetStateAction<number | null>>;
    setBaseSpeed: React.Dispatch<React.SetStateAction<number | null>>;
    setPokemonInputValue: React.Dispatch<React.SetStateAction<string>>;
    suggestions: string[];
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
    isAlpha: boolean;
    setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
    setCatchRate:  React.Dispatch<React.SetStateAction<number | null>>;
    hasInteractedWithCheckbox:  boolean;
    setHasInteractedWithCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAlpha: React.Dispatch<React.SetStateAction<boolean>>;
    catchRate: number | null;
    pokemonImageUrl: string | null;
    suggestionBoxRef: React.RefObject<HTMLUListElement>
    inputPokemonRef: React.RefObject<HTMLInputElement>;
    allPokemon: { name: string; id: number }[];
    setAllPokemon: (allPokemon: { name: string; id: number }[]) => void; 
    setTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({ setTypes, setWeight, setBaseSpeed, setHasInteractedWithCheckbox, pokemonImageUrl, setBaseHP, setPokemonInputValue, allPokemon, setAllPokemon, pokemonInputValue, suggestions, setCatchRate, setSuggestions, isAlpha, setIsAlpha, hasInteractedWithCheckbox, setImageUrl, catchRate, suggestionBoxRef, inputPokemonRef}) => {
    const alphaStateRef = useRef(isAlpha);
    useEffect(() => {
        // Fetch all Pokémon from Gen 1–5 on initial load and grab Pikachu data
        fetchAllPokemon();
        fetchPokemonData("Pikachu");
    }, []);

    useEffect(() => {
        // Keep the ref value in sync with the state
        alphaStateRef.current = isAlpha;
    }, [isAlpha]);
      
    useEffect(() => {
        // Check if 'isAlpha' checkbox is being checker/unchecked
        if (isAlpha) {
          let catchRateToUse: number | null = null;
          // Special case for Tyranitar
          if (pokemonInputValue.toLowerCase() === 'tyranitar') {
            catchRateToUse = 5;
          } else if ( // Special case for Roaming Legendaries, that are raid exclusive
            ['suicune', 'moltres', 'raikou', 'articuno', 'zapdos', 'entei'].includes(pokemonInputValue.toLowerCase())
          ) {
            catchRateToUse = 0;
          } else {
            catchRateToUse = 10;
          }
          setCatchRate(catchRateToUse);
        }
        // Only fetch data if the checkbox hasn't been checked (alpha state is false)
        else if (hasInteractedWithCheckbox) {
          fetchPokemonData(pokemonInputValue);
        }
      }, [isAlpha, hasInteractedWithCheckbox]); // Run when 'isAlpha' or 'hasInteractedWithCheckbox' changes

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch required pokemon data from gen 1 to gen 5
    const fetchAllPokemon = async () => {
        try {
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
    
        // Filter out excluded Pokémon
        const excludePokemon = excludedPokemonData.excludePokemon;
        const filteredPokemonList = pokemonList.filter(
          (pokemon) => !excludePokemon.includes(pokemon.name.toLowerCase())
        );
    
        setAllPokemon(filteredPokemonList.sort((a, b) => a.id - b.id));
            } catch (err) {
            console.error("Failed to fetch Pokémon list:", err);
        }
    };
    
    // Fetch selected pokemon data
    const fetchPokemonData = async (name: string) => {
        if (!name.trim()) return; // Don't fetch if the name is empty
        try {
        let apiName = name.toLowerCase();
        let catchRateToUse: number | null = null;
        let speciesData: any = null;
        // First, check if the Pokémon is an Alpha Pokémon and handle the catch rate
        if (alphaStateRef.current) {
            // Special case for Tyranitar
            if (apiName === 'tyranitar') {
            catchRateToUse = 5; 
            } else if // Special case for Roaming Legendaries, that are raid exclusive
            (apiName === 'suicune' || apiName === 'moltres' || apiName === 'raikou' || apiName === 'articuno' || apiName === 'zapdos' || apiName === 'entei') {
            catchRateToUse = 0;
            } else {
            catchRateToUse = 10;
            }
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
    
        setCatchRate(catchRateToUse);
    
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

        setTypes(transformedTypes);
        setWeight(pokemonData.weight);
        setBaseSpeed(pokemonData.stats.find((stat: { stat: { name: string } }) => stat.stat.name === 'speed')?.base_stat);
        setBaseHP(pokemonData.stats.find((stat: any) => stat.stat.name === 'hp')?.base_stat);
        setImageUrl(pokemonData.sprites.front_default);
        } catch (err) {
        setTypes([]);
        setWeight(null);
        setBaseSpeed(null);
        setBaseHP(null);
        setCatchRate(null);
        setImageUrl(null);
        }
    };

    const handleCheckboxChange = () => {
        setIsAlpha(!isAlpha); // Toggle the checkbox state
        setHasInteractedWithCheckbox(true); // Mark as interacted with checkbox
    };

    const handleSuggestionClick = (name: string) => {
        setPokemonInputValue(name); // Set the input value to the clicked suggestion
        setSuggestions([]); // Clear suggestions
        fetchPokemonData(name); // Fetch the Pokémon data for the clicked suggestion
        inputPokemonRef.current?.blur();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPokemonInputValue(value);
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
          setPokemonInputValue(formattedName);
          fetchPokemonData(value);
          inputPokemonRef.current?.blur(); // Unfocus the input text
        } else {
          // Otherwise, show filtered suggestions
          setSuggestions(filtered.map(pokemon => pokemon.name));
          setTypes([]);
          setWeight(null);
          setBaseSpeed(null);
          setBaseHP(null);
          setCatchRate(null);
          setImageUrl(null);
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
          setPokemonInputValue("Pikachu");
          fetchPokemonData("Pikachu");
          setSuggestions([]);
      }
    };
    
    const handleInputBlur = () => {
      // Only reset to Pikachu if the user has not written a valid suggestion
      if (pokemonInputValue.trim() && !suggestions.length) {
          const isValidPokemon = allPokemon.some(
          (pokemon) => pokemon.name.toLowerCase() === pokemonInputValue.trim().toLowerCase()
          );
          if (!isValidPokemon) {
          setPokemonInputValue("Pikachu");
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
    <div className="pokemon-container">
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
              value={pokemonInputValue}
              onChange={handleInputChange}
              placeholder="Enter Pokémon name"
              className="pokemon-name"
              onBlur={handleInputBlur}
              onFocus={() => {
                setPokemonInputValue("");
                setTypes([]);
                setWeight(null);
                setBaseSpeed(null);
                setBaseHP(null);
                setCatchRate(null);
                setImageUrl(null);
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
                    {highlightMatch(suggestion, pokemonInputValue)}
                  </li>
                ))}
              </ul>
            )}
            {/* Pokémon Catch Rate */}
            <div className="pokemon-info">
              <p className="catch-rate">
                Catch Rate: {catchRate !== null ? catchRate : ""}
              </p>
            </div>
          </div>
  );
};

export default PokemonSelector;
