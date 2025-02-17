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
export interface PokemonState {
  name: string;
  id: number | null;
  imageUrl: string | null;
}

const TypeChart: React.FC<TypeChartProps> =  ({ allPokemon }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonState>({
      name: "Pikachu",
      id: 25,
      imageUrl: "sprites/default/25.png"
    });
  const [pokemonTypes, setPokemonTypes] = useState<string[]>(['electric']);
  const [isInverse, setIsInverse] = useState<boolean>(false);
  
  return (
    <div className="chart-page">
      {/* Header */}
      <div className="header">
        <h1>Type Chart Effectiveness</h1>
      </div>

      {/* Body */}
      <div className="chart-body">
        {/* First Row: Attack/Defense & Pokémon Selection */}
        <div className="chart-main-container">
          <AttackingEffectiveness pokemonTypes={pokemonTypes} />
          <PokemonSelector selectedPokemon={selectedPokemon} allPokemon={allPokemon} setSelectedPokemon={setSelectedPokemon} setPokemonTypes={setPokemonTypes} pokemonTypes={pokemonTypes}/>
          <DefendingEffectiveness selectedPokemon={selectedPokemon} />
        </div>

        {/* Second Row: Type Chart with Inverse Toggle */}
        <div className="chart-second-container">
          <button onClick={() => setIsInverse(!isInverse)}>{isInverse ? "Inverse Typing" : "Normal Typing"}</button>
          <TypeChartGrid isInverse={isInverse} />
        </div>
      </div>
    </div>
  );
};

export default TypeChart;
