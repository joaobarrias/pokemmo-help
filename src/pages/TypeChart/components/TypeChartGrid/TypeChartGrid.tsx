// Component: TypeChartGrid.tsx
import React from "react";
import "./TypeChartGrid.css";
import typeEffectivenessData from "../../../../data/type-attacking-effectiveness.json";

type TypeChartGridProps = {
  isInverse: boolean;
};

const types = Object.keys(typeEffectivenessData);

const typeEffectivenessDataTyped: Record<string, Record<string, number>> = typeEffectivenessData;

const TypeChartGrid: React.FC<TypeChartGridProps> = ({ isInverse }) => {
  return (
    <div className="type-chart">
      <h2>{isInverse ? "Inverted Type Chart" : "Normal Type Chart"}</h2>
      <table>
        <thead>
          <tr>
          <th className="corner-header">
            <span className="defender">Defender→</span>
            <span className="attacker">Attacker↓</span>
          </th>
            {types.map((type) => (
              <th key={type}>
                <img src={`/types/chart-icons/${type.toLowerCase()}.png`} alt={type} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {types.map((attackingType) => (
            <tr key={attackingType}>
              <td>
                <img src={`/types/chart-icons/${attackingType.toLowerCase()}.png`} alt={attackingType} />
              </td>
              {types.map((defendingType) => {
                // Access the effectiveness value directly with the typed data
                let effectiveness = typeEffectivenessDataTyped[attackingType]?.[defendingType] ?? 1;

                if (isInverse) {
                  effectiveness = effectiveness === 0 ? 2 : effectiveness === 2 ? 0.5 : effectiveness === 0.5 ? 2 : effectiveness;
                }

                // Return empty cell if effectiveness is 1
                if (effectiveness === 1) {
                  return <td key={defendingType} />;
                }

                return (
                  <td key={defendingType} data-effectiveness={effectiveness}>
                    {effectiveness}x
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TypeChartGrid;
