// Component: BaseStats.tsx
import React from "react";
import "./BaseStats.css"; // CSS
import Select from "react-select"; // Dropdown component for conditions

// Interface for individual stat filter
interface StatFilter {
  condition: "More than" | "Equal to" | "Less than";
  value: number | null;
}

// Props interface for stats filters and setter
interface BaseStatsProps {
  statsFilters: {
    hp: StatFilter;
    attack: StatFilter;
    defense: StatFilter;
    special_attack: StatFilter;
    special_defense: StatFilter;
    speed: StatFilter;
  };
  setStatsFilters: React.Dispatch<React.SetStateAction<BaseStatsProps["statsFilters"]>>;
}

const statLabels = ["HP :", "Attack :", "Defense :", "Special Attack :", "Special Defense :", "Speed :"] as const;
const statKeys = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"] as const;
const conditionOptions = [
  { value: "More than", label: "More than" },
  { value: "Equal to", label: "Equal to" },
  { value: "Less than", label: "Less than" },
];

const BaseStats: React.FC<BaseStatsProps> = ({ statsFilters, setStatsFilters }) => {
  // Updates stat filter condition or value
  const handleStatChange = (stat: keyof typeof statsFilters, field: "condition" | "value", value: any) => {
    setStatsFilters((prev) => ({
      ...prev,
      [stat]: { ...prev[stat], [field]: field === "value" ? value : value },
    }));
  };

  // Handles input change, enforces 0-300 range
  const handleInputChange = (stat: keyof typeof statsFilters, value: string) => {
    if (value === "") {
      handleStatChange(stat, "value", null); // Clear value if empty
    } else if (/^\d*$/.test(value)) { // Only digits, no decimals
      const numValue = parseInt(value);
      if (numValue >= 0 && numValue <= 300) {
        handleStatChange(stat, "value", numValue);
      }
    }
  };

  // Handles condition dropdown change and blurs focus
  const handleSelectChange = (stat: keyof typeof statsFilters) => (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      handleStatChange(stat, "condition", selectedOption.value);
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur(); // Blur to reset border
      }
    }
  };

  return (
    <div className="base-stats-section">
      <h2>Base Stats</h2>
      <div className="stats-grid">
        {statKeys.map((stat, index) => (
          <div key={stat} className="stat-row">
            <label>{statLabels[index]}</label>
            <div className="stat-control">
              <Select
                value={conditionOptions.find((opt) => opt.value === statsFilters[stat].condition)}
                onChange={handleSelectChange(stat)}
                options={conditionOptions}
                className="stat-condition"
                classNamePrefix="react-select"
                isSearchable={false}
                menuShouldScrollIntoView={false}
              />
              <span className="separator">|</span>
              <input
                type="text"
                value={statsFilters[stat].value ?? ""}
                onChange={(e) => handleInputChange(stat, e.target.value)}
                className="stat-input"
                id={`stat-${stat}`}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseStats;