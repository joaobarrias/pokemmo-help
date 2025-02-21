// Page: TypeCoverage.tsx
import { useState } from "react";
import "./TypeCoverage.css";
import AttackingEffectiveness from "./components/AttackingEffectiveness/AttackingEffectiveness";
import PokemonSelector from "./components/PokemonSelector/PokemonSelector";
import DefendingEffectiveness from "./components/DefendingEffectiveness/DefendingEffectiveness";
import TypeChartGrid from "./components/TypeChartGrid/TypeChartGrid";

interface TypeCoverageProps {
  allPokemon: { name: string; id: number }[];
}

export interface PokemonState {
  name: string;
  id: number | null;
  imageUrl: string | null;
}

const TypeCoverage: React.FC<TypeCoverageProps> = ({ allPokemon }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonState>({
    name: "Gyarados",
    id: 130,
    imageUrl: "sprites/default/130.png",
  });
  const [pokemonTypes, setPokemonTypes] = useState<string[]>(["water", "flying"]);
  const [isInverse, setIsInverse] = useState<boolean>(false);
  const [showAttacking, setShowAttacking] = useState<boolean>(false);

  return (
    <div className="chart-page">
      {/* Header with Inverse Toggle */}
      <div className="header">
      <h1>
        <span key={isInverse ? "inverted" : "normal"} className={`fade-text ${isInverse ? "fade-in-inverted" : "fade-in-normal"}`}>
          {isInverse ? "Inverted" : "Normal"}&nbsp;
        </span>
        Type Coverage Calculator
      </h1>
      <button 
        onClick={() => setIsInverse(!isInverse)}
        className={`flip-button ${isInverse ? "inverted" : ""}`}
        >
          {isInverse ? "Flip it Back " : "Flip Typing "}<span className="rotate-arrow">↺</span>
        </button>
      </div>

      {/* Body */}
      <div className={`chart-body ${isInverse ? "inverted" : ""}`}>
        {/* First Row: Pokemon Selector & Toggleable Attack/Defense */}
        <div className="chart-main-container">
          {/* Pokemon Selector */}
          <div className="chart-pokemon-selector">
            <PokemonSelector
              selectedPokemon={selectedPokemon}
              allPokemon={allPokemon}
              setSelectedPokemon={setSelectedPokemon}
              setPokemonTypes={setPokemonTypes}
              pokemonTypes={pokemonTypes}
            />
          </div>

          {/* Attack/Defense Toggle */}
          <div className="attack-defense-container">
            <div className="toggle-container">
              <h2 className={`toggle-text ${showAttacking ? "active" : "inactive"}`}>Attacking</h2>
              <div className="toggle-switch" onClick={() => setShowAttacking(!showAttacking)}>
                <div className={`slider ${showAttacking ? "attacking" : "defending"}`}></div>
              </div>
              <h2 className={`toggle-text ${showAttacking ? "inactive" : "active"}`}>Defending</h2>
            </div>
            <div className="toggle-content">
              <div className={`toggle-option ${showAttacking ? "visible" : "hidden"}`}>
                <AttackingEffectiveness isInverse={isInverse} pokemonTypes={pokemonTypes} />
              </div>
              <div className={`toggle-option ${showAttacking ? "hidden" : "visible"}`}>
                <DefendingEffectiveness isInverse={isInverse} pokemonTypes={pokemonTypes} />
              </div>
            </div>
          </div>
          
        </div>

        {/* Second Row: Type Chart */}
        <div className="chart-second-container">
          <TypeChartGrid isInverse={isInverse} />
        </div>
      </div>
    </div>
  );
};

export default TypeCoverage;
