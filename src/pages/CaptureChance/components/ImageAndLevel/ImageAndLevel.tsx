// Component: ImageAndLevel.tsx
import React from 'react';
import "./ImageAndLevel.css"; // Import CSS
import { PokemonState } from '../../CaptureChance'; // Import current pokemon object

interface ImageAndLevelProps {
  pokemonState: PokemonState; 
  level: string | null;
  setLevel: (level: string | null) => void;
  isAlpha: boolean;  
}

const ImageAndLevel: React.FC<ImageAndLevelProps> = ({ 
  pokemonState, 
  level, 
  setLevel, 
  isAlpha }) => {
    
  const { imageUrl, types, name } = pokemonState;

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow clearing the field
    if (value === "") {
      setLevel(null); // Set to null when input is empty
      return;
    }

    // Ensure the value is a valid integer between 1 and 100
    if (/^\d*$/.test(value)) { // Allow only digits (no decimals)
      let numValue = parseInt(value, 10);
      // Clamp the value to be between 1 and 100
      numValue = Math.max(1, Math.min(100, numValue));
      setLevel(numValue.toString()); // Update the level
    }
  };

  const handleLevelBlur = () => {
     // If the input is empty or out of range, set level to 50
    if (level === '' || level === null) {
      setLevel('50');
    }
  };

  return (
    <div className="level-and-image-section">
      <div className={`level-and-image ${isAlpha ? 'alpha-active' : ''}`}>
        {isAlpha && <div className="alpha-background"></div>}
        {imageUrl  ? (
          <img
            src={imageUrl }
            alt={name}
            className="pokemon-image"
          />
        ) : (
          <div className="pokemon-image"></div>
        )}
      </div>
      {/* Display type icons */}
      <div className="types-container">
        {types.map((type, index) => (
          <img
            key={index}
            src={`/types/${type}.png`}
            alt={type}
            className="type-icon"
          />
        ))}
      </div>
      <div className="level-input-container">
        <label className="level-label">Level</label>
        <input
            id="level"
            type="text"
            className="level-input"
            value={level || ""}
            onChange={handleLevelChange}
            onBlur={handleLevelBlur} 
            onFocus={(e) => e.target.select()}
        />
      </div>
    </div>
  );
};

export default ImageAndLevel;
