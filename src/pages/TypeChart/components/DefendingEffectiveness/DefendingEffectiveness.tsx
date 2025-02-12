// Component: DefendingEffectiveness.tsx
import React from "react";
import "./DefendingEffectiveness.css"; // Import CSS

type DefendingEffectivenessProps = {
    selectedPokemon: any | null;
};

const DefendingEffectiveness : React.FC<DefendingEffectivenessProps> = ({
    selectedPokemon
  }) => {

    return (
      <div className="defending">
        <h2>Defending:</h2>
        {/* Show what types affect the selected Pokémon */}
      </div>
    );
  };
  
  export default DefendingEffectiveness;
  