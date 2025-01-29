// PokeBall.tsx
import React, { useEffect } from "react";
//import "./PokeBall.css";
import Select from 'react-select'; // Import react-select
import { pokeballs } from "../../data/pokeballs"; // Import pokeballs

interface PokeBallProps {
  selectedPokeball: string;
  setSelectedPokeball: React.Dispatch<React.SetStateAction<string>>;
  preloadedImages: React.MutableRefObject<Set<string>>;
}

const PokeBall: React.FC<PokeBallProps> = ({ preloadedImages, selectedPokeball, setSelectedPokeball }) => {
  
    const pokeballOptions = React.useMemo(() => 
      pokeballs.map((ball) => ({
        value: ball.name,
        label: (
          <div className="pokeball-option">
            <img src={ball.imagePath} alt={ball.name} className="pokeball-icon" />
            <span>{ball.name}</span>
          </div>
        ),
      })), 
      []
    );

    useEffect(() => {
        if (preloadedImages.current.size === 0) {
          preloadImages();
        }
      }, []);

    const preloadImages = async () => {
        pokeballs.forEach((ball) => {
        if (!preloadedImages.current.has(ball.imagePath)) {
            const img = new Image();
            img.src = ball.imagePath; // Preload the image
            img.onload = () => {
            // Ensure image is fully loaded and then mark it as preloaded
            preloadedImages.current.add(ball.imagePath);
            };
        }
        });
    };

    const handlePokeballChange = (
        selectedOption: { value: string; label: JSX.Element } | null
      ) => {
        if (selectedOption) {
          setSelectedPokeball(selectedOption.value);
        }
    };
  
    const selectedPokeballDescription = pokeballs.find((ball) => ball.name === selectedPokeball)?.description || "";

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
                ? pokeballOptions.find((option) => option.value === selectedPokeball)
                : pokeballOptions[0]
            }
            onChange={(selectedOption) => {
            if (selectedOption) {
                setSelectedPokeball(selectedOption.value);
            }
            }}
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
