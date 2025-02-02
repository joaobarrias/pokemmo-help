// CaptureCalc.tsx
import React, { useState, useEffect } from "react";
import "./CaptureCalc.css";
import Select from 'react-select'; // Import react-select
import evolversPokemonData from "../../data/evolvers-condition.json"; // Import evolvers conditions
import { PokemonState } from '../../pages/CaptureChance';

interface CaptureCalcProps {
    pokemonState: PokemonState;
    level: string | null;
    currentHp: number | null;
    averageHp:number | null;
    selectedPokeball: any;
    selectedStatus: any;
  }
  
  const CaptureCalc: React.FC<CaptureCalcProps> = ({
    pokemonState,
    level,
    currentHp,
    selectedPokeball,
    selectedStatus,
    averageHp
  }) => {
    const [captureChance, setCaptureChance] = useState<number | null>(null);
    const [isCaveOrNight, setIsCaveOrNight] = useState(true);
    const [isMoonStoneEvolution, setIsMoonStoneEvolution] = useState(true);
    const [isHappinessEvolution, setIsHappinessEvolution] = useState(true);
    const [isSameEvolutionLineAndOppositeGender, setIsSameEvolutionLineAndOppositeGender] = useState(true);
    const [isFishingRodCatch, setIsFishingRodCatch] = useState(true);
    const [turns, setTurns] = useState<number>(11);
    const [isWaterDwelling, setIsWaterDwelling] = useState<boolean>(true);
    const [isFirstTurn, setIsFirstTurn] = useState<boolean>(true);
    const [myLevel, setMyLevel] = useState<number>(100);
    const [sleepTurns, setSleepTurns] = useState<number>(3);
    const [caughtCount, setCaughtCount] = useState<number>(15);

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
        const levelNumber = level ? parseInt(level) : 1; 

        // Handle balls with conditions
        if (typeof multiplier === 'function') {
            if (selectedPokeball.apiName === "net-ball") {
            multiplier = multiplier(pokemonState.types);
            } else if (selectedPokeball.apiName === "nest-ball") {
            multiplier = multiplier(levelNumber);
            } else if (selectedPokeball.apiName === "repeat-ball") {
            multiplier = multiplier(caughtCount);
            } else if (selectedPokeball.apiName === "timer-ball") {
            multiplier = multiplier(turns);
            } else if (selectedPokeball.apiName === "dive-ball") {
            multiplier = multiplier(isWaterDwelling);
            } else if (selectedPokeball.apiName === "dusk-ball") {
            multiplier = multiplier(isCaveOrNight);
            } else if (selectedPokeball.apiName === "quick-ball") {
            multiplier = multiplier(isFirstTurn);
            } else if (selectedPokeball.apiName === "dream-ball") {
            multiplier = multiplier(sleepTurns);
            } else if (selectedPokeball.apiName === "fast-ball") {
            multiplier = multiplier(pokemonState.stats.speed);
            } else if (selectedPokeball.apiName === "friend-ball") {
            multiplier = multiplier(isHappinessEvolution);
            } else if (selectedPokeball.apiName === "heavy-ball") {
            multiplier = multiplier(pokemonState.stats.weight);
            } else if (selectedPokeball.apiName === "level-ball") {
            multiplier = multiplier(myLevel, levelNumber);
            } else if (selectedPokeball.apiName === "love-ball") {
            multiplier = multiplier(isSameEvolutionLineAndOppositeGender);
            } else if (selectedPokeball.apiName === "lure-ball") {
            multiplier = multiplier(isFishingRodCatch);
            } else if (selectedPokeball.apiName === "moon-ball") {
            multiplier = multiplier(isMoonStoneEvolution);
            }
        }
        return multiplier;
    };

    useEffect(() => {
      // Ensure valid inputs before calculating
      if (!currentHp || !averageHp || !pokemonState.catchRate || !selectedPokeball || !selectedStatus) return;

      const ballMultiplier = getMultiplier();
      const captureRate = calculateCaptureChance(ballMultiplier);
      setCaptureChance(captureRate);
    }, [
      selectedPokeball,
      currentHp,
      selectedStatus,
      pokemonState,
      level,
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
      if (!pokemonState.catchRate || !currentHp || !averageHp) {
        return 0; // Return 0 if necessary data is missing
      }
      console.log("Current HP:", currentHp, "Max HP(IV 15.5):", averageHp, "Pokemon Catch Rate:", pokemonState.catchRate, "Ball Multiplier:", ballMultiplier, "Status Condition Multiplier:", selectedStatus.multiplier);
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
      return Math.round(chance * 10000) / 100; // Rounded to two decimal places
    }

    
    return (
      <div className="capture-calc-section">
        <div className="input-container">
          {selectedPokeball && selectedPokeball.apiName === "repeat-ball" && (
            <div className="input-field">
              <label htmlFor="caughtCount">Caught Count:</label>
              <input
                type="number"
                id="caughtCount"
                min="0"
                max="15"
                value={caughtCount}
                onChange={(e) => setCaughtCount(Number(e.target.value))}
              />
            </div>
          )}

          {selectedPokeball && selectedPokeball.apiName === "timer-ball" && (
            <div className="input-field">
              <label htmlFor="turns">Turns:</label>
              <input
                type="number"
                id="turns"
                min="1"
                max="11"
                value={turns}
                onChange={(e) => setTurns(Number(e.target.value))}
              />
            </div>
          )}

          {selectedPokeball && selectedPokeball.apiName === "dive-ball" && (
            <div className="input-field">
              <label htmlFor="isWaterDwelling">Currently on Water:</label>
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
              <label htmlFor="isCaveOrNight">Nighttime or in a Cave:</label>
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
                type="number"
                id="sleepTurns"
                min="0"
                max="3"
                value={sleepTurns}
                onChange={(e) => setSleepTurns(Number(e.target.value))}
              />
            </div>
          )}

          {selectedPokeball && selectedPokeball.apiName === "level-ball" && (
            <div className="input-field">
              <label htmlFor="myLevel">Your Pokémon's Level:</label>
              <input
                type="number"
                id="myLevel"
                min="1"
                max="100"
                value={myLevel}
                onChange={(e) => setMyLevel(Number(e.target.value))}
              />
            </div>
          )}

          {selectedPokeball && selectedPokeball.apiName === "love-ball" && (
            <div className="input-field">
              <label htmlFor="isSameEvolutionLineAndOppositeGender">
                Same Evolution Line & Opposite Gender:
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
              <label htmlFor="isFishingRodCatch">Currently Fishing:</label>
              <input
                type="checkbox"
                id="isFishingRodCatch"
                checked={isFishingRodCatch}
                onChange={(e) => setIsFishingRodCatch(e.target.checked)}
              />
            </div>
          )}

          {/* Handle special Poké Balls based on evolution logic */}
          {selectedPokeball && selectedPokeball.apiName === "moon-ball" && (
            <div className="input-field">
              <label>Moon Stone Evolution (Based on Pokémon's evolution):</label>
              <p>{pokemonState && evolversPokemonData.moonStoneEvolvers.includes(pokemonState.name) ? "Yes" : "No"}</p>
            </div>
          )}

          {selectedPokeball && selectedPokeball.apiName === "friend-ball" && (
            <div className="input-field">
              <label>Happiness Evolution (Based on Pokémon's evolution):</label>
              <p>{pokemonState && evolversPokemonData.happinessEvolvers.includes(pokemonState.name) ? "Yes" : "No"}</p>
            </div>
          )}
        </div>

        {/* Display calculated capture chance */}
        <div className="capture-chance">
          <p>Capture Chance: {captureChance}%</p>
        </div>

      </div>
    );
  };
  
  export default CaptureCalc;