// Component: Moves.tsx
import React, { useState, useRef, useEffect } from "react";
import "./Moves.css"; // CSS
import movesData from "../../../../data/moves-data.json"; // JSON data for move details

// Props interface for move selection and reset callback
interface MovesProps {
  moves: (string | null)[];
  setMoves: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setResetMovesCallback: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

const Moves: React.FC<MovesProps> = ({ moves, setMoves, setResetMovesCallback }) => {
  const [suggestions, setSuggestions] = useState<(string[] | null)[]>([null, null, null, null]);
  const suggestionRefs = useRef<(HTMLUListElement | null)[]>([null, null, null, null]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  const [displayMoves, setDisplayMoves] = useState<(string | null)[]>([null, null, null, null]);

  // Add/remove click outside listener for closing suggestions
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formats move names (e.g., "tackle" to "Tackle")
  const formatMoveName = (move: string) =>
    move
      .split(/[- ]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Unformats move names (e.g., "Tackle" to "tackle")
  const unformatMoveName = (move: string) => move.toLowerCase().replace(" ", "-");

  // Updates moves and suggestions on input change
  const handleInputChange = (index: number, value: string) => {
    const newMoves = [...moves];
    const newDisplayMoves = [...displayMoves];
    newMoves[index] = value ? unformatMoveName(value) : null;
    newDisplayMoves[index] = value ? formatMoveName(value) : null;
    setMoves(newMoves);
    setDisplayMoves(newDisplayMoves);

    if (value.trim().length < 1) {
      setSuggestions((prev) => prev.map((s, i) => (i === index ? null : s))); // Clear suggestions if empty
      return;
    }

    // Generate up to 10 matching move suggestions
    const normalizedInput = value.toLowerCase().replace(" ", "-");
    const matches = Object.keys(movesData)
      .filter((move) => move.toLowerCase().includes(normalizedInput))
      .map(formatMoveName)
      .slice(0, 10);
    setSuggestions((prev) => prev.map((s, i) => (i === index ? matches : s)));
  };

  // Sets move on suggestion click and closes dropdown
  const handleSuggestionClick = (index: number, move: string) => {
    const newMoves = [...moves];
    const newDisplayMoves = [...displayMoves];
    newMoves[index] = unformatMoveName(move);
    newDisplayMoves[index] = move;
    setMoves(newMoves);
    setDisplayMoves(newDisplayMoves);
    setSuggestions((prev) => prev.map((s, i) => (i === index ? null : s)));
    inputRefs.current[index]?.blur();
  };

  // Clears invalid moves on blur
  const handleBlur = (index: number) => {
    const move = moves[index];
    if (move && !Object.keys(movesData).includes(move)) {
      const newMoves = [...moves];
      const newDisplayMoves = [...displayMoves];
      newMoves[index] = null;
      newDisplayMoves[index] = null;
      setMoves(newMoves);
      setDisplayMoves(newDisplayMoves);
    }
  };

  // Closes suggestions if clicking outside input or dropdown
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

  // Returns move type color for suggestion styling
  const getMoveColor = (move: string) => {
    const type = movesData[unformatMoveName(move) as keyof typeof movesData]?.type;
    return {
      normal: "#A8A878", fire: "#F08030", water: "#6890F0", grass: "#78C850",
      electric: "#F8D030", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
      ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
      rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
      steel: "#B8B8D0",
    }[type] || "#FFFFFF";
  };

  // Registers reset callback with parent on mount
  useEffect(() => {
    setResetMovesCallback(() => resetMovesInputs);
  }, []);

  // Clears displayed moves for reset functionality
  const resetMovesInputs = () => {
    setDisplayMoves([null, null, null, null]);
  };

  return (
    <div className="moves-section">
      <h2>Moves</h2>
      {moves.map((_, index) => (
        <div key={index} className="move-input-wrapper">
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={displayMoves[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onBlur={() => handleBlur(index)}
            placeholder={`Enter move ${index + 1}`}
            className="move-input"
            onFocus={(e) => e.target.select()} // Selects text on focus
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