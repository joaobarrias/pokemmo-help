// Component: Essentials.tsx
import React, { useState, useRef, useEffect } from "react";
import "./Essentials.css"; // CSS
import abilitiesData from "../../../../data/abilities-data.json"; // JSON data for ability details
import heldItemsData from "../../../../data/held-items-data.json"; // JSON data for held items
import eggGroupsData from "../../../../data/egg-groups-data.json"; // JSON data for egg groups
import Select from "react-select"; // Dropdown component for egg groups

// Props interface for ability, held item, alpha, egg groups, and reset callback
interface EssentialsProps {
  ability: string | null;
  setAbility: React.Dispatch<React.SetStateAction<string | null>>;
  heldItem: string | null;
  setHeldItem: React.Dispatch<React.SetStateAction<string | null>>;
  isAlpha: boolean;
  setIsAlpha: React.Dispatch<React.SetStateAction<boolean>>;
  eggGroupCondition: "Any of" | "Both of";
  setEggGroupCondition: React.Dispatch<React.SetStateAction<"Any of" | "Both of">>;
  eggGroups: (string | null)[];
  setEggGroups: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setResetAbilityCallback: React.Dispatch<React.SetStateAction<(() => void) | null>>;
  setResetHeldItemCallback: React.Dispatch<React.SetStateAction<(() => void) | null>>;
  setResetEggGroupsCallback: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

const Essentials: React.FC<EssentialsProps> = ({
  ability,
  setAbility,
  heldItem,
  setHeldItem,
  isAlpha,
  setIsAlpha,
  eggGroupCondition,
  setEggGroupCondition,
  eggGroups,
  setEggGroups,
  setResetAbilityCallback,
  setResetHeldItemCallback,
  setResetEggGroupsCallback,
}) => {
  const [abilitySuggestions, setAbilitySuggestions] = useState<string[] | null>(null);
  const [heldItemSuggestions, setHeldItemSuggestions] = useState<string[] | null>(null);
  const abilitySuggestionRef = useRef<HTMLUListElement | null>(null);
  const heldItemSuggestionRef = useRef<HTMLUListElement | null>(null);
  const abilityInputRef = useRef<HTMLInputElement | null>(null);
  const heldItemInputRef = useRef<HTMLInputElement | null>(null);
  const [displayAbility, setDisplayAbility] = useState<string | null>(null);
  const [displayHeldItem, setDisplayHeldItem] = useState<string | null>(null);

  // Add/remove click outside listener for closing suggestions
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formats names (e.g., "water-absorb" to "Water Absorb")
  const formatName = (name: string) =>
    name
      .split(/[- ]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Unformats names (e.g., "Water Absorb" to "water-absorb")
  const unformatName = (name: string) => name.toLowerCase().replace(" ", "-");

  // Updates ability and suggestions on input change
  const handleAbilityInputChange = (value: string) => {
    setAbility(value ? unformatName(value) : null);
    setDisplayAbility(value ? formatName(value) : null);
    if (value.trim().length < 1) {
      setAbilitySuggestions(null); // Clear suggestions if empty
      return;
    }

    // Generate up to 10 matching ability suggestions
    const normalizedInput = value.toLowerCase().replace(" ", "-");
    const matches = Object.keys(abilitiesData)
      .filter((ability) => ability.toLowerCase().includes(normalizedInput))
      .map(formatName);
    setAbilitySuggestions(matches);
  };

  // Updates held item and suggestions on input change
  const handleHeldItemInputChange = (value: string) => {
    setHeldItem(value ? unformatName(value) : null);
    setDisplayHeldItem(value ? formatName(value) : null);
    if (value.trim().length < 1) {
      setHeldItemSuggestions(null); // Clear suggestions if empty
      return;
    }

    // Generate up to 10 matching held item suggestions
    const normalizedInput = value.toLowerCase().replace(" ", "-");
    const matches = Object.keys(heldItemsData)
      .filter((item) => item.toLowerCase().includes(normalizedInput))
      .map(formatName);
    setHeldItemSuggestions(matches);
  };

  // Sets ability on suggestion click and closes dropdown
  const handleAbilitySuggestionClick = (suggestion: string) => {
    setAbility(unformatName(suggestion));
    setDisplayAbility(suggestion);
    setAbilitySuggestions(null);
    abilityInputRef.current?.blur();
  };

  // Sets held item on suggestion click and closes dropdown
  const handleHeldItemSuggestionClick = (suggestion: string) => {
    setHeldItem(unformatName(suggestion));
    setDisplayHeldItem(suggestion);
    setHeldItemSuggestions(null);
    heldItemInputRef.current?.blur();
  };

  // Clears invalid ability on blur
  const handleAbilityBlur = () => {
    if (ability && !Object.keys(abilitiesData).includes(ability)) {
      setAbility(null);
      setDisplayAbility(null);
    }
  };

  // Clears invalid held item on blur
  const handleHeldItemBlur = () => {
    if (heldItem && !Object.keys(heldItemsData).includes(heldItem)) {
      setHeldItem(null);
      setDisplayHeldItem(null);
    }
  };

  // Registers reset callbacks with parent on mount
  useEffect(() => {
    setResetAbilityCallback(() => resetAbilityInput);
    setResetHeldItemCallback(() => resetHeldItemInput);
    setResetEggGroupsCallback(() => resetEggGroupsInput);
  }, []);

  // Clears displayed ability for reset functionality
  const resetAbilityInput = () => {
    setDisplayAbility(null);
  };

  // Clears displayed held item for reset functionality
  const resetHeldItemInput = () => {
    setDisplayHeldItem(null);
  };

  // Clears egg groups for reset functionality
  const resetEggGroupsInput = () => {
    setEggGroups([null, null]);
  };

  // Closes suggestions if clicking outside input or dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (
      abilitySuggestionRef.current &&
      abilityInputRef.current &&
      !abilitySuggestionRef.current.contains(e.target as Node) &&
      !abilityInputRef.current.contains(e.target as Node)
    ) {
      setAbilitySuggestions(null);
    }
    if (
      heldItemSuggestionRef.current &&
      heldItemInputRef.current &&
      !heldItemSuggestionRef.current.contains(e.target as Node) &&
      !heldItemInputRef.current.contains(e.target as Node)
    ) {
      setHeldItemSuggestions(null);
    }
  };

  // Condition options for egg groups
  const conditionOptions = [
    { value: "Any of", label: "Any of" },
    { value: "Both of", label: "Both of" },
  ];

  // Egg group options from data
  const eggGroupOptions = [
    { value: null, label: "" },
    ...Object.values(eggGroupsData).map((group) => ({
      value: group.name,
      label: formatName(group.name),
    })),
  ];

  // Handle egg group condition change
  const handleEggGroupConditionChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      setEggGroupCondition(selectedOption.value as "Any of" | "Both of");
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) activeElement.blur(); // Blur to reset border
    }
  };

  // Handle egg group selection
  const handleEggGroupChange = (index: number) => (selectedOption: { value: string | null; label: string } | null) => {
    const newEggGroups = [...eggGroups];
    newEggGroups[index] = selectedOption ? selectedOption.value : null;
    setEggGroups(newEggGroups);
    const activeElement = document.activeElement as HTMLElement;
      if (activeElement) activeElement.blur(); // Blur to reset border
  };

  return (
    <div className="essentials-section">
      <h2>Essentials</h2>
      <div className="essentials-content">
        {/* Row 1: Egg Groups */}
        <div className="egg-group-section">
          <label className="egg-group-label">Egg Group</label>
          <div className="egg-group-selects">
            <Select
              value={conditionOptions.find((opt) => opt.value === eggGroupCondition)}
              onChange={handleEggGroupConditionChange}
              options={conditionOptions}
              className="egg-group-condition-select"
              classNamePrefix="react-select"
              isSearchable={false}
            />
            <Select
              value={eggGroupOptions.find((opt) => opt.value === eggGroups[0]) || null}
              onChange={handleEggGroupChange(0)}
              options={eggGroupOptions}
              className="egg-group-select"
              classNamePrefix="react-select"
              isSearchable={true} // Enable typing
              placeholder="Select egg group"
            />
            <Select
              value={eggGroupOptions.find((opt) => opt.value === eggGroups[1]) || null}
              onChange={handleEggGroupChange(1)}
              options={eggGroupOptions}
              className="egg-group-select"
              classNamePrefix="react-select"
              isSearchable={true} // Enable typing
              placeholder="Select egg group"
            />
          </div>
        </div>
        {/* Row 2: Ability and Alpha */}
        <div className="essentials-row ability-alpha-row">
          <div className="ability-input-wrapper">
            <input
              ref={abilityInputRef}
              type="text"
              value={displayAbility || ""}
              onChange={(e) => handleAbilityInputChange(e.target.value)}
              onBlur={handleAbilityBlur}
              placeholder="Enter ability"
              className="ability-input"
              onFocus={(e) => e.target.select()}
            />
            {abilitySuggestions && (
              <ul ref={abilitySuggestionRef} className="ability-suggestions">
                {abilitySuggestions.map((suggestion) => (
                  <li key={suggestion} onClick={() => handleAbilitySuggestionClick(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label className="alpha-label">
            <input
              type="checkbox"
              checked={isAlpha}
              onChange={() => setIsAlpha(!isAlpha)}
            />
            Alpha
          </label>
        </div>
        {/* Row 3: Held Item */}
        <div className="essentials-row held-item-row">
          <div className="held-item-input-wrapper">
            <input
              ref={heldItemInputRef}
              type="text"
              value={displayHeldItem || ""}
              onChange={(e) => handleHeldItemInputChange(e.target.value)}
              onBlur={handleHeldItemBlur}
              placeholder="Enter held item"
              className="held-item-input"
              onFocus={(e) => e.target.select()}
            />
            {heldItemSuggestions && (
              <ul ref={heldItemSuggestionRef} className="held-item-suggestions">
                {heldItemSuggestions.map((suggestion) => (
                  <li key={suggestion} onClick={() => handleHeldItemSuggestionClick(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Essentials;