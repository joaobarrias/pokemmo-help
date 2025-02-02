// Page: CaptureChance.tsx
import { useState, useEffect, useRef } from "react";
import "../App.css"; // Import external CSS
import PokemonSelector from "../components/PokemonSelector/PokemonSelector";  // Import the PokemonSelector component
import ImageAndLevel from "../components/ImageAndLevel/ImageAndLevel";  // Import the Level component
import Status from "../components/Status/Status";  // Import the PokemonSelector component
import HP from "../components/HP/HP";  // Import the HP component
import PokeBall from "../components/PokeBall/PokeBall";  // Import the PokeBall component
import CaptureCalc from "../components/CaptureCalc/CaptureCalc";  // Import the PokeBall component


// Define types for the state
export interface PokemonStats {
  hp: number | null;
  speed: number | null;
  weight: number | null;
}

export interface PokemonState {
  name: string;
  id: number | null;
  stats: PokemonStats;
  imageUrl: string | null;
  catchRate: number | null;
  types: string[];
}

const CaptureChance = () => {
  const [pokemonState, setPokemonState] = useState<PokemonState>({
    name: "Pikachu",
    id: null,
    stats: { hp: null, speed: null, weight: null },
    imageUrl: null,
    catchRate: null,
    types: [],
  });
  const [level, setLevel] = useState<string | null>('50');
  const [currentHp, setCurrentHp] = useState<number | null>(null);
  const [averageHp, setAverageHp] = useState<number | null>(null);
  const [selectedPokeball, setSelectedPokeball] =  useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);
  const [isAlpha, setIsAlpha] = useState(false);

  useEffect(() => { 
          if (!pokemonState.stats.hp || !level) return;
          
          const levelValue = parseFloat(level);
          const avgHp = Math.floor((((2 * pokemonState.stats.hp + 15.5) * levelValue) / 100) + levelValue + 10);
          setAverageHp(avgHp);
          console.log("Base HP:", pokemonState.stats.hp, "Level:", levelValue, "Average HP:", avgHp);
      }, [pokemonState, level]);

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>Capture Chance Calculator</h1>
      </div>
  
      {/* Body */}
      <div className="body">
        {/* Main Container for Pokemon Input, Pokémon Image/Level, Status Condition and HP Section */}
        <div className="main-container">

          {/* Pokemon Section*/}
          <PokemonSelector    
          pokemonState={pokemonState}
          setPokemonState={setPokemonState}
          isAlpha={isAlpha}
          setIsAlpha={setIsAlpha}
        />

          
          {/* Pokémon Image and Level Section*/}
          <ImageAndLevel pokemonState={pokemonState} level={level} setLevel={setLevel}  isAlpha={isAlpha}/>
     
          {/* Status Section */}
          <Status selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}/>

          {/* HP Section */}
          <HP
            averageHp={averageHp}
            setCurrentHp={setCurrentHp}
          />
                    
        </div>
        
        {/* Second Container for Pokeball and Capture Chance Calculator */}
        <div className="second-container">
           
          {/* Pokéball Section */}
          <PokeBall selectedPokeball={selectedPokeball} setSelectedPokeball={setSelectedPokeball} />

          {/* Capture Chance Section */}
          <CaptureCalc pokemonState={pokemonState} level={level} currentHp={currentHp} averageHp={averageHp} selectedPokeball={selectedPokeball} selectedStatus={selectedStatus}/>
        </div>
      </div>
    </div>
  );
};

export default CaptureChance;
