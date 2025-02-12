// Component: TypeChartGrid.tsx
import React from "react";
import "./TypeChartGrid.css"; // Import CSS

type TypeChartGridProps = {
    isInverse: boolean;
};

const TypeChartGrid : React.FC<TypeChartGridProps> = ({
    isInverse
  }) => {


    return (
      <div className="type-chart">
        <h2>Type Chart</h2>
        <p>{isInverse ? "Inverse Mode On" : "Normal Mode"}</p>
        {/* Display Type Chart Grid */}
      </div>
    );
  };
  
  export default TypeChartGrid;
  