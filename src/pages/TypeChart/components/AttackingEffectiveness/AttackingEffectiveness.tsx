// Component: AttackingEffectiveness.tsx
import React from "react";
import "./AttackingEffectiveness.css"; // Import CSS

type AttackingEffectivenessProps = {
    selectedPokemon: any | null;
};
  
const AttackingEffectiveness: React.FC<AttackingEffectivenessProps> = ({
    selectedPokemon
  }) => {

    return (
      <div className="attacking">
        <h2>Attacking:</h2>
        {/* Display effectiveness against other types */}
      </div>
    );
  };
  
  export default AttackingEffectiveness;
  