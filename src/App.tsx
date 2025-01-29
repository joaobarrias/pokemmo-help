import React, { useState, useEffect, useRef } from "react";
import Select from 'react-select';  // Import react-select
import "./App.css"; // Import external CSS
import PokemonSelector from "./components/PokemonSelector/PokemonSelector";  // Import the PokemonSelector component
import Level from "./components/Level/Level";  // Import the Level component
import Status from "./components/Status/Status";  // Import the PokemonSelector component
import HP from "./components/HP/HP";  // Import the HP component
import PokeBall from "./components/PokeBall/PokeBall";  // Import the PokeBall component

const App = () => {
  const [pokemonInputValue, setPokemonInputValue] = useState("Pikachu");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [catchRate, setCatchRate] = useState<number | null>(null);
  const [pokemonImageUrl, setImageUrl] = useState<string | null>(null);
  const [allPokemon, setAllPokemon] = useState<{ name: string; id: number }[]>([]);
  const [isAlpha, setIsAlpha] = useState(false);
  const [hpPercent, setHpPercent] = useState<string | null>('100');
  const [isExactHp, setIsExactHp] = useState(false);
  const [hasInteractedWithCheckbox, setHasInteractedWithCheckbox] = useState(false);
  const [level, setLevel] = useState<string | null>('50');
  const [baseHP, setBaseHP] = useState<number | null>(null);
  const [currentHp, setCurrentHp] = useState<number | null>(null);
  const [averageHp, setAverageHp] = useState<number | null>(null);
  const [selectedPokeball, setSelectedPokeball] =  useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("None");
  const [hpBarPercentage, setHpBarPercentage] = useState<number>(100); 
  const suggestionBoxRef = useRef<HTMLUListElement | null>(null);
  const inputPokemonRef = useRef<HTMLInputElement | null>(null);
  const preloadedImages = useRef<Set<string>>(new Set());
  

  useEffect(() => { 
          if (!baseHP || !level) return;
          
          const levelValue = parseFloat(level);
          const avgHp = (((2 * baseHP + 15) * levelValue) / 100) + levelValue + 10;
          setAverageHp(avgHp);
          console.log("Base HP:", baseHP, "Level:", levelValue, "Average HP:", avgHp);
      }, [baseHP, level]);

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>PokeMMO Capture Chance Calculator</h1>
      </div>
  
      {/* Body */}
      <div className="body">
        {/* Main Container for Pokemon Input, Pokémon Image/Level, Status Condition and HP Section */}
        <div className="main-container">

          {/* Pokemon Selector Section & Checkbox Section */}
          <PokemonSelector
          setHasInteractedWithCheckbox={setHasInteractedWithCheckbox}
          pokemonImageUrl={pokemonImageUrl}
          setBaseHP={setBaseHP}
          setPokemonInputValue={setPokemonInputValue}
          allPokemon={allPokemon}
          setAllPokemon={setAllPokemon}
          pokemonInputValue={pokemonInputValue}
          suggestions={suggestions}
          setCatchRate={setCatchRate}
          setSuggestions={setSuggestions}
          isAlpha={isAlpha}
          setIsAlpha={setIsAlpha}
          hasInteractedWithCheckbox={hasInteractedWithCheckbox}
          setImageUrl={setImageUrl}
          catchRate={catchRate}
          suggestionBoxRef={suggestionBoxRef}
          inputPokemonRef={inputPokemonRef}
        />

          
          {/* Pokémon Image and Level Section*/}
          <Level level={level} setLevel={setLevel} pokemonImageUrl={pokemonImageUrl} pokemonInputValue={pokemonInputValue} isAlpha={isAlpha}/>
     
          {/* Status Section */}
          <Status selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}/>

          {/* HP Section */}
          <HP
            averageHp={averageHp}
            hpPercent={hpPercent}
            isExactHp={isExactHp}
            setHpPercent={setHpPercent}
            setIsExactHp={setIsExactHp}
            hpBarPercentage={hpBarPercentage}
            setCurrentHp={setCurrentHp}
            setHpBarPercentage={setHpBarPercentage}
          />
                    
        </div>
        
        {/* Second Container for Pokeball and Capture Chance Calculator */}
        <div className="second-container">
           
          {/* Pokéball Section */}
          <PokeBall preloadedImages={preloadedImages} selectedPokeball={selectedPokeball} setSelectedPokeball={setSelectedPokeball} />

        </div>
      </div>
    </div>
  );
};

export default App;
