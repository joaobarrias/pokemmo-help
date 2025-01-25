import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Import external CSS
import customRates from './assets/custom-rates.json'; // Import your custom rates
import { pokeballs } from "./assets/pokeballs";

const App = () => {
  const [inputValue, setInputValue] = useState("Pikachu");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [catchRate, setCatchRate] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [allPokemon, setAllPokemon] = useState<{ name: string; id: number }[]>([]);
  const [isAlpha, setIsAlpha] = useState(false);  // Manage the checkbox state
  const [hpPercent, setHpPercent] = useState<string | null>('100'); // Initially set to '100' as a string
  const [isExactHp, setIsExactHp] = useState(false);
  const suggestionBoxRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hasInteractedWithCheckbox, setHasInteractedWithCheckbox] = useState(false);
  const [level, setLevel] = useState<string | null>('70'); // Start with level 70
  const alphaStateRef = useRef(isAlpha);
  const [pokeballImages, setPokeballImages] = useState<{ [key: string]: string }>({});
  const [selectedPokeball, setSelectedPokeball] = useState<string>('');

  useEffect(() => {
    // Fetch all Pokémon from Gen 1–5 on initial load
    fetchAllPokemon();
    fetchPokemonData("Pikachu");
    fetchPokeballImages();
  }, []);

  const fetchPokeballImages = async () => {
    const images: { [key: string]: string } = {};

    for (const ballName of Object.keys(pokeballs)) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/item/${ballName}`);
        const data = await response.json();
        images[ballName] = data.sprites.default || '';
      } catch (error) {
        console.error(`Failed to fetch image for ${ballName}`, error);
      }
    }

    setPokeballImages(images);
  };

  const handlePokeballChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPokeball(event.target.value);
  };


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

      const excludePokemon = [
        "heatran", "deoxys", "mewtwo", "mew", "lugia", "ho-oh", "celebi", "regirock", "regice", "registeel",
        "latias", "latios", "kyogre", "groudon", "rayquaza", "jirachi", "uxie", "mesprit", "azelf", "dialga",
        "palkia", "regigigas", "giratina", "cresselia", "phione", "manaphy", "darkrai", "shaymin", "arceus", "victini",
        "cobalion", "terrakion", "virizion", "tornadus", "thundurus", "reshiram", "zekrom", "landorus", "kyurem", "keldeo",
        "meloetta", "genesect", ""
      ];
      

      // Filter out excluded Pokémon
      const filteredPokemonList = pokemonList.filter(
        (pokemon) => !excludePokemon.includes(pokemon.name.toLowerCase())
      );

      setAllPokemon(filteredPokemonList.sort((a, b) => a.id - b.id));
    } catch (err) {
      console.error("Failed to fetch Pokémon list:", err);
    }
  };

  const fetchPokemonData = async (name: string) => {
    if (!name.trim()) return; // Don't fetch if the name is empty
    try {
      let apiName = name.toLowerCase();
      let catchRateToUse: number | null = null; // Explicitly state this can be a number or null
      let speciesData: any = null; // Declare speciesData
      // First, check if the Pokémon is an Alpha Pokémon and handle the catch rate
      if (alphaStateRef.current) {
        // Special case for Tyranitar
        if (apiName === 'tyranitar') {
          catchRateToUse = 5;
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
      const imageResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${apiName}`
      );
      if (!imageResponse.ok) throw new Error("Image not found");

      const imageData = await imageResponse.json();
      setImageUrl(imageData.sprites.front_default);
    } catch (err) {
      setCatchRate(null);
      setImageUrl(null);
    }
  };
  
  const formatPokemonName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setSuggestions(allPokemon.map(pokemon => pokemon.name));
      setCatchRate(null);
      setImageUrl(null);
    } else {
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
        setInputValue(formattedName);
        fetchPokemonData(value);
        inputRef.current?.blur(); // Unfocus the input
      } else {
        // Otherwise, show filtered suggestions
        setSuggestions(filtered.map(pokemon => pokemon.name));
        setCatchRate(null);
        setImageUrl(null);
      }
    }
  };

  useEffect(() => {
    // Keep the ref value in sync with the state
    alphaStateRef.current = isAlpha;
  }, [isAlpha]);

  const handleClickOutside = (e: MouseEvent) => {
    console.log("entrou");
    if (
      inputRef.current &&
      suggestionBoxRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      !suggestionBoxRef.current.contains(e.target as Node)
    ) {
      console.log("entrou2");
      // Check if the input matches any valid Pokémon name
      const isValidPokemon = allPokemon.some(
        (pokemon) => pokemon.name.toLowerCase() === inputValue.trim().toLowerCase()
      );
      console.log("entrou3");
      if (!isValidPokemon) {
        console.log("entrou4");
        setInputValue("Pikachu");
        fetchPokemonData("Pikachu");
      }
  
      setSuggestions([]);
    }
  };

  const handleInputBlur = () => {
    // Only reset to Pikachu if the user has not clicked a valid suggestion
    if (inputValue.trim() && !suggestions.length) {
      const isValidPokemon = allPokemon.some(
        (pokemon) => pokemon.name.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (!isValidPokemon) {
        setInputValue("Pikachu");
        fetchPokemonData("Pikachu");
      }
    }
  };

  const handleSuggestionClick = (name: string) => {
      setInputValue(name); // Set the input value to the clicked suggestion
      setSuggestions([]); // Clear suggestions
      fetchPokemonData(name); // Fetch the Pokémon data for the clicked suggestion
      inputRef.current?.blur();
  };

  const handleCheckboxChange = () => {
    setIsAlpha(!isAlpha); // Toggle the checkbox state
    setHasInteractedWithCheckbox(true); // Mark as interacted with checkbox
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow clearing the field
    if (value === "") {
      setLevel(null); // Set to null when input is empty
      return;
    }

    // Ensure the value is a valid integer between 1 and 100
    if (/^\d*$/.test(value)) { // Allow only digits (no decimals)
      const numValue = parseInt(value, 10);
      if (numValue >= 1 && numValue <= 100) {
        setLevel(numValue.toString()); // Update the level
      }
    }
  };

  const handleLevelBlur = () => {
    // If the input is empty or out of range, set level to 100
    if (level === '' || level === null) {
      setLevel('70');
    }
  };

  const handleExactHpToggle = () => {
    setIsExactHp(true);
  };

  const handleHpPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Allow clearing the field
    if (value === "") {
      setHpPercent(null); // Set to null when input is empty
      return;
    }
  
    // Replace commas with dots for decimal numbers (if applicable)
    value = value.replace(',', '.');
  
    // Remove leading zeros but keep 0 as a valid number
    if (/^0+/.test(value) && value.length > 1) {
      // If the value is 0. or 0.something, don't remove the leading zero
      if (value === "0." || value.startsWith("0.") && value.length > 2) {
        // Keep it as is
      } else {
        value = value.replace(/^0+/, "");
      }
    }
  
    // Check if the input matches the pattern for up to 1 decimal place (including trailing dot)
    if (/^\d{1,3}(\.\d{0,1})?$/.test(value)) {
      // If the value ends with a dot (e.g., "4."), keep it in the string form
      if (value.endsWith('.')) {
        // Update state with the current value (still a string)
        setHpPercent(value); // Keep it as a string
        return;
      } else {
        // Convert to a number if the input is valid
        let numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          // Clamp the value between 0 and 100
          numericValue = Math.max(0, Math.min(100, numericValue));
  
          // Ensure only 1 decimal place
          numericValue = parseFloat(numericValue.toFixed(1));
  
          // Update the state with the valid value
          setHpPercent(numericValue.toString()); // Convert back to string
        }
      }
    }
  };

  const handleHpBlur = () => {
    // If hpPercent is null or empty, set it to 0.1
    let correctedValue: number = hpPercent === null || hpPercent === "" ? 0.1 : parseFloat(hpPercent);
  
    // If the value is NaN (invalid input), fallback to 0.1
    if (isNaN(correctedValue) || correctedValue == 0) {
      correctedValue = 0.1;
    }
  
    // Clamp the value between 0 and 100
    correctedValue = Math.max(0, Math.min(100, correctedValue));
  
    // Ensure only 1 decimal place
    correctedValue = parseFloat(correctedValue.toFixed(1));
  
    // Update the state with the corrected value, converted back to a string
    setHpPercent(correctedValue.toString());
  };
  
  useEffect(() => {
    console.log("State updated to:", hpPercent);
  }, [hpPercent]);

  useEffect(() => {
    // Only fetch data if the checkbox has been interacted with
    if (hasInteractedWithCheckbox) {
      fetchPokemonData(inputValue);
    }
  }, [isAlpha, hasInteractedWithCheckbox]); // This effect will run when 'isAlpha' or 'hasInteractedWithCheckbox' changes
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>PokeMMO Capture Chance Calculator</h1>
      </div>
  
      {/* Main Section with Input and Pokémon Info */}
      <div className="input-section">
        {/* Main Container for Input, Pokémon Image, and Pokéball */}
        <div className="main-container">
          {/* Checkbox Section */}
          <div className="checkbox-container">
            <label className="checkbox-label">
            <input
                type="checkbox"
                className="checkbox"
                checked={isAlpha} // Bind checkbox state to isAlpha
                onChange={handleCheckboxChange}  // Update the state on checkbox toggle
              />
              Alpha Pokémon?
            </label>
          </div>
          {/* Input Section */}
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter Pokémon name"
              className="input"
              onBlur={handleInputBlur}
              onFocus={() => {
                setInputValue("");
                setImageUrl(null);
                setCatchRate(null);
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
                    {highlightMatch(suggestion, inputValue)}
                  </li>
                ))}
              </ul>
            )}
            {/* Pokémon Image and Catch Rate */}
            <div className="pokemon-info">
              <p className="catch-rate">
                Catch Rate: {catchRate !== null ? catchRate : ""}
              </p>
            </div>
          </div>
            
          <div className="input-and-level-container">
          {/* Pokémon Image */}
            <div className={`input-and-image ${isAlpha ? 'alpha-active' : ''}`}>
              {isAlpha && <div className="alpha-background"></div>} {/* Smoke background */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={inputValue}
                  className="pokemon-image"
                />
              ) : (
                <div className="pokemon-image"></div>
              )}
            </div>
            <div className="level-input-container">
            <label className="level-label" htmlFor="level">Level</label>
            <input
              id="level"
              type="text"
              className="level-input"
              value={level !== null ? level : ""}
              onChange={handleLevelChange}
              onBlur={handleLevelBlur} // Trigger level reset on blur if out of range or empty
              onFocus={(e) => e.target.select()}
            />
          </div>
          </div>
     
          {/* HP Section */}
          <div className="hp-section">
            <label className="hp-label">Current HP</label>
            <div className="hp-options">
              <div className="hp-toggle">
                <label>
                  <input
                    type="radio"
                    name="hp-option"
                    checked={!isExactHp}
                    onChange={() => setIsExactHp(false)}
                  />
                  <input
                    type="text"
                    value={hpPercent !== null ? hpPercent : ""}  // Fallback to empty string when null
                    onChange={handleHpPercentChange}  // Use onChange to capture and format input immediately
                    onBlur={handleHpBlur}
                    disabled={isExactHp}
                    onFocus={(e) => e.target.select()}
                  />
                  <span> % HP left</span>
                </label>
              </div>
              <div className="hp-toggle">
                <label>
                  <input
                    type="radio"
                    name="hp-option"
                    checked={isExactHp}
                    onChange={handleExactHpToggle}
                  />
                  Exactly 1 HP (using False Swipe)
                </label>
              </div>

               {/* Pokéball Section - Move this below HP Section */}
              <div className="pokeball-section">
                <label htmlFor="pokeball-select" className="pokeball-label">
                  Ball
                </label>
                <select
                  id="pokeball-select"
                  value={selectedPokeball}
                  onChange={handlePokeballChange}
                  className="pokeball-dropdown"
                >
                  <option value="" disabled>Select a Pokéball</option>
                  {Object.keys(pokeballs).map((ballName) => (
                    <option key={ballName} value={ballName}>
                      {pokeballImages[ballName] && (
                        <img 
                          src={pokeballImages[ballName]} 
                          alt={ballName} 
                          className="pokeball-icon" 
                        />
                      )}
                      {ballName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
