// PokeBall.tsx
import React, { useEffect } from "react";
import "./PokeBall.css";
import Select from 'react-select'; // Import react-select
import { pokeballs } from "../../data/pokeballs"; // Import pokeballs

interface PokeBallProps {
  selectedPokeball: any;
  setSelectedPokeball: React.Dispatch<React.SetStateAction<any>>;
  preloadedImages: React.MutableRefObject<Set<string>>;
}

const PokeBall: React.FC<PokeBallProps> = ({ preloadedImages, selectedPokeball, setSelectedPokeball }) => {
  
  useEffect(() => {
    if (!selectedPokeball) {
      setSelectedPokeball(pokeballs[0]);  // Set the default Poké Ball object
    }
  }, [selectedPokeball, setSelectedPokeball]);

  const pokeballOptions = React.useMemo(() =>
    pokeballs.map((ball) => ({
      value: ball,  // Store full object
      label: (
        <div className="pokeball-option">
          <img src={ball.imagePath} alt={ball.name} className="pokeball-icon" loading="lazy" />
          <span>{ball.name}</span>
        </div>
      ),
    })),
    []
  );
  // Preload images when component mounts
  useEffect(() => {
      if (preloadedImages.current.size === 0) {
        preloadImages();
      }
  }, []);

  const preloadImages = async () => {
    pokeballs.forEach((ball) => {
      if (!preloadedImages.current.has(ball.imagePath)) {
        const img = new Image();
        img.src = ball.imagePath;
        img.onload = () => {
          preloadedImages.current.add(ball.imagePath);
        };
        preloadedImages.current.add(ball.imagePath);
      }
    });
  };

  const handlePokeballChange = (
    selectedOption: { value: any; label: JSX.Element } | null
  ) => {
    if (selectedOption) {
      setSelectedPokeball(selectedOption.value);  // Set full object
    }
  };

  const selectedPokeballDescription = selectedPokeball?.description || "";

  return (
    <div className="pokeball-section">
        <label htmlFor="pokeball-select" className="pokeball-label">
            Ball
        </label>
        <div className="pokeball-select-container">
          <Select
            options={pokeballOptions}
            value={
              selectedPokeball
                ? pokeballOptions.find((option) => option.value.name === selectedPokeball.name) // Find by object name
                : pokeballOptions[0]
            }
            onChange={handlePokeballChange}
            placeholder="Select Ball"
            className="pokeball-select"
            classNamePrefix="react-select"
          />
          <div className="pokeball-description-container">
            <p className="pokeball-description">{selectedPokeballDescription}</p>
          </div>
        </div>
    </div>
  );
};

export default PokeBall;
