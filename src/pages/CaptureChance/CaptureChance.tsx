// Page: CaptureChance.tsx
import { useState, useEffect } from "react";
import "./CaptureChance.css"; // Import CSS
import PokemonSelector from "./components/PokemonSelector/PokemonSelector";  // Import the PokemonSelector component
import ImageAndLevel from "./components/ImageAndLevel/ImageAndLevel";  // Import the Level component
import Status from "./components/Status/Status";  // Import the Status component
import HP from "./components/HP/HP";  // Import the HP component
import PokeBall from "./components/PokeBall/PokeBall";  // Import the PokeBall component
import CaptureCalc from "./components/CaptureCalc/CaptureCalc";  // Import the Capture Calc component

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
  const [isSpoilerOpen, setIsSpoilerOpen] = useState(false);

  useEffect(() => { 
    if (!pokemonState.stats.hp || level === null) return;
    if (pokemonState.name === "Shedinja") {
      setAverageHp(1);
    }
    else  {
      const levelValue = parseFloat(level);
      const avgHp = Math.floor((((2 * pokemonState.stats.hp + 15.5) * levelValue) / 100) + levelValue + 10)
      setAverageHp(avgHp);
      
    }
    setHpControl(!hpControl);
  }, [pokemonState.id, pokemonState.catchRate, level]); // Dependencies

  return (
    <div className="capture-page">
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

        {/* Third Container for How it Works section*/}
        <div className="third-container">
          
          <div className="how-it-works">
            <h2>How It Works</h2>
            <button onClick={() => setIsSpoilerOpen(!isSpoilerOpen)}>
              {isSpoilerOpen ? "Hide Formulas" : "Show Formulas"}
            </button>
            <div className={`formulas-container ${isSpoilerOpen ? 'open' : ''}`}>
              <p className="intro-text">
                This calculator computes the selected Pokémon capture chance using its Base Stats & Catch Rate, Level, HP (Current and Total), Status, Poké Ball, and Alpha Modifier. See the formulas below:
              </p>
              <div className="formula-row">
                <div className="formula-section">
                  <h3>Total HP</h3>
                  <p className="formula">
                    Total HP = ⌊ <span className="parentheses">(</span>
                    <span className="fraction">
                      <span className="numerator">(2 × Base HP + 15.5) × Level</span>
                      <span className="denominator">100</span>
                    </span>
                    <span className="parentheses">)</span> + Level + 10 ⌋
                  </p>
                  <p className="note">Uses 15.5 as the average IV (0-31).</p>
                </div>
                <div className="formula-section">
                  <h3>Capture Chance</h3>
                  <p className="formula">
                    X = <span className="parentheses">(</span>
                    <span className="fraction">
                      <span className="numerator">
                        (3 × Total HP - 2 × Current HP) × Catch Rate × Ball Multiplier
                      </span>
                      <span className="denominator">3 × Total HP</span>
                    </span>
                    <span className="parentheses">)</span> × Status Multiplier
                  </p>
                </div>
              </div>
              <div className="formula-row">
                <div className="formula-section">
                  <p className="formula">
                    Y =
                    <span className="conditional">
                      <span className="case">
                        <span className="fraction">
                          <span className="numerator">1048560</span>
                          <span className="denominator">
                            √<span className="nested-sqrt">
                              √<span className="fraction">
                                <span className="numerator">16711680</span>
                                <span className="denominator">X</span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                      <span className="condition">{'if X < 255'}</span>
                    </span>
                    <span className="conditional">
                      <span className="case">65535</span>
                      <span className="condition">{'if X ≥ 255'}</span>
                    </span>
                  </p>
                </div>
                <div className="formula-section">
                  <p className="formula">
                    Chance (%) = <span className="parentheses">(</span>
                    <span className="fraction">
                      <span className="numerator">Y</span>
                      <span className="denominator">65536</span>
                    </span>
                    <span className="parentheses">)</span>
                    <sup>4</sup> × 100
                  </p>
                  <p className="note">Rounds to 2 decimals; 100% if ≥ 99.99%.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CaptureChance;
