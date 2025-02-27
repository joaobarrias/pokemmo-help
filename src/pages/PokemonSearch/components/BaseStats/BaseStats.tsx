// Component: BaseStats.tsx
import React from "react";
import "./BaseStats.css";
import Select from "react-select";

interface StatFilter {
  condition: "More than" | "Equal to" | "Less than";
  value: number | null;
}

interface BaseStatsProps {
  statsFilters: {
    hp: StatFilter;
    attack: StatFilter;
    defense: StatFilter;
    specialAttack: StatFilter;
    specialDefense: StatFilter;
    speed: StatFilter;
  };
  setStatsFilters: React.Dispatch<React.SetStateAction<BaseStatsProps["statsFilters"]>>;
}

const statLabels = ["HP :", "Attack :", "Defense :", "Special Attack :", "Special Defense :", "Speed :"] as const;
const statKeys = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"] as const;
const conditionOptions = [
  { value: "More than", label: "More than" },
  { value: "Equal to", label: "Equal to" },
  { value: "Less than", label: "Less than" },
];

const BaseStats: React.FC<BaseStatsProps> = ({ statsFilters, setStatsFilters }) => {
  const handleStatChange = (stat: keyof typeof statsFilters, field: "condition" | "value", value: any) => {
    setStatsFilters((prev) => ({
      ...prev,
      [stat]: { ...prev[stat], [field]: field === "value" ? value : value },
    }));
  };

  const handleInputChange = (stat: keyof typeof statsFilters, value: string) => {
    if (value === "") {
      handleStatChange(stat, "value", null);
    } else if (/^\d*$/.test(value)) { // Only digits, no decimals
      const numValue = parseInt(value);
      if (numValue >= 0 && numValue <= 300) {
        handleStatChange(stat, "value", numValue);
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
            <Select
              value={conditionOptions.find((opt) => opt.value === statsFilters[stat].condition)}
              onChange={(opt) => handleStatChange(stat, "condition", opt!.value)}
              options={conditionOptions}
              className="stat-condition"
              classNamePrefix="react-select"
              isSearchable={false}
            />
            <input
              type="text"
              value={statsFilters[stat].value ?? ""}
              onChange={(e) => handleInputChange(stat, e.target.value)}
              className="stat-input"
              id={`stat-${stat}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseStats;