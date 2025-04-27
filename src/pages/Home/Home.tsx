// Page: Home.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// Defines the interface for an event object, containing title, link, and tags
interface Event {
  title: string;
  link: string;
  tags: string[];
}

// Defines the props interface for the Home component, expecting an array of Pokémon objects
interface HomeProps {
  allPokemon: { name: string; id: number }[];
}

// Home component serves as the landing page, showcasing features, events, and legendary Pokémon
const Home: React.FC<HomeProps> = ({ allPokemon }) => {
  // State to store fetched events
  const [events, setEvents] = useState<Event[]>([]);
  // State to store error messages for event fetching
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Array of legendary Pokémon pairs available each month, cycling every three months
  const roamingLegendaries = [
    ["Zapdos", "Entei"],
    ["Moltres", "Suicune"],
    ["Articuno", "Raikou"],
  ];

  // Determines the current month’s legendary Pokémon based on the date
  const getCurrentLegendaries = () => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const cycleIndex = monthIndex % 3;
    return roamingLegendaries[cycleIndex];
  };

  // Retrieves the image URL for a Pokémon based on its name, using the allPokemon prop
  const getPokemonImageUrl = (name: string): string | null => {
    const pokemon = allPokemon.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    return pokemon ? `sprites/default/${pokemon.id}.png` : null;
  };

  // Fetches events from a Netlify function and updates state
  const fetchEvents = async () => {
    try {
      const response = await fetch("/.netlify/functions/fetch-events");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setEvents(data);
      setEventsError(null);
    } catch (error) {
      setEventsError("Unable to load events. Please try again.");
    }
  };

  // Fetches events on component mount with a timeout to avoid blocking
  useEffect(() => {
    const timer = setTimeout(() => fetchEvents(), 0);
    return () => clearTimeout(timer);
  }, []);

  // Filters events into PvP events (matching specific formats) and Catch events (others)
  const pvpEvents = events.filter((event) => /^\[(Doubles|UU|OU|NU)\]/.test(event.title));
  const catchEvents = events.filter((event) => !/^\[(Doubles|UU|OU|NU)\]/.test(event.title));

  // Renders the home page with features, events, legendaries, and Discord link
  return (
    <div className="home-container">
      {/* Page title */}
      <h1>Welcome to PokeMMO Help! 🎮✨</h1>
      {/* Description of the site’s purpose */}
      <p className="home-description">
        Your go-to tool for PokeMMO trainers! Calculate capture chances, search for Pokémon, and analyze type effectiveness.
      </p>

      {/* Grid of feature cards linking to other pages */}
      <div className="feature-list">
        {/* Capture Chance feature card */}
        <div className="feature-card">
          <h2>🎯 Capture Chance</h2>
          <p>Calculate the probability of catching a Pokémon in PokeMMO with real-time updates.</p>
          <Link to="/capture-chance" className="feature-button">
            Try Now
          </Link>
        </div>

        {/* Pokémon Search feature card */}
        <div className="feature-card">
          <h2>🔍 Pokémon Search</h2>
          <p>Find Pokémon by abilities, moves, stats, types, and alpha state.</p>
          <Link to="/pokemon-search" className="feature-button">
            Try Now
          </Link>
        </div>

        {/* Type Coverage feature card */}
        <div className="feature-card">
          <h2>⚔️ Type Coverage</h2>
          <p>Analyze battle effectiveness with a dynamic type damage calculator.</p>
          <Link to="/type-coverage" className="feature-button">
            Try Now
          </Link>
        </div>
      </div>

      {/* Section displaying upcoming events */}
      <div className="events-section">
        <h2>📅 Upcoming Events</h2>
        {eventsError ? (
          /* Error message with retry button if event fetching fails */
          <div className="error-message">
            {eventsError}
            <button onClick={fetchEvents} className="retry-button">Retry</button>
          </div>
        ) : events.length === 0 ? (
          /* Loading message with spinner while events are fetching */
          <p className="loading-message">Loading events... <span className="spinner" /></p>
        ) : (
          /* Grid of PvP and Catch event sections */
          <div className="events-container">
            {/* PvP events section */}
            <div className="event-section">
              <h3>PvP Events</h3>
              {pvpEvents.length === 0 ? (
                <p>No upcoming PvP events.</p>
              ) : (
                <div className="event-list">
                  {pvpEvents.map((event, index) => (
                    <div key={index} className="event-item">
                      {/* Event title with external link */}
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-title"
                      >
                        {event.title}
                      </a>
                      {/* Event tags (Today or Tomorrow) */}
                      <div className="event-tags">
                        {event.tags
                          .filter((tag) => tag === "Today" || tag === "Tomorrow")
                          .map((tag) => (
                            <span
                              key={tag}
                              className={`event-tag tag-${tag.toLowerCase()}`}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Catch events section */}
            <div className="event-section">
              <h3>Catch Events</h3>
              {catchEvents.length === 0 ? (
                <p>No upcoming Catch events.</p>
              ) : (
                <div className="event-list">
                  {catchEvents.map((event, index) => (
                    <div key={index} className="event-item">
                      {/* Event title with external link */}
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-title"
                      >
                        {event.title}
                      </a>
                      {/* Event tags (Today or Tomorrow) */}
                      <div className="event-tags">
                        {event.tags
                          .filter((tag) => tag === "Today" || tag === "Tomorrow")
                          .map((tag) => (
                            <span
                              key={tag}
                              className={`event-tag tag-${tag.toLowerCase()}`}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section displaying current month’s roaming legendaries */}
      <div className="legendaries-section">
        <h2>🌟 Roaming Legendaries</h2>
        <div className="legendaries-card">
          <h3>Available this month:</h3>
          {/* List of current legendary Pokémon */}
          <div className="legendaries-list">
            {getCurrentLegendaries().map((legendary) => {
              const imageUrl = getPokemonImageUrl(legendary);
              return (
                <div key={legendary} className="legendary-item">
                  {/* Pokémon sprite image, if available */}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={legendary}
                      className="legendary-image"
                    />
                  )}
                  {/* Pokémon name */}
                  <span className="legendary-name">{legendary}</span>
                </div>
              );
            })}
          </div>
          {/* Link to the full calendar page */}
          <Link to="/calendar" className="legendaries-button">
            Calendar
          </Link>
        </div>
      </div>

      {/* Section with Discord link and bug reporting info */}
      <div className="discord-link">
        <p>
          Join our{" "}
          <a
            href="https://discord.com/invite/syryMAF4Kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>{" "}
          for updates, sneak peeks, and community contributions!
        </p>
        <p>
          Since this is a new project, bugs are to be expected. Please report them
          in our Discord. Thanks!
        </p>
      </div>
    </div>
  );
};

export default Home;