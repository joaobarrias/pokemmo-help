// Component: TypeChartGrid.tsx
import React, { useState, useEffect } from "react";
import "./TypeChartGrid.css"; // Import CSS
import typeEffectivenessData from "../../../../data/type-attacking-effectiveness.json"; // Import type-effectiveness data

type TypeChartGridProps = {
  isInverse: boolean;
};

const types = Object.keys(typeEffectivenessData);
const typeEffectivenessDataTyped: Record<string, Record<string, number>> = typeEffectivenessData;

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const TypeChartGrid: React.FC<TypeChartGridProps> = ({ isInverse }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [clickedRow, setClickedRow] = useState<number | null>(null);
  const [clickedCol, setClickedCol] = useState<number | null>(null);
  const [isContentHovered, setIsContentHovered] = useState(false);

  const { width, height } = useWindowSize();
  const hideX = width <= 800 || (height <= 900 && width <= 2000);
  const isMobile = width <= 1110 || (height <= 900 && width <= 2000);
  const iconFolder = isMobile ? "icons" : "chart-icons";

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (clickedRow === rowIndex && clickedCol === colIndex) {
      setClickedRow(null);
      setClickedCol(null);
    } else {
      setClickedRow(rowIndex);
      setClickedCol(colIndex);
    }
  };

  const handleTableMouseLeave = () => {
    setIsContentHovered(false);
    setHoveredRow(null);
    setHoveredCol(null);
  };

  return (
    <div className="type-chart">
      <h2>{isInverse ? "Inverted Type Chart" : "Normal Type Chart"}</h2>
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
            {types.map((type) => (
              <th key={type} onMouseEnter={handleTableMouseLeave}>
                <img
                  src={`/types/${iconFolder}/${type.toLowerCase()}.png`}
                  alt={type}
                  className="header-icon"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {types.map((attackingType, rowIndex) => (
            <tr key={attackingType}>
              <td onMouseEnter={handleTableMouseLeave}>
                <img
                  src={`/types/${iconFolder}/${attackingType.toLowerCase()}.png`}
                  alt={attackingType}
                  className="row-header-icon"
                />
              </td>
              {types.map((defendingType, colIndex) => {
                const effectiveCol = colIndex + 1;

                // Access the effectiveness value
                let effectiveness = typeEffectivenessDataTyped[attackingType]?.[defendingType] ?? 1;
                if (isInverse) {
                  effectiveness =
                    effectiveness === 0 ? 2 : effectiveness === 2 ? 0.5 : effectiveness === 0.5 ? 2 : effectiveness;
                }

                // Determine hover/click states
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

                // Apply brightness logic
                const brightness =
                  isHovered || isClicked || isInHoveredRange || isInClickedRange
                    ? "brightness(100%)" // Highlight cells up to hovered/clicked index
                    : (isContentHovered || clickedRow !== null) && !isHovered && !isClicked
                    ? "brightness(45%)" // Dim other content cells when content is hovered or clicked
                    : "brightness(100%)"; // Default full brightness

                // Background color for effectiveness === 1 in the range
                const backgroundColor =
                  effectiveness === 1 && (isInHoveredRange || isInClickedRange)
                    ? "#ffffff28"
                    : "";

                  const borderColor =
                  isHovered || isClicked || isInHoveredRange || isInClickedRange
                    ? "inset 0 0 0 0.4px #dddddd6e" // Default for hovered/clicked
                    : (isContentHovered || clickedRow !== null) && !isHovered && !isClicked
                    ? "inset 0 0 0 0.4px #dddddd" // Darker for dimmed cells
                    : "inset 0 0 0 0.4px #dddddd6e"; // Default when inactive

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
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    style={{ filter: brightness, backgroundColor, borderColor }}
                  >
                    {effectiveness !== 1 && (hideX ? effectiveness : `${effectiveness}x`)}
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