// Page: Calendar.tsx
import React, { useEffect } from "react";
import "./Calendar.css";

// Defines the props interface for the Calendar component, expecting an array of Pokémon objects
interface CalendarProps {
  allPokemon: { name: string; id: number }[];
}

// Calendar component displays a monthly schedule of roaming legendary Pokémon
const Calendar: React.FC<CalendarProps> = ({ allPokemon }) => {
  // Array of legendary Pokémon pairs available each month, cycling every three months
  const roamingLegendaries = [
    ["Zapdos", "Entei"],
    ["Moltres", "Suicune"],
    ["Articuno", "Raikou"],
  ];

  // Array of month names for display
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Creates a schedule mapping each month to its corresponding legendary Pokémon pair
  const schedule = months.map((month, index) => ({
    month,
    legendaries: roamingLegendaries[index % 3],
  }));

  // Retrieves the image URL for a Pokémon based on its name, using the allPokemon prop
  const getPokemonImageUrl = (name: string): string | null => {
    const pokemon = allPokemon.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    return pokemon ? `sprites/default/${pokemon.id}.png` : null;
  };

  // Scrolls to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Renders the calendar with a header, description, and a grid of monthly cards
  return (
    <div className="calendar-container">
      {/* Page title */}
      <h1>Roaming Legendaries Calendar</h1>
      {/* Description of the calendar’s purpose */}
      <p className="calendar-description">
        Check which Roaming Legendaries are available each month in PokeMMO.
      </p>
      {/* Grid of monthly cards displaying legendary Pokémon */}
      <div className="calendar-list">
        {schedule.map((entry, index) => (
          <div key={index} className="calendar-card">
            {/* Month name as card header */}
            <h2>{entry.month}</h2>
            {/* List of legendary Pokémon for the month */}
            <div className="calendar-pokemon-list">
              {entry.legendaries.map((legendary) => {
                const imageUrl = getPokemonImageUrl(legendary);
                return (
                  <div key={legendary} className="calendar-item">
                    {/* Pokémon sprite image, if available */}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={legendary}
                        className="calendar-image"
                      />
                    )}
                    {/* Pokémon name */}
                    <span className="calendar-name">{legendary}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;