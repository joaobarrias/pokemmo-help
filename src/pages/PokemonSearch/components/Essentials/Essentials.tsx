// Component: Essentials.tsx
import React, { useState, useRef, useEffect } from "react";
import "./Essentials.css";
import abilitiesData from "../../../../data/abilities-data.json";

interface EssentialsProps {
  ability: string | null;
  setAbility: React.Dispatch<React.SetStateAction<string | null>>;
  isAlpha: boolean;
  setIsAlpha: React.Dispatch<React.SetStateAction<boolean>>;
}

const Essentials: React.FC<EssentialsProps> = ({ ability, setAbility, isAlpha, setIsAlpha }) => {
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const suggestionRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setAbility(value);
    if (value.trim().length < 1) {
      setSuggestions(null);
      return;
    }

    const normalizedInput = value.toLowerCase().replace(" ", "-");
    const matches = Object.keys(abilitiesData)
      .filter((ability) => ability.toLowerCase().includes(normalizedInput))
      .slice(0, 10);
    setSuggestions(matches);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAbility(suggestion);
    setSuggestions(null);
    inputRef.current?.blur();
  };

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
      <h2>Essentials</h2>
      <div className="essentials-row">
        <div className="ability-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={ability || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter ability"
            className="ability-input"
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