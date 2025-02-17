// Component: AttackingEffectiveness.tsx
import React, { useEffect, useState } from "react";
import "./AttackingEffectiveness.css"; // Import CSS
import typeEffectivenessData from "../../../../data/type-attacking-effectiveness.json"; // Import type-effectiveness data

type AttackingEffectivenessProps = {
  pokemonTypes: string[];
};

const AttackingEffectiveness: React.FC<AttackingEffectivenessProps> = ({ pokemonTypes }) => {
  const [groupedEffectiveness, setGroupedEffectiveness] = useState<{ 
    [key: string]: { [effectiveness: string]: string[] } } 
  >({});

  // Capitalize first letter of the type (to match JSON keys)
  const capitalizeType = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);

  useEffect(() => {
    if (pokemonTypes.length === 0) {
      setGroupedEffectiveness({}); // Reset if no types are selected
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

      newEffectiveness[capitalizedType] = { "2x": [], "1x": [], "0.5x": [], "0x": [] };

      Object.entries(effectiveness).forEach(([targetType, value]) => {
        if (value === 2) newEffectiveness[capitalizedType]["2x"].push(targetType);
        else if (value === 1) newEffectiveness[capitalizedType]["1x"].push(targetType);
        else if (value === 0.5) newEffectiveness[capitalizedType]["0.5x"].push(targetType);
        else if (value === 0) newEffectiveness[capitalizedType]["0x"].push(targetType);
      });
    });

    setGroupedEffectiveness(newEffectiveness);
  }, [pokemonTypes]);

  return (
    <div className="attacking">
      <h2>Attacking</h2>
      <div className="attacking-columns">
        {Object.entries(groupedEffectiveness).map(([type, effectivenessGroups]) => (
          <div key={type} className="attacking-column">
            <h3>{type}</h3>
            {Object.entries(effectivenessGroups).map(([effectiveness, types]) => (
              types.length > 0 && (
                <div key={effectiveness} className="attacking-category">
                  <h4>{effectiveness} Damage</h4>
                  <ul>
                    {types.map((targetType) => (
                      <li key={targetType}>
                        <img src={`types/${targetType.toLowerCase()}.png`} alt={targetType} />
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
