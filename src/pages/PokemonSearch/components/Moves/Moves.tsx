// Component: Moves.tsx
import React, { useState, useRef, useEffect } from "react";
import "./Moves.css";
import movesData from "../../../../data/moves-data.json";

interface MovesProps {
  moves: (string | null)[];
  setMoves: React.Dispatch<React.SetStateAction<(string | null)[]>>;
}

const Moves: React.FC<MovesProps> = ({ moves, setMoves }) => {
  const [suggestions, setSuggestions] = useState<(string[] | null)[]>([null, null, null, null]);
  const suggestionRefs = useRef<(HTMLUListElement | null)[]>([null, null, null, null]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newMoves = [...moves];
    newMoves[index] = value;
    setMoves(newMoves);

    if (value.trim().length < 1) {
      setSuggestions((prev) => prev.map((s, i) => (i === index ? null : s)));
      return;
    }

    const normalizedInput = value.toLowerCase().replace(" ", "-");
    const matches = Object.keys(movesData)
      .filter((move) => move.toLowerCase().includes(normalizedInput))
      .slice(0, 10); // Limit to 10 suggestions
    setSuggestions((prev) => prev.map((s, i) => (i === index ? matches : s)));
  };

  const handleSuggestionClick = (index: number, move: string) => {
    const newMoves = [...moves];
    newMoves[index] = move;
    setMoves(newMoves);
    setSuggestions((prev) => prev.map((s, i) => (i === index ? null : s)));
    inputRefs.current[index]?.blur();
  };

  const handleClickOutside = (e: MouseEvent) => {
    suggestionRefs.current.forEach((ref, index) => {
      if (
        ref &&
        inputRefs.current[index] &&
        !ref.contains(e.target as Node) &&
        !inputRefs.current[index]!.contains(e.target as Node)
      ) {
        setSuggestions((prev) => prev.map((s, i) => (i === index ? null : s)));
      }
    });
  };

  const getMoveColor = (move: string) => {
    const type = movesData[move as keyof typeof movesData]?.type;
    return {
      normal: "#A8A878", fire: "#F08030", water: "#6890F0", grass: "#78C850",
      electric: "#F8D030", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
      ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
      rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
      steel: "#B8B8D0",
    }[type] || "#FFFFFF";
  };

  return (
    <div className="moves-section">
      <h2>Moves</h2>
      {moves.map((move, index) => (
        <div key={index} className="move-input-wrapper">
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={move || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={`Enter move ${index + 1}`}
            className="move-input"
          />
          {suggestions[index] && (
            <ul ref={(el) => (suggestionRefs.current[index] = el)} className="move-suggestions">
              {suggestions[index]!.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleSuggestionClick(index, suggestion)}
                  style={{ color: getMoveColor(suggestion) }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Moves;