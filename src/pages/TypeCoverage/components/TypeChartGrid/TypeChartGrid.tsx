// Component: TypeChartGrid.tsx
import React, { useState } from "react";
import "./TypeChartGrid.css"; // Import CSS
import typeEffectivenessData from "../../../../data/type-attacking-effectiveness.json"; // Import type-effectiveness data

type TypeChartGridProps = {
  isInverse: boolean;
};

const types = Object.keys(typeEffectivenessData);
const typeEffectivenessDataTyped: Record<string, Record<string, number>> = typeEffectivenessData;

const TypeChartGrid: React.FC<TypeChartGridProps> = ({ isInverse }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [clickedRow, setClickedRow] = useState<number | null>(null);
  const [clickedCol, setClickedCol] = useState<number | null>(null);
  const [isTableHovered, setIsTableHovered] = useState(false);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (clickedRow === rowIndex && clickedCol === colIndex) {
      setClickedRow(null);
      setClickedCol(null);
    } else {
      setClickedRow(rowIndex);
      setClickedCol(colIndex);
    }
  };

  return (
    <div className="type-chart">
      <h2>{isInverse ? "Inverted Type Chart" : "Normal Type Chart"}</h2>
      <table
        onMouseEnter={() => setIsTableHovered(true)}
        onMouseLeave={() => setIsTableHovered(false)}
        onBlur={() => {
          setClickedRow(null);
          setClickedCol(null);
        }}
        tabIndex={0}
      >
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
        <tbody
          onMouseLeave={() => {
            setHoveredRow(null);
            setHoveredCol(null);
          }}
        >
          {types.map((attackingType, rowIndex) => (
            <tr key={attackingType}>
              <td>
                <img src={`/types/chart-icons/${attackingType.toLowerCase()}.png`} alt={attackingType} />
              </td>
              {types.map((defendingType, colIndex) => {
                const effectiveCol = colIndex + 1;

                // Access the effectiveness value
                let effectiveness = typeEffectivenessDataTyped[attackingType]?.[defendingType] ?? 1;
                if (isInverse) {
                  effectiveness =
                    effectiveness === 0 ? 2 : effectiveness === 2 ? 0.5 : effectiveness === 0.5 ? 2 : effectiveness;
                }

                // Determine if a cell is hovered or clicked
                const isHovered =
                  hoveredRow !== null &&
                  hoveredCol !== null &&
                  ((rowIndex === hoveredRow && effectiveCol <= hoveredCol) ||
                    (effectiveCol === hoveredCol && rowIndex <= hoveredRow));

                const isClicked =
                  clickedRow !== null &&
                  clickedCol !== null &&
                  ((rowIndex === clickedRow && effectiveCol <= clickedCol) ||
                    (effectiveCol === clickedCol && rowIndex <= clickedRow));

                // Apply brightness logic
                const brightness =
                  isHovered || isClicked
                    ? "brightness(100%)" // Hovered or clicked cells will always be 100%
                    : isTableHovered || clickedRow !== null // Keep 50% brightness if the table is hovered or there is a clicked cell
                    ? "brightness(45%)"
                    : "brightness(100%)"; // Otherwise, keep at full brightness

                // Determine background color for empty cells (effectiveness === 1)
                const backgroundColor =
                  effectiveness === 1 && (isClicked || isHovered) ? "#ffffff28" : "";

                const handleMouseEnter = () => {
                  setHoveredRow(rowIndex);
                  setHoveredCol(effectiveCol);
                };

                const handleClick = () => {
                  handleCellClick(rowIndex, effectiveCol);
                };

                return (
                  <td
                    key={defendingType}
                    data-effectiveness={effectiveness}
                    onMouseEnter={handleMouseEnter}
                    onClick={handleClick}
                    style={{ filter: brightness, backgroundColor }}
                  >
                    {effectiveness !== 1 && `${effectiveness}x`}
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
