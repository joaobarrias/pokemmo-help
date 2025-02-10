// Component: CaptureCalc.tsx
import React, { useState, useEffect } from "react";
import "./CaptureCalc.css"; // Import CSS
import pokemmoData from "../../../../data/pokemmo-data.json"; // Import pokemmo data
import { PokemonState } from '../../CaptureChance'; // Import current pokemon object

interface CaptureCalcProps {
    pokemonState: PokemonState;
    level: string | null;
    currentHp: number | null;
    averageHp:number | null;
    selectedPokeball: any;
    selectedStatus: any;
    captureControl : boolean;
  }
  
  const CaptureCalc: React.FC<CaptureCalcProps> = ({
    pokemonState,
    level,
    currentHp,
    selectedPokeball,
    selectedStatus,
    averageHp,
    captureControl
  }) => {
    const [captureChance, setCaptureChance] = useState<number | null>(null);
    const [currentBallMultiplier, setCurrentBallMultiplier] = useState<number | null>(1);
    const [isCaveOrNight, setIsCaveOrNight] = useState(true);
    const [isMoonStoneEvolution, setIsMoonStoneEvolution] = useState(true);
    const [isHappinessEvolution, setIsHappinessEvolution] = useState(true);
    const [isSameEvolutionLineAndOppositeGender, setIsSameEvolutionLineAndOppositeGender] = useState(false);
    const [isFishingRodCatch, setIsFishingRodCatch] = useState(true);
    const [turns, setTurns] = useState<string | null>('11');
    const [isWaterDwelling, setIsWaterDwelling] = useState<boolean>(true);
    const [isFirstTurn, setIsFirstTurn] = useState<boolean>(true);
    const [myLevel, setMyLevel] = useState<string | null>('50');
    const [sleepTurns, setSleepTurns] =  useState<string | null>('3');
    const [caughtCount, setCaughtCount] =  useState<string | null>('15');

    useEffect(() => {
      if (!pokemonState) return;
      const pokemonName = pokemonState.name.toLowerCase().replace(' ', '-').replace('.', '');
      const pokemon = (pokemmoData as any)[pokemonName];
      if (pokemon && selectedPokeball?.name === "Moon Ball") {
        setIsMoonStoneEvolution(pokemon?.evolutionType === "moonStone");
      }
  
      if (pokemon && selectedPokeball?.name === "Friend Ball") {
        setIsHappinessEvolution(pokemon?.evolutionType === "happiness");
      }

    }, [selectedPokeball, pokemonState.name]);


    const getMultiplier = () => {
      if (!selectedPokeball) return 1;

      let multiplier = selectedPokeball.multiplier;
      const levelNumber = level ? parseInt(level, 10) : 50;

      // Arguments required for special Poké Balls
      const ballArguments: Record<string, any[]> = {
        "Net Ball": [pokemonState?.types || []],
        "Nest Ball": [levelNumber],
        "Repeat Ball": [caughtCount ? parseInt(caughtCount, 10) : 0],
        "Timer Ball": [turns ? parseInt(turns, 10) : 1],
        "Dive Ball": [isWaterDwelling],
        "Dusk Ball": [isCaveOrNight],
        "Quick Ball": [isFirstTurn],
        "Dream Ball": [sleepTurns ? parseInt(sleepTurns, 10) : 0],
        "Fast Ball": [pokemonState?.stats?.speed || 0],
        "Friend Ball": [isHappinessEvolution],
        "Heavy Ball": [pokemonState?.stats?.weight || 0],
        "Level Ball": [myLevel ? parseInt(myLevel, 10) : 1, levelNumber],
        "Love Ball": [isSameEvolutionLineAndOppositeGender],
        "Lure Ball": [isFishingRodCatch],
        "Moon Ball": [isMoonStoneEvolution],
      };

      // Check if multiplier is a function stored as a string
      if (typeof selectedPokeball.multiplier === "string") {
        try {
          // Convert the string into an executable function
          const multiplierFunc = new Function("return " + selectedPokeball.multiplier)();
          
          // Ensure it's a function before calling it
          if (typeof multiplierFunc === "function") {
            const ballArgs = ballArguments[selectedPokeball.name] || [];
            multiplier = multiplierFunc(...ballArgs);
          } else {
            console.warn(`Invalid function for ${selectedPokeball.name}`);
          }
        } catch (error) {
          console.error("Error processing multiplier function:", error);
        }
      }

      // Ensure we round the multiplier properly
      if (typeof multiplier === "number") {
        multiplier = parseFloat(multiplier.toFixed(1));
      }

      setCurrentBallMultiplier(multiplier);
      return multiplier;
    };


    useEffect(() => {
      // Ensure valid inputs before calculating
      if (!currentHp || !averageHp || !pokemonState.catchRate || !selectedPokeball || !selectedStatus || !level) return;

      const ballMultiplier = getMultiplier();
      const captureRate = calculateCaptureChance(ballMultiplier);
      setCaptureChance(captureRate);
    }, [
      selectedPokeball,
      selectedStatus,
      captureControl,
      caughtCount,
      turns,
      isWaterDwelling,
      isCaveOrNight,
      isFirstTurn,
      sleepTurns,
      myLevel,
      isSameEvolutionLineAndOppositeGender,
      isFishingRodCatch
    ]);

    const calculateCaptureChance = (ballMultiplier: number) => {
      if (!pokemonState.catchRate || !currentHp || !averageHp || !ballMultiplier || !selectedStatus.multiplier) {
        return 0; // Return 0 if necessary data is missing
      }
      
      // Step 1: Calculate X
      let X = ((3 * averageHp - 2 * currentHp) * (pokemonState.catchRate * ballMultiplier)) / (3 * averageHp) * selectedStatus.multiplier;
  
      // Step 2: Calculate Y (if X < 255)
      let Y = 0;
      if (X < 255) {
        const denominator = Math.sqrt(Math.sqrt(16711680 / X));
        Y = 1048560 / denominator;
      } else {
        Y = 65535;
      }

      // Step 3: Calculate the capture chance
      const chance = Math.pow(Y / 65536, 4);
      if (chance >= 0.9999) {
        return 100;
      }
      // Return the capture chance as a percentage
      return Math.round(chance * 10000) / 100; // Rounded to two decimal numbers
    }

    // Single handler for all onChange events
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
      const value = e.target.value;
      
      // Handle clearing of fields
      if (value === "") {
        setFieldValue(fieldName, null);
        return;
      }

      // Ensure the value is a valid integer and process it
      if (/^\d*$/.test(value)) {
        let numValue = parseInt(value, 10);
        numValue = clampValue(fieldName, numValue);  // Clamp to a specific range
        setFieldValue(fieldName, numValue.toString());  // Update the state
      }
    };

    // Helper function to clamp values based on the field
    const clampValue = (fieldName: string, value: number) => {
      switch (fieldName) {
        case 'caughtCount':
          return Math.max(0, Math.min(15, value));
        case 'turns':
          return Math.max(1, Math.min(11, value));
        case 'sleepTurns':
          return Math.max(0, Math.min(3, value));
        case 'myLevel':
          return Math.max(1, Math.min(100, value));
        default:
          return value;
      }
    };

    // Generic state setter for input fields
    const setFieldValue = (fieldName: string, value: string | null) => {
      switch (fieldName) {
        case 'caughtCount':
          setCaughtCount(value);
          break;
        case 'turns':
          setTurns(value);
          break;
        case 'sleepTurns':
          setSleepTurns(value);
          break;
        case 'myLevel':
          setMyLevel(value);
          break;
        default:
          break;
      }
    };

    const handleInputBlur= () => {
      if (caughtCount === '' || caughtCount === null) {
        setCaughtCount('15');
      }
      if (turns === '' || turns === null) {
        setTurns('11');
      }
      if (sleepTurns === '' || sleepTurns === null) {
        setSleepTurns('3');
      }
      if (myLevel === '' || myLevel === null) {
        setMyLevel('50');
      }
    }

    // Helper function to return a CSS class based on chance
    const getChanceColorClass = (chance: number | null) => {
      if (chance === null) return "low-chance";
      if (chance < 20) return "low-chance";
      if (chance < 99.99) return "medium-chance";
      return "high-chance";
    };

    return (
      <div className="capture-calc-section">
        <div className="input-container">

          <p>Ball Multiplier: {currentBallMultiplier}x</p>
          {selectedPokeball?.name === "Repeat Ball" && (
            <div className="input-field">
              <label htmlFor="caughtCount">How many caught?</label>
              <input
                type="text"
                id="caughtCount"
                value={caughtCount || ""}
                onChange={(e) => handleInputChange(e, 'caughtCount')}
                onBlur={handleInputBlur}
                onFocus={(e) => e.target.select()}
              />
            </div>
          )}

          {selectedPokeball?.name === "Timer Ball" && (
            <div className="input-field">
              <label htmlFor="turns">Turns passed:</label>
              <input
                type="text"
                id="turns"
                value={turns || ""}
                onChange={(e) => handleInputChange(e, 'turns')}
                onBlur={handleInputBlur}
                onFocus={(e) => e.target.select()}
              />
            </div>
          )}

          {selectedPokeball?.name === "Dive Ball" && (
            <div className="input-field">
              <label htmlFor="isWaterDwelling">Currently on Water?</label>
              <input
                type="checkbox"
                id="isWaterDwelling"
                checked={isWaterDwelling}
                onChange={(e) => setIsWaterDwelling(e.target.checked)}
              />
            </div>
          )}

          {selectedPokeball?.name === "Dusk Ball" && (
            <div className="input-field">
              <label htmlFor="isCaveOrNight">Nighttime or in a Cave?</label>
              <input
                type="checkbox"
                id="isCaveOrNight"
                checked={isCaveOrNight}
                onChange={(e) => setIsCaveOrNight(e.target.checked)}
              />
            </div>
          )}

          {selectedPokeball?.name === "Quick Ball" && (
            <div className="input-field">
              <label htmlFor="isFirstTurn">Is it Turn 1?</label>
              <input
                type="checkbox"
                id="isFirstTurn"
                checked={isFirstTurn}
                onChange={(e) => setIsFirstTurn(e.target.checked)}
              />
            </div>
          )}

          {selectedPokeball?.name === "Dream Ball" && (
            <div className="input-field">
              <label htmlFor="sleepTurns">Turns Asleep (0-3):</label>
              <input
                type="text"
                id="sleepTurns"
                value={sleepTurns || ""}
                onChange={(e) => handleInputChange(e, 'sleepTurns')}
                onBlur={handleInputBlur}
                onFocus={(e) => e.target.select()}
              />
            </div>
          )}

          {selectedPokeball?.name === "Level Ball" && (
            <div className="input-field">
              <label htmlFor="myLevel">Your Pokémon's Level:</label>
              <input
                type="text"
                id="myLevel"
                value={myLevel || ""}
                onChange={(e) => handleInputChange(e, 'myLevel')}
                onBlur={handleInputBlur}
                onFocus={(e) => e.target.select()}
              />
            </div>
          )}

          {selectedPokeball?.name === "Love Ball" && (
            <div className="input-field">
              <label htmlFor="isSameEvolutionLineAndOppositeGender">
                Same Evolution Line & Opposite Gender?
              </label>
              <input
                type="checkbox"
                id="isSameEvolutionLineAndOppositeGender"
                checked={isSameEvolutionLineAndOppositeGender}
                onChange={(e) => setIsSameEvolutionLineAndOppositeGender(e.target.checked)}
              />
            </div>
          )}

          {selectedPokeball?.name === "Lure Ball" && (
            <div className="input-field">
              <label htmlFor="isFishingRodCatch">Currently Fishing?</label>
              <input
                type="checkbox"
                id="isFishingRodCatch"
                checked={isFishingRodCatch}
                onChange={(e) => setIsFishingRodCatch(e.target.checked)}
              />
            </div>
          )}

          {selectedPokeball?.name === "Moon Ball" && (
            <div className="input-field">
              <label>Does it evolve with a moon stone? {isMoonStoneEvolution ? "Yes" : "No"}</label>
            </div>
          )}

          {selectedPokeball?.name === "Friend Ball" && (
            <div className="input-field">
              <label>Does it evolve from happiness? {isHappinessEvolution ? "Yes" : "No"}</label>
            </div>
          )}
        </div>

        {/* Display calculated capture chance */}
        <div className="capture-chance">
          <p className={`chance-text ${getChanceColorClass(captureChance)}`}>
            Capture Chance: {captureChance !== null ? captureChance + "%" : "0%"}
          </p>
        </div>

      </div>
    );
  };
  
  export default CaptureCalc;