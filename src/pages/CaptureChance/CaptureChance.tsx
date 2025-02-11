// Page: CaptureChance.tsx
import { useState, useEffect } from "react";
import "./CaptureChance.css"; // Import CSS
import PokemonSelector from "./components/PokemonSelector/PokemonSelector";  // Import the PokemonSelector component
import ImageAndLevel from "./components/ImageAndLevel/ImageAndLevel";  // Import the Level component
import Status from "./components/Status/Status";  // Import the PokemonSelector component
import HP from "./components/HP/HP";  // Import the HP component
import PokeBall from "./components/PokeBall/PokeBall";  // Import the PokeBall component
import CaptureCalc from "./components/CaptureCalc/CaptureCalc";  // Import the PokeBall component

interface CaptureChanceProps {
  filteredPokemon: { name: string; id: number }[];
}

export interface PokemonState {
  name: string;
  id: number | null;
  stats: {
    hp: number | null;
    speed: number | null;
    weight: number | null;
  };
  imageUrl: string | null;
  catchRate: number | null;
  types: string[];
}

const CaptureChance: React.FC<CaptureChanceProps> = ({ filteredPokemon }) => {
  const [pokemonState, setPokemonState] = useState<PokemonState>({
    name: "Pikachu",
    id: 25,
    stats: { hp: 35, speed: 90, weight: 6 },
    imageUrl: "sprites/default/25.png",
    catchRate: 190,
    types: ['electric'],
  });
  const [level, setLevel] = useState<string | null>('50');
  const [currentHp, setCurrentHp] = useState<number | null>(null);
  const [averageHp, setAverageHp] = useState<number | null>(null);
  const [selectedPokeball, setSelectedPokeball] =  useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);
  const [isAlpha, setIsAlpha] = useState(false);
  const [captureControl, setCaptureControl] = useState<boolean>(false);
  const [hpControl, setHpControl] = useState<boolean>(false);
  

  useEffect(() => { 
    if (!pokemonState.stats.hp || level === null) return;
    if (pokemonState.name === "Shedinja") {
      setAverageHp(1);
    }
    else  {
      const levelValue = parseFloat(level);
      const avgHp = Math.floor((((2 * pokemonState.stats.hp + 15) * levelValue) / 100) + levelValue + 10)
      setAverageHp(avgHp);
      
    }
    setHpControl(!hpControl);
  }, [pokemonState.id, pokemonState.catchRate, level]); // Dependencies

  return (
    <div className="page">
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
          filteredPokemon={filteredPokemon}
          />

          
          {/* Pokémon Image and Level Section*/}
          <ImageAndLevel pokemonState={pokemonState} level={level} setLevel={setLevel}  isAlpha={isAlpha}/>
     
          {/* Status Section */}
          <Status selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}/>

          {/* HP Section */}
          <HP
            captureControl={captureControl}
            setCaptureControl={setCaptureControl}
            hpControl={hpControl}
            averageHp={averageHp}
            setCurrentHp={setCurrentHp}
          />
                    
        </div>
        
        {/* Second Container for Pokeball and Capture Chance Calculator */}
        <div className="second-container">
           
          {/* Pokéball Section */}
          <PokeBall selectedPokeball={selectedPokeball} setSelectedPokeball={setSelectedPokeball} />

          {/* Capture Chance Section */}
          <CaptureCalc captureControl={captureControl} pokemonState={pokemonState} level={level} currentHp={currentHp} averageHp={averageHp} selectedPokeball={selectedPokeball} selectedStatus={selectedStatus}/>
        
        </div>
      </div>
    </div>
  );
};

export default CaptureChance;
