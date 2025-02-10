// Component: PokeBall.tsx
import React, { useEffect, useRef } from "react";
import "./PokeBall.css"; // Import CSS
import Select from "react-select"; // Import react-select
import pokeballs from "../../../../data/pokeballs.json"; // Import pokeballs

interface PokeBallProps {
  selectedPokeball: any;
  setSelectedPokeball: React.Dispatch<React.SetStateAction<any>>;
}

const PokeBall: React.FC<PokeBallProps> = ({ selectedPokeball, setSelectedPokeball }) => {
  const preloadedImages = useRef<Set<string>>(new Set());

  // Set default Poké Ball if not selected
  useEffect(() => {
    if (!selectedPokeball) {
      setSelectedPokeball({ ...pokeballs["Poké Ball"], name: "Poké Ball" });  
    }
  }, [selectedPokeball, setSelectedPokeball]);

  // Preload Ball images
  useEffect(() => {
    Object.values(pokeballs).forEach((ball) => {
      if (!preloadedImages.current.has(ball.imagePath)) {
        const img = new Image();
        img.src = ball.imagePath;
        img.onload = () => {
          preloadedImages.current.add(ball.imagePath);
        };
      }
    });
  }, []);

  // Poké Ball selection handler
  const handlePokeballChange = ( selectedOption: { value: string; label: string; data?: any } | null ) => {
    if (selectedOption) {
      const updatedBall = { ...selectedOption.data, name: selectedOption.value };
      setSelectedPokeball(updatedBall);  // Set full object
    }
  };

  // Get the current Poké Ball key
  const currentPokeballKey = selectedPokeball
    ? selectedPokeball.name // Use the dynamic name from the state
    : "Poké Ball";
    
  // Poké Ball options for react-select
  const pokeballOptions = React.useMemo(() =>
    Object.keys(pokeballs).map((key) => {
      const ball = pokeballs[key as keyof typeof pokeballs];
      return {
        value: key,  // Store the Poké Ball name as the value
        label: key,  // Store the Poké Ball name as the label (for filtering)
        data: ball,  // Store the full object in data for later access
      };
    }), []
  );

  return (
    <div className="pokeball-section">
      <label htmlFor="pokeball-select" className="pokeball-label">Ball</label>
      <div className="pokeball-select-container">
        <Select
          id="pokeball-select"
          value={{ value: currentPokeballKey, label: currentPokeballKey }}
          onChange={handlePokeballChange}
          options={pokeballOptions}
          menuPortalTarget={document.body}
          className="pokeball-select"
          classNamePrefix="react-select"
          isSearchable={true}
          formatOptionLabel={(data) => (
            <div className="pokeball-option">
              <img src={pokeballs[data.value as keyof typeof pokeballs].imagePath} alt={data.value} className="pokeball-icon" loading="lazy" />
              <span>{data.value}</span>
            </div>
          )}
        />
        <div className="pokeball-description-container">
          <p className="pokeball-description">{selectedPokeball?.description || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default PokeBall;
