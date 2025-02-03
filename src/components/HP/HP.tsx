// HP.tsx
import React, { useState, useEffect } from "react";
import "./HP.css";

type HPProps = {
    averageHp: number | null;
    setCurrentHp: React.Dispatch<React.SetStateAction<number | null>>;
    captureControl: boolean;
    setCaptureControl: React.Dispatch<React.SetStateAction<boolean>>;
    hpControl: boolean;
  };
  
  const HP: React.FC<HPProps> = ({
    averageHp,
    setCurrentHp,
    captureControl,
    setCaptureControl,
    hpControl
  }) => {
  
    const [hpPercent, setHpPercent] = useState<string | null>('100');
    const [isExactHp, setIsExactHp] = useState(false);
    const [hpBarPercentage, setHpBarPercentage] = useState<number>(100);

    const handleExactHpToggle = () => {
        setIsExactHp(true);
    };

    const handleHpPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        let value = e.target.value;

        // Replace commas with dots for decimal numbers (if applicable)
        value = value.replace(',', '.');

        // Allow clearing the field
        if (value === "") {
            setHpPercent(null); // Set to null when input is empty
            return;
        }
        
        // Remove leading zeros but keep 0 as a valid number
        if (/^0+/.test(value) && value.length > 1) {
            // If the value is 0. or 0.something, don't remove the leading zero
            if (value === "0." || value.startsWith("0.") && value.length > 2) {
            // Keep it as is
            } else {
            value = value.replace(/^0+/, "");
            }
        }
        
        // Check if the input matches the pattern for up to 1 decimal place (including trailing dot)
        if (/^\d{1,3}(\.\d{0,1})?$/.test(value)) {
            // If the value ends with a dot (e.g., "4."), keep it in the string form
            if (value.endsWith('.')) {
            // Update state with the current value (still a string)
            setHpPercent(value); // Keep it as a string
            return;
            } else {
            // Convert to a number if the input is valid
            let numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
                // Clamp the value between 0 and 100
                numericValue = Math.max(0, Math.min(100, numericValue));
        
                // Ensure only 1 decimal place
                numericValue = parseFloat(numericValue.toFixed(1));
        
                // Update the state with the valid value
                setHpPercent(numericValue.toString()); // Convert back to string
            }
            }
        }
    };

    const handleHpBlur = () => {
        // If hpPercent is null or empty, set it to 0.1
        let correctedValue: number = hpPercent === null || hpPercent === "" ? 0.1 : parseFloat(hpPercent);
        
        // If the value is NaN (invalid input), fallback to 0.1
        if (isNaN(correctedValue) || correctedValue == 0) {
            correctedValue = 0.1;
        }
        
        // Clamp the value between 0 and 100
        correctedValue = Math.max(0, Math.min(100, correctedValue));
        
        // Ensure only 1 decimal place
        correctedValue = parseFloat(correctedValue.toFixed(1));
        
        // Update the state with the corrected value, converted back to a string
        setHpPercent(correctedValue.toString());
    };

    const getHpBarClass = (hpBarPercentage: number) => {
        if (hpBarPercentage <= 20) {
            return 'critical-health';  // Red/critical health
        } else if (hpBarPercentage <= 50) {
            return 'low-health';  // Yellow/low health
        } else {
            return '';  // Default (green) health
        }
    };

    useEffect(() => {
        if (!averageHp || !hpPercent) return;
        
        let current = 0;
        let percentage = 0;
        
        // Check if the Pokémon is Shedinja
        if (averageHp == 1) {
            current = 1; // Shedinja always has 1 HP
            percentage = 100; // 1 HP, so percentage is 100
        } else if (isExactHp) {
            current = 1; // Exactly 1 HP (False Swipe)
            percentage = (current / averageHp) * 100; // Calculate percentage only for exact HP
        } else if (hpPercent) {
            const hpPercentValue = parseFloat(hpPercent);
            current = (averageHp * hpPercentValue) / 100; // Calculate current HP based on %
            percentage = hpPercentValue; // Percentage is directly the input
        }
        // Round the values to 1 decimal place
        current = parseFloat(current.toFixed(1));
        percentage = parseFloat(percentage.toFixed(1));

        setCurrentHp(current);
        setHpBarPercentage(percentage);
        setCaptureControl(!captureControl);
    }, [ hpControl, hpPercent, isExactHp]); // Dependencies


  return (
    <div className="hp-section">
        <label className="hp-label">Current HP</label>
        <div className="hp-options">
            <div className="hp-toggle">
            <label>
                <input
                type="radio"
                name="hp-option"
                checked={!isExactHp}
                onChange={() => setIsExactHp(false)}
                />
                <input
                type="text"
                value={hpPercent || ""}
                onChange={handleHpPercentChange}
                onBlur={handleHpBlur}
                disabled={isExactHp}
                onFocus={(e) => e.target.select()}
                />
                <span> % HP left</span>
            </label>
            </div>
            <div className="hp-toggle">
            <label>
                <input
                type="radio"
                name="hp-option"
                checked={isExactHp}
                onChange={handleExactHpToggle}
                />
                Exactly 1 HP (using False Swipe)
            </label>
            </div>  
        </div>
        <div className="hp-bar-container">
            <div className="hp-bar-border">
            <div
                className={`hp-bar ${getHpBarClass(hpBarPercentage)}`}
                style={{
                width: `${hpBarPercentage}%`,
                backgroundColor: hpBarPercentage > 50 ? 'green' : hpBarPercentage > 20 ? 'yellow' : 'red',
                }}
            />
            </div>
            <div className="hp-bar-template">
            <img
                src="./status/hpbar.png"
                alt="HP Bar Template"
                className="hp-bar-template-img"
            />
            </div>
        </div>
    </div>
  );
};

export default HP;
