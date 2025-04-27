// Import the rss-parser library to parse the PokeMMO events RSS feed
const Parser = require("rss-parser");

// Define the Netlify function handler, which processes incoming requests
exports.handler = async function (event, context) {
  try {
    // Initialize the RSS parser with custom fields to extract additional metadata from feed items
    const parser = new Parser({
      customFields: {
        item: ["dc:date", "dc:creator", "category"], // Extract date, creator, and category from RSS items
      },
    });

    // Set the RSS feed URL, using an environment variable or a hardcoded fallback
    const feedUrl = process.env.POKEMMO_EVENTS_RSS || "https://forums.pokemmo.com/index.php?/forum/36-official-events.xml/";
    // Fetch and parse the RSS feed asynchronously
    const feed = await parser.parseURL(feedUrl);

    // Get the client-provided date (e.g., "2025-04-28") from query parameters, if provided
    const clientDate = event.queryStringParameters?.date;
    // Use the client date if available; otherwise, fall back to the server's current date
    const today = clientDate ? new Date(clientDate) : new Date();
    // Normalize the date to midnight (00:00:00) to ensure date-only comparisons
    today.setHours(0, 0, 0, 0);

    // Helper function to parse the event date from the event title (e.g., "Sunday, 27th April")
    const parseEventDate = (title) => {
      // Regex for standard date format: "Sunday, 27th April"
      const dateRegex = /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i;
      // Fallback regex for reversed format: "Sunday, April 27th"
      const rangeRegex = /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{1,2})(?:st|nd|rd|th)?/i;

      let day, monthName;
      // Try matching the standard format first
      let dateMatch = title.match(dateRegex);
      if (dateMatch) {
        day = dateMatch[1]; // Extract day (e.g., "27")
        monthName = dateMatch[2]; // Extract month (e.g., "April")
      } else {
        // If standard format fails, try the reversed format
        dateMatch = title.match(rangeRegex);
        if (dateMatch) {
          monthName = dateMatch[1]; // Extract month (e.g., "April")
          day = dateMatch[2]; // Extract day (e.g., "27")
        }
      }

      // If no valid day or month is found, log a warning and skip the event
      if (!day || !monthName) {
        console.warn("No date found in title:", title);
        return null;
      }

      // Map month name to a 0-based index (January = 0, December = 11)
      const monthIndex = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
      ].indexOf(monthName.toLowerCase());

      // If month name is invalid, log a warning and skip
      if (monthIndex === -1) {
        console.warn("Invalid month name:", monthName);
        return null;
      }

      // Get the current month and year from today's date
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Infer the event year: use current year unless the event month is more than one month before the current month
      // This handles cases like January events in December (e.g., on Dec 30th, Jan 5th is next year)
      let year = currentYear;
      if (monthIndex < currentMonth) {
        year += 1;
      }

      // Create a Date object for the event
      const parsedDate = new Date(year, monthIndex, parseInt(day));
      // If the date is invalid (e.g., Feb 30th), log a warning and skip
      if (isNaN(parsedDate)) {
        console.warn("Failed to parse date: day =", day, "month =", monthName, "year =", year);
        return null;
      }

      return parsedDate;
    };

    // Helper function to tag events as "Today" or "Tomorrow" based on their date
    const getDateTags = (eventDate) => {
      // Create a date for tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const tags = [];
      // Normalize dates to midnight for comparison
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

      // Tag the event as "Today" if it matches today's date
      if (eventDateOnly.getTime() === todayOnly.getTime()) {
        tags.push("Today");
      }
      // Tag the event as "Tomorrow" if it matches tomorrow's date
      else if (eventDateOnly.getTime() === tomorrowOnly.getTime()) {
        tags.push("Tomorrow");
      }
      return tags;
    };

    // Process each item in the RSS feed
    const events = feed.items
      .map((item) => {
        // Use the item title or a fallback if missing
        const title = item.title || "Untitled Event";
        // Use content or description, with a fallback empty string
        const description = item.content || item.description || "";
        // Parse the event date from the title
        const eventDate = parseEventDate(title);
        // Skip if no valid date
        if (!eventDate) {
          return null;
        }

        // Filter out past events by comparing normalized dates
        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (eventDateOnly.getTime() < todayOnly.getTime()) {
          return null;
        }

        // Identify PvP events by checking for specific tags in the title (e.g., "[OU]")
        const isPvPEvent = /^\[(Doubles|UU|OU|NU)\]/.test(title);
        // Identify Catch events by checking for "catching" or "catch" in the description
        const isCatchEvent = /\b(catching|catch)\b/i.test(description);
        // Skip events that are neither PvP nor Catch
        if (!isPvPEvent && !isCatchEvent) {
          return null;
        }

        // Generate tags for the event ("Today" or "Tomorrow")
        const dateTags = getDateTags(eventDate);

        // Return the processed event object
        return {
          title: title,
          link: item.link, // URL to the event details
          eventDate: eventDate, // Parsed date object
          tags: dateTags, // Array of "Today" or "Tomorrow"
          isPvP: isPvPEvent, // Boolean indicating PvP event
        };
      })
      // Remove null entries (skipped events)
      .filter(Boolean)
      // Sort events by date (earliest first)
      .sort((a, b) => a.eventDate - b.eventDate);

    // Extract PvP events, including only title, link, and tags
    const pvpEvents = events
      .filter((e) => e.isPvP)
      .map(({ title, link, tags }) => ({ title, link, tags }));
    // Extract Catch events, including only title, link, and tags
    const catchEvents = events
      .filter((e) => !e.isPvP)
      .map(({ title, link, tags }) => ({ title, link, tags }));

    // Combine PvP and Catch events into the final result
    const result = [...pvpEvents, ...catchEvents];

    // Return a successful HTTP response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json", // Indicate JSON response
        "Access-Control-Allow-Origin": "*", // Allow cross-origin requests
        "Cache-Control": "no-cache", // Prevent caching to ensure fresh data
      },
      body: JSON.stringify(result), // Serialize the result to JSON
    };
  } catch (error) {
    // Log any errors (e.g., RSS fetch failure, parsing errors)
    console.error("Error fetching events:", error.message, error.stack);
    // Return an empty array to prevent the app from breaking
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify([]),
    };
  }
};