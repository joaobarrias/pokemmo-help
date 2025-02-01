// CaptureCalc.tsx
import React, { useState, useEffect, useRef } from "react";
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
    const [multiplier, setMultiplier] = useState<number>(1);
    const [isCaveOrNight, setIsCaveOrNight] = useState(false);
    const [isMoonStoneEvolution, setIsMoonStoneEvolution] = useState(false);
    const [isHappinessEvolution, setIsHappinessEvolution] = useState(false);
    const [turns, setTurns] = useState<number>(0);
    const [isWaterDwelling, setIsWaterDwelling] = useState<boolean>(false);
    const [isFirstTurn, setIsFirstTurn] = useState<boolean>(false);
    const [myLevel, setMyLevel] = useState<number>(0);
    const [sleepTurns, setSleepTurns] = useState<number>(0);
    const [caughtCount, setCaughtCount] = useState<number>(0);
    
    const getMultiplier = () => {
        if (!selectedPokeball) return 1;

        let multiplier = selectedPokeball.multiplier;

        // Handle balls with conditions
        if (typeof multiplier === 'function') {
            if (selectedPokeball.apiName === "net-ball") {
            multiplier = multiplier(pokemonState.types);
            } else if (selectedPokeball.apiName === "nest-ball") {
            multiplier = multiplier(level);
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
            multiplier = multiplier(isFirstTurn);
            } else if (selectedPokeball.apiName === "friend-ball") {
            multiplier = multiplier(isHappinessEvolution);
            } else if (selectedPokeball.apiName === "heavy-ball") {
            multiplier = multiplier(pokemonState.stats.weight);
            } else if (selectedPokeball.apiName === "level-ball") {
            multiplier = multiplier(isFirstTurn);
            } else if (selectedPokeball.apiName === "love-ball") {
            multiplier = multiplier(isFirstTurn);
            } else if (selectedPokeball.apiName === "lure-ball") {
            multiplier = multiplier(isFirstTurn);
            } else if (selectedPokeball.apiName === "moon-ball") {
            multiplier = multiplier(isMoonStoneEvolution);
            }
        }

        return multiplier;
        };



    return (
      
    );
  };
  
  export default CaptureCalc;