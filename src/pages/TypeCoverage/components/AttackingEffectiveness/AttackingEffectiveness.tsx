// Component: AttackingEffectiveness.tsx
import React, { useEffect, useState } from "react";
import "./AttackingEffectiveness.css"; // Import CSS
import typeEffectivenessData from "../../../../data/type-attacking-effectiveness.json"; // Import type-effectiveness data

type AttackingEffectivenessProps = {
  pokemonTypes: string[];
  isInverse: boolean;
};

const AttackingEffectiveness: React.FC<AttackingEffectivenessProps> = ({ pokemonTypes, isInverse }) => {
  const [typeEffectiveness, setTypeEffectiveness] = useState<{ 
    [key: string]: { [effectiveness: string]: string[] } 
  }>({});

  // Capitalize first letter of the type (to match JSON keys)
  const capitalizeType = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);

  useEffect(() => {
    if (pokemonTypes.length === 0) {
      setTypeEffectiveness({}); // Reset if no types are selected
      return;
    }

    const newEffectiveness: { [key: string]: { [effectiveness: string]: string[] } } = {};

    pokemonTypes.forEach((type) => {
      const capitalizedType = capitalizeType(type);
      const effectiveness = typeEffectivenessData[capitalizedType as keyof typeof typeEffectivenessData];

      if (!effectiveness) {
        console.warn(`Effectiveness data for type ${capitalizedType} not found.`);
        return;
      }

      // Omit 1x
      newEffectiveness[capitalizedType] = { "2x": [], "0.5x": [], "0x": [] };

      Object.entries(effectiveness).forEach(([targetType, value]) => {
        let modifiedValue = value;

        // Apply Inverse Effectiveness if isInverse is true
        if (isInverse) {
          if (value === 2) modifiedValue = 0.5;
          else if (value === 0.5) modifiedValue = 2;
          else if (value === 0) modifiedValue = 2; // Immunity becomes super effective
          else if (value === 1) modifiedValue = 1; // Neutral stays the same
        }

        // Store in the correct category, skipping 1x
        if (modifiedValue === 2) newEffectiveness[capitalizedType]["2x"].push(targetType);
        else if (modifiedValue === 0.5) newEffectiveness[capitalizedType]["0.5x"].push(targetType);
        else if (modifiedValue === 0) newEffectiveness[capitalizedType]["0x"].push(targetType);
      });
    });

    setTypeEffectiveness(newEffectiveness);
  }, [pokemonTypes, isInverse]); // Dependencies

  return (
    <div className="attacking">
      <div className="attacking-columns">
        {Object.entries(typeEffectiveness).map(([type, effectivenessGroups]) => (
          <div key={type} className="attacking-column" style={{ maxWidth: pokemonTypes.length === 1 ? '210px' : '170px' }}>
            <h3>{type} Moves do</h3>
            {Object.entries(effectivenessGroups).map(([effectiveness, types]) => (
              types.length > 0 && (
                <div key={effectiveness} className={`attacking-category ${isInverse ? "attacking-inverse" : ""}`}>
                  <h4 data-effectiveness={effectiveness}>{effectiveness} Damage</h4>
                  <ul>
                    {types.map((targetType) => (
                      <li key={targetType}>
                        <img src={`types/icons/${targetType.toLowerCase()}.png`} alt={targetType} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttackingEffectiveness;