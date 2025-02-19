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
      {/* Header */}
      <div className="header">
      <h1>
        <span key={isInverse ? "inverted" : "normal"} className={`fade-text ${isInverse ? "fade-in-inverted" : "fade-in-normal"}`}>
          {isInverse ? "Inverted" : "Normal"}&nbsp;
        </span>
        Type Coverage Calculator
        <button 
          onClick={() => setIsInverse(!isInverse)}
          className={`flip-button ${isInverse ? "inverted" : ""}`}
          >
            Flip <span className="flipped-text">Typing</span> <span className="rotate-arrow">↺</span>
        </button>
      </h1>
      </div>

      {/* Body */}
      <div className={`chart-body ${isInverse ? "inverted" : ""}`}>
        {/* First Row: Pokemon Selector & Toggleable Attack/Defense */}
        <div className="chart-main-container">
          {/* Pokemon Selector */}
          <div className="pokemon-selector">
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
            {showAttacking ? (
              <AttackingEffectiveness isInverse={isInverse} pokemonTypes={pokemonTypes} />
            ) : (
              <DefendingEffectiveness isInverse={isInverse} pokemonTypes={pokemonTypes} />
            )}
          </div>

        </div>

        {/* Second Row: Type Chart with Inverse Toggle */}
        <div className="chart-second-container">
          <TypeChartGrid isInverse={isInverse} />
        </div>
      </div>
    </div>
  );
};

export default TypeCoverage;
