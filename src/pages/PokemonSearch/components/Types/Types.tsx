import React from "react";
import "./Types.css"; // CSS
import Select from "react-select";

// Props interface for type selection and condition
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
  // Toggles type selection in/out of selectedTypes array
  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Options for type condition dropdown
  const conditionOptions = [
    { value: "At least one", label: "At least one of these types" },
    { value: "Exactly", label: "Exactly these types" },
    { value: "Only", label: "Only these types" },
  ];

  // Updates type condition and blurs focus
  const handleSelectChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      setTypeCondition(selectedOption.value as "At least one" | "Exactly" | "Only");
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur(); // Blur to reset border
      }
    }
  };

  return (
    <div className="types-section">
      <h2>Types</h2>
      {/* Type condition dropdown */}
      <div className="type-condition">
        <Select
          value={conditionOptions.find((opt) => opt.value === typeCondition)}
          onChange={handleSelectChange}
          options={conditionOptions}
          className="type-condition-select"
          classNamePrefix="react-select"
          isSearchable={false}
        />
      </div>
      {/* Type selection grid */}
      <div className="type-images">
        {typeList.map((type) => (
          <div
            key={type}
            className={`type-item ${selectedTypes.includes(type) ? "selected" : ""}`}
            onClick={() => handleTypeToggle(type)}
          >
            <img
              src={`/types/icons/${type}.png`}
              alt={type}
              className="type-icon-grid"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Types;