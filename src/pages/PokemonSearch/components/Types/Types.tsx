// Component: Types.tsx
import React from "react";
import "./Types.css";
import Select from "react-select";

interface TypesProps {
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  typeCondition: "At least one" | "Exactly" | "Only";
  setTypeCondition: React.Dispatch<React.SetStateAction<"At least one" | "Exactly" | "Only">>;
}

const typeList = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel"
];

const Types: React.FC<TypesProps> = ({ selectedTypes, setSelectedTypes, typeCondition, setTypeCondition }) => {
  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const conditionOptions = [
    { value: "At least one", label: "At least one of these types" },
    { value: "Exactly", label: "Exactly these types" },
    { value: "Only", label: "Only these types" },
  ];

  return (
    <div className="types-section">
      <h2>Types</h2>
      <div className="type-condition">
        <Select
          value={conditionOptions.find((opt) => opt.value === typeCondition)}
          onChange={(opt) => setTypeCondition(opt!.value as "At least one" | "Exactly" | "Only")}
          options={conditionOptions}
          className="type-condition-select"
          classNamePrefix="react-select"
          isSearchable={false}
        />
      </div>
      <div className="type-images">
        {typeList.map((type) => (
          <div key={type} className="type-item">
            <img
              src={`/types/icons/${type}.png`}
              alt={type}
              className="type-icon"
              onClick={() => handleTypeToggle(type)}
            />
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => handleTypeToggle(type)}
              className="type-checkbox"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Types;