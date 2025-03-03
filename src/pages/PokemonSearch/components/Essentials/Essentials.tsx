// Component: Essentials.tsx
import React, { useState, useRef, useEffect } from "react";
import "./Essentials.css"; // CSS
import abilitiesData from "../../../../data/abilities-data.json"; // JSON data for ability details

// Props interface for ability, alpha, and reset callback
interface EssentialsProps {
  ability: string | null;
  setAbility: React.Dispatch<React.SetStateAction<string | null>>;
  isAlpha: boolean;
  setIsAlpha: React.Dispatch<React.SetStateAction<boolean>>;
  setResetAbilityCallback: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

const Essentials: React.FC<EssentialsProps> = ({ ability, setAbility, isAlpha, setIsAlpha, setResetAbilityCallback }) => {
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const suggestionRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [displayAbility, setDisplayAbility] = useState<string | null>(null);

  // Add/remove click outside listener for closing suggestions
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formats ability names (e.g., "water-absorb" to "Water Absorb")
  const formatAbilityName = (ability: string) =>
    ability
      .split(/[- ]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Unformats ability names (e.g., "Water Absorb" to "water-absorb")
  const unformatAbilityName = (ability: string) => ability.toLowerCase().replace(" ", "-");

  // Updates ability and suggestions on input change
  const handleInputChange = (value: string) => {
    setAbility(value ? unformatAbilityName(value) : null);
    setDisplayAbility(value ? formatAbilityName(value) : null);
    if (value.trim().length < 1) {
      setSuggestions(null); // Clear suggestions if empty
      return;
    }

    // Generate up to 10 matching ability suggestions
    const normalizedInput = value.toLowerCase().replace(" ", "-");
    const matches = Object.keys(abilitiesData)
      .filter((ability) => ability.toLowerCase().includes(normalizedInput))
      .map(formatAbilityName);
    setSuggestions(matches);
  };

  // Sets ability on suggestion click and closes dropdown
  const handleSuggestionClick = (suggestion: string) => {
    setAbility(unformatAbilityName(suggestion));
    setDisplayAbility(suggestion);
    setSuggestions(null);
    inputRef.current?.blur();
  };

  // Clears invalid ability on blur
  const handleBlur = () => {
    if (ability && !Object.keys(abilitiesData).includes(ability)) {
      setAbility(null);
      setDisplayAbility(null);
    }
  };

  // Registers reset callback with parent on mount
  useEffect(() => {
    setResetAbilityCallback(() => resetAbilityInput);
  }, []);

  // Clears displayed ability for reset functionality
  const resetAbilityInput = () => {
    setDisplayAbility(null);
  };

  // Closes suggestions if clicking outside input or dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (
      suggestionRef.current &&
      inputRef.current &&
      !suggestionRef.current.contains(e.target as Node) &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setSuggestions(null);
    }
  };

  return (
    <div className="essentials-section">
      <h2>Ability & Alpha</h2>
      <div className="essentials-row">
        {/* Ability input with suggestions */}
        <div className="ability-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={displayAbility || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter ability"
            className="ability-input"
            onFocus={(e) => e.target.select()} // Selects text on focus
          />
          {suggestions && (
            <ul ref={suggestionRef} className="ability-suggestions">
              {suggestions.map((suggestion) => (
                <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Alpha checkbox */}
        <label className="alpha-label">
          <input
            type="checkbox"
            checked={isAlpha}
            onChange={() => setIsAlpha(!isAlpha)}
          />
          Alpha
        </label>
      </div>
    </div>
  );
};

export default Essentials;