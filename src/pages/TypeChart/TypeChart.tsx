// Page: TypeChart.tsx
import { useState } from "react";
import "./TypeChart.css";
import AttackingEffectiveness from "./components/AttackingEffectiveness/AttackingEffectiveness";
import PokemonSelector from "./components/PokemonSelector/PokemonSelector";
import DefendingEffectiveness from "./components/DefendingEffectiveness/DefendingEffectiveness";
import TypeChartGrid from "./components/TypeChartGrid/TypeChartGrid";

interface TypeChartProps {
  allPokemon: { name: string; id: number }[];
}

export interface PokemonState {
  name: string;
  id: number | null;
  imageUrl: string | null;
}

const TypeChart: React.FC<TypeChartProps> = ({ allPokemon }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonState>({
    name: "Pikachu",
    id: 25,
    imageUrl: "sprites/default/25.png",
  });
  const [pokemonTypes, setPokemonTypes] = useState<string[]>(["electric"]);
  const [isInverse, setIsInverse] = useState<boolean>(false);
  const [showAttacking, setShowAttacking] = useState<boolean>(false);

  return (
    <div className="chart-page">
      {/* Header */}
      <div className="header">
        <h1>Type Chart Effectiveness</h1>
      </div>

      {/* Body */}
      <div className="chart-body">
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
              <AttackingEffectiveness pokemonTypes={pokemonTypes} />
            ) : (
              <DefendingEffectiveness pokemonTypes={pokemonTypes} />
            )}
          </div>

        </div>

        {/* Second Row: Type Chart with Inverse Toggle */}
        <div className="chart-second-container">
          <button onClick={() => setIsInverse(!isInverse)}>
            {isInverse ? "Inverse Typing" : "Normal Typing"}
          </button>
          <TypeChartGrid isInverse={isInverse} />
        </div>
      </div>
    </div>
  );
};

export default TypeChart;
