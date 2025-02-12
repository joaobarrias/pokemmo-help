// Page: TypeChart.tsx
import { useState } from "react";
import "./TypeChart.css"; // Import CSS
import AttackingEffectiveness from "./components/AttackingEffectiveness/AttackingEffectiveness"; // Import the Attack component
import PokemonSelector from "./components/PokemonSelector/PokemonSelector"; // Import the Pokemon Selector component
import DefendingEffectiveness from "./components/DefendingEffectiveness/DefendingEffectiveness"; // Import the Defence component
import TypeChartGrid from "./components/TypeChartGrid/TypeChartGrid"; // Import the Type Chart Grid component

interface TypeChartProps {
  allPokemon: { name: string; id: number }[];
}


const TypeChart: React.FC<TypeChartProps> =  ({ allPokemon }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [isInverse, setIsInverse] = useState<boolean>(false);
  
  return (
    <div className="page">
      {/* Header */}
      <div className="header">
        <h1>Type Chart Effectiveness</h1>
      </div>

      {/* Body */}
      <div className="body">
        {/* First Row: Attack/Defense & Pokémon Selection */}
        <div className="main-container">
          <AttackingEffectiveness selectedPokemon={selectedPokemon} />
          <PokemonSelector allPokemon={allPokemon} setSelectedPokemon={setSelectedPokemon} />
          <DefendingEffectiveness selectedPokemon={selectedPokemon} />
        </div>

        {/* Second Row: Type Chart with Inverse Toggle */}
        <div className="second-container">
          <button onClick={() => setIsInverse(!isInverse)}>Inverse Type</button>
          <TypeChartGrid isInverse={isInverse} />
        </div>
      </div>
    </div>
  );
};

export default TypeChart;
