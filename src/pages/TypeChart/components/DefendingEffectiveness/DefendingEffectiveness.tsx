import React, { useEffect, useState } from "react";
import typeEffectivenessData from "../../../../data/type-defending-effectiveness.json"; // Import type-effectiveness data

type DefendingEffectivenessProps = {
  pokemonTypes: string[]; // Array of selected Pokemon types
};

const DefendingEffectiveness: React.FC<DefendingEffectivenessProps> = ({ pokemonTypes }) => {
  const [groupedEffectiveness, setGroupedEffectiveness] = useState<{
    [effectiveness: string]: string[];
  }>({
    "4x": [],
    "2x": [],
    "1x": [],
    "0.5x": [],
    "0.25x": [],
    "0x": [],
  });

  // Function to capitalize the first letter of a type (to match JSON keys)
  const capitalizeType = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);

  // Function to calculate the combined defending effectiveness
  const groupEffectiveness = (types: string[]) => {
    const effectivenessGrouped: { [key: string]: string[] } = {
      "4x": [],
      "2x": [],
      "1x": [],
      "0.5x": [],
      "0.25x": [],
      "0x": [],
    };

    const allTargetTypes: { [key: string]: number } = {}; // To store effectiveness for all target types

    // Iterate through each selected type
    types.forEach((type) => {
      const capitalizedType = capitalizeType(type); // Capitalize the type to match the JSON keys
      const typeEffectiveness = typeEffectivenessData[capitalizedType as keyof typeof typeEffectivenessData]; // Type assertion to get effectiveness

      if (typeEffectiveness) {
        console.log(`Effectiveness for ${capitalizedType}:`, typeEffectiveness);
        // Iterate through all the target types for the current type
        Object.entries(typeEffectiveness).forEach(([targetType, effectiveness]) => {
          // Update the combined effectiveness for each target type
          if (allTargetTypes[targetType] === 0) {
            // If the current effectiveness is already 0x, keep it as 0x
            allTargetTypes[targetType] = 0;
          } else if (allTargetTypes[targetType]) {
            // If it's non-zero, multiply the effectiveness
            allTargetTypes[targetType] *= effectiveness;
          } else {
            // If no value exists for this target type, set it to the current effectiveness (should not even make it here)
            allTargetTypes[targetType] = effectiveness;
          }
        });
      } else {
        console.warn(`Effectiveness data for type ${capitalizedType} not found.`);
      }
    });

    // Group the target types based on their combined effectiveness
    Object.entries(allTargetTypes).forEach(([targetType, combinedEffectiveness]) => {
      if (combinedEffectiveness >= 4) effectivenessGrouped["4x"].push(targetType);
      else if (combinedEffectiveness === 2) effectivenessGrouped["2x"].push(targetType);
      else if (combinedEffectiveness === 1) effectivenessGrouped["1x"].push(targetType);
      else if (combinedEffectiveness === 0.5) effectivenessGrouped["0.5x"].push(targetType);
      else if (combinedEffectiveness === 0.25) effectivenessGrouped["0.25x"].push(targetType);
      else if (combinedEffectiveness === 0) effectivenessGrouped["0x"].push(targetType);
    });

    return effectivenessGrouped;
  };

  useEffect(() => {
    if (pokemonTypes.length === 0) {
      setGroupedEffectiveness({
        "4x": [],
        "2x": [],
        "1x": [],
        "0.5x": [],
        "0.25x": [],
        "0x": [],
      }); // Clear the groupedEffectiveness if no types are selected
    } else {
      const grouped = groupEffectiveness(pokemonTypes);
      setGroupedEffectiveness(grouped); // Update the state
    }
  }, [pokemonTypes]);

  return (
    <div className="defending">
        <div className={`defending-column ${Object.values(groupedEffectiveness).every(types => types.length === 0) ? 'empty' : ''}`}>
        {Object.values(groupedEffectiveness).some(types => types.length > 0) && <h3>Takes Damage from</h3>}
          {Object.entries(groupedEffectiveness).map(([effectiveness, types]) =>
            types.length > 0 ? (
              <div key={effectiveness} className="defending-category">
                <h4 data-effectiveness={effectiveness}>
                  {effectiveness} Damage
                </h4>
                <ul>
                  {types.map((type) => (
                    <li key={type}>
                      <img src={`/types/${type.toLowerCase()}.png`} alt={type} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
    </div>
  );
};

export default DefendingEffectiveness;
