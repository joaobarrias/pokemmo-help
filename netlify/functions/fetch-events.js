const Parser = require("rss-parser");
const parser = new Parser({
  customFields: {
    item: ["dc:date", "dc:creator", "category"],
  },
});

exports.handler = async function (event, context) {
  try {
    const feedUrl = process.env.POKEMMO_EVENTS_RSS || "https://forums.pokemmo.com/index.php?/forum/36-official-events.xml/";
    
    const feed = await parser.parseURL(feedUrl);

    // Helper to parse event date from title
    const parseEventDate = (title) => {

      const dateRegex = /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i;
      const rangeRegex = /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{1,2})(?:st|nd|rd|th)?/i;

      let day, monthName;
      let dateMatch = title.match(dateRegex);
      if (dateMatch) {
        day = dateMatch[1];
        monthName = dateMatch[2];
      } else {
        dateMatch = title.match(rangeRegex);
        if (dateMatch) {
          monthName = dateMatch[1];
          day = dateMatch[2];
        }
      }

      if (!day || !monthName) {
        console.warn("No date found in title:", title);
        return null;
      }

      const monthIndex = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
      ].indexOf(monthName.toLowerCase());

      if (monthIndex === -1) {
        console.warn("Invalid month name:", monthName);
        return null;
      }

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let year = currentYear;
      if (monthIndex < currentMonth - 1) {
        year += 1;
      }

      const parsedDate = new Date(year, monthIndex, parseInt(day));
      if (isNaN(parsedDate)) {
        console.warn("Failed to parse date: day =", day, "month =", monthName, "year =", year);
        return null;
      }

      return parsedDate;
    };

    // Helper to determine if event is today or tomorrow
    const getDateTags = (eventDate) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const tags = [];
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

      if (eventDateOnly.getTime() === todayOnly.getTime()) {
        tags.push("Today");
      } else if (eventDateOnly.getTime() === tomorrowOnly.getTime()) {
        tags.push("Tomorrow");
      }
      return tags;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const events = feed.items
      .map((item) => {
        const title = item.title || "Untitled Event";
        const description = item.content || item.description || "";
        const eventDate = parseEventDate(title);
        if (!eventDate) {
          return null;
        }

        // Filter out past events
        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (eventDateOnly.getTime() < todayOnly.getTime()) {
          return null;
        }

        // Filter for PvP or Catch events
        const isPvPEvent = /^\[(Doubles|UU|OU|NU)\]/.test(title);
        const isCatchEvent = /\b(catching|catch)\b/i.test(description);
        if (!isPvPEvent && !isCatchEvent) {
          return null;
        }

        const dateTags = getDateTags(eventDate);

        return {
          title: title,
          link: item.link,
          eventDate: eventDate,
          tags: dateTags,
          isPvP: isPvPEvent,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.eventDate - b.eventDate);

    // Split into PvP and Catch events, no limits
    const pvpEvents = events
      .filter((e) => e.isPvP)
      .map(({ title, link, tags }) => ({ title, link, tags }));
    const catchEvents = events
      .filter((e) => !e.isPvP)
      .map(({ title, link, tags }) => ({ title, link, tags }));

    const result = [...pvpEvents, ...catchEvents];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error fetching events:", error.message, error.stack);
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