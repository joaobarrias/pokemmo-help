// Component: TypeChartGrid.tsx
import React, { useState } from "react";
import "./TypeChartGrid.css"; // Import CSS
import typeEffectivenessData from "../../../../data/type-attacking-effectiveness.json"; // Import type-effectiveness data
import defendersSprite from '/types/chart-icons/defenders.png'; // Import Defenders Header Image
import attackersSprite from '/types/chart-icons/attackers.png'; // Import Attacks Header Image

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
  const [isContentHovered, setIsContentHovered] = useState(false);

  // Handle cell click to toggle selection
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (clickedRow === rowIndex && clickedCol === colIndex) {
      setClickedRow(null);
      setClickedCol(null);
    } else {
      setClickedRow(rowIndex);
      setClickedCol(colIndex);
    }
  };

  // Reset states on mouse leave
  const handleTableMouseLeave = () => {
    setIsContentHovered(false);
    setHoveredRow(null);
    setHoveredCol(null);
  };

  return (
    <div className="type-chart">
      <h2>{isInverse ? "Inverted Type Chart" : "Normal Type Chart"}</h2>
      <div className="sprite-container">
        <img src={defendersSprite} alt="Defenders" className="defenders-sprite" />
        <img src={attackersSprite} alt="Attackers" className="attackers-sprite" />
        <table
          onMouseLeave={handleTableMouseLeave}
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
              {types.map((_, index) => (
                <th key={index} className="header-cell" data-type-index={index}></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((attackingType, rowIndex) => (
              <tr key={attackingType}>
                <td className="row-header-cell" data-type-index={rowIndex}></td>
                {types.map((defendingType, colIndex) => {
                  const effectiveCol = colIndex + 1;
                  let effectiveness = typeEffectivenessDataTyped[attackingType]?.[defendingType] ?? 1;
                  if (isInverse) {
                    effectiveness =
                      effectiveness === 0 ? 2 : effectiveness === 2 ? 0.5 : effectiveness === 0.5 ? 2 : effectiveness;
                  }

                  const isHovered = hoveredRow === rowIndex && hoveredCol === effectiveCol;
                  const isInHoveredRange =
                    hoveredRow !== null &&
                    hoveredCol !== null &&
                    ((rowIndex === hoveredRow && effectiveCol <= hoveredCol) ||
                      (effectiveCol === hoveredCol && rowIndex <= hoveredRow));
                  const isClicked = clickedRow === rowIndex && clickedCol === effectiveCol;
                  const isInClickedRange =
                    clickedRow !== null &&
                    clickedCol !== null &&
                    ((rowIndex === clickedRow && effectiveCol <= clickedCol) ||
                      (effectiveCol === clickedCol && rowIndex <= clickedRow));

                  const cellClass =
                    (isContentHovered || clickedRow !== null) && !(isHovered || isClicked || isInHoveredRange || isInClickedRange)
                      ? "inactive"
                      : "active";

                  const brightness =
                    isHovered || isClicked || isInHoveredRange || isInClickedRange
                      ? "brightness(100%)"
                      : (isContentHovered || clickedRow !== null) && !isHovered && !isClicked
                      ? "brightness(45%)"
                      : "brightness(100%)";

                  const backgroundColor =
                    effectiveness === 1 && (isInHoveredRange || isInClickedRange)
                      ? "#ffffff28"
                      : "";

                  const handleMouseEnter = () => {
                    setIsContentHovered(true);
                    setHoveredRow(rowIndex);
                    setHoveredCol(effectiveCol);
                  };

                  const handleMouseLeave = () => {
                    setHoveredRow(null);
                    setHoveredCol(null);
                  };

                  const handleClick = () => {
                    handleCellClick(rowIndex, effectiveCol);
                  };

                  return (
                    <td
                      key={defendingType}
                      data-effectiveness={effectiveness}
                      className={cellClass}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleClick}
                      style={{ filter: brightness, backgroundColor }}
                    >
                      {effectiveness !== 1 && `${effectiveness}`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TypeChartGrid;