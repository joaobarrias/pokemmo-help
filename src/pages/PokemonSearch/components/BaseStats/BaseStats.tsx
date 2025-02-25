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
      [stat]: { ...prev[stat], [field]: field === "value" ? parseInt(value) || null : value },
    }));
  };

  return (
    <div className="base-stats-section">
      <h2>Base Stats</h2>
      <div className="stats-grid">
        {statKeys.map((stat) => (
          <div key={stat} className="stat-row">
            <label>{stat.charAt(0).toUpperCase() + stat.slice(1).replace("special", "Sp.")}</label>
            <Select
              value={conditionOptions.find((opt) => opt.value === statsFilters[stat].condition)}
              onChange={(opt) => handleStatChange(stat, "condition", opt!.value)}
              options={conditionOptions}
              className="stat-condition"
              classNamePrefix="react-select"
              isSearchable={false}
            />
            <input
              type="number"
              min="0"
              max="300"
              value={statsFilters[stat].value || ""}
              onChange={(e) => handleStatChange(stat, "value", e.target.value)}
              className="stat-input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseStats;