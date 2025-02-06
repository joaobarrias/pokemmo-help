// Component: CaptureCalc.tsx
import React, { useState, useEffect } from "react";
import "./CaptureCalc.css"; // Import CSS
import evolversPokemonData from "../../data/evolvers-condition.json"; // Import evolvers conditions
import { PokemonState } from '../../pages/CaptureChance/CaptureChance'; // Import current pokemon object

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
      if (selectedPokeball?.apiName === "moon-ball") {
        setIsMoonStoneEvolution(
          pokemonState && evolversPokemonData.moonStoneEvolvers.includes(pokemonState.name)
        );
      }
    
      if (selectedPokeball?.apiName === "friend-ball") {
        setIsHappinessEvolution(
          pokemonState && evolversPokemonData.happinessEvolvers.includes(pokemonState.name)
        );
      }
    }, [selectedPokeball, pokemonState]);


    const getMultiplier = () => {
      if (!selectedPokeball) return 1;

      let multiplier = selectedPokeball.multiplier;

      const levelNumber = level ? parseInt(level) : 50; 

      // Handle balls with conditions
      if (typeof multiplier === 'function') {
        if (selectedPokeball.apiName === "net-ball") {
        multiplier = multiplier(pokemonState.types);
        } else if (selectedPokeball.apiName === "nest-ball") {
        multiplier = multiplier(levelNumber);
        } else if (selectedPokeball.apiName === "repeat-ball") {
        const caughtCountNumber = caughtCount ? parseInt(caughtCount) : 0; 
        multiplier = multiplier(caughtCountNumber);
        } else if (selectedPokeball.apiName === "timer-ball") {
        const turnsNumber = turns ? parseInt(turns) : 1; 
        multiplier = multiplier(turnsNumber);
        } else if (selectedPokeball.apiName === "dive-ball") {
        multiplier = multiplier(isWaterDwelling);
        } else if (selectedPokeball.apiName === "dusk-ball") {
        multiplier = multiplier(isCaveOrNight);
        } else if (selectedPokeball.apiName === "quick-ball") {
        multiplier = multiplier(isFirstTurn);
        } else if (selectedPokeball.apiName === "dream-ball") {
        const sleepTurnsNumber = sleepTurns ? parseInt(sleepTurns) : 0; 
        multiplier = multiplier(sleepTurnsNumber);
        } else if (selectedPokeball.apiName === "fast-ball") {
        multiplier = multiplier(pokemonState.stats.speed);
        } else if (selectedPokeball.apiName === "friend-ball") {
        multiplier = multiplier(isHappinessEvolution);
        } else if (selectedPokeball.apiName === "heavy-ball") {
        multiplier = multiplier(pokemonState.stats.weight);
        } else if (selectedPokeball.apiName === "level-ball") {
        const myLevelNumber = myLevel ? parseInt(myLevel) : 1; 
        multiplier = multiplier(myLevelNumber, levelNumber);
        } else if (selectedPokeball.apiName === "love-ball") {
        multiplier = multiplier(isSameEvolutionLineAndOppositeGender);
        } else if (selectedPokeball.apiName === "lure-ball") {
        multiplier = multiplier(isFishingRodCatch);
        } else if (selectedPokeball.apiName === "moon-ball") {
        multiplier = multiplier(isMoonStoneEvolution);
        }
      }
      if (typeof multiplier === 'number') {
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
          {selectedPokeball && selectedPokeball.apiName === "repeat-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "timer-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "dive-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "dusk-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "quick-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "dream-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "level-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "love-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "lure-ball" && (
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

          {selectedPokeball && selectedPokeball.apiName === "moon-ball" && (
            <div className="input-field">
              <label>Does it evolve with a moon stone? {pokemonState && evolversPokemonData.moonStoneEvolvers.includes(pokemonState.name) ? "Yes" : "No"}</label>
            </div>
          )}

          {selectedPokeball && selectedPokeball.apiName === "friend-ball" && (
            <div className="input-field">
              <label>Does it evolve from happiness? {pokemonState && evolversPokemonData.happinessEvolvers.includes(pokemonState.name) ? "Yes" : "No"}</label>
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