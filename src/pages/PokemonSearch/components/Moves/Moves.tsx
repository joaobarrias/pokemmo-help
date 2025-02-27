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
  const [displayMoves, setDisplayMoves] = useState<(string | null)[]>([null, null, null, null]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatMoveName = (move: string) =>
    move
      .split(/[- ]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const unformatMoveName = (move: string) => move.toLowerCase().replace(" ", "-");

  const handleInputChange = (index: number, value: string) => {
    const newMoves = [...moves];
    const newDisplayMoves = [...displayMoves];
    newMoves[index] = value ? unformatMoveName(value) : null;
    newDisplayMoves[index] = value ? formatMoveName(value) : null;
    setMoves(newMoves);
    setDisplayMoves(newDisplayMoves);

    if (value.trim().length < 1) {
      setSuggestions((prev) => prev.map((s, i) => (i === index ? null : s)));
      return;
    }

    const normalizedInput = value.toLowerCase().replace(" ", "-");
    const matches = Object.keys(movesData)
      .filter((move) => move.toLowerCase().includes(normalizedInput))
      .map(formatMoveName)
      .slice(0, 10);
    setSuggestions((prev) => prev.map((s, i) => (i === index ? matches : s)));
  };

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
    const type = movesData[unformatMoveName(move) as keyof typeof movesData]?.type;
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