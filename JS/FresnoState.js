const rssUrl = encodeURIComponent(
  "https://25livepub.collegenet.com/calendars/all-non-academic.rss"
);

fetch(`https://api.allorigins.win/get?url=${rssUrl}`)
  .then((response) => response.json())
  .then((data) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "application/xml");
    const items = xmlDoc.querySelectorAll("item");
    const eventsContainer = document.querySelector(".fs-events-container");

    // Get the current date and reset time to 00:00:00 for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    items.forEach((item) => {
      const title = item.querySelector("title").textContent;
      const description = item.querySelector("description").textContent;
      const pubDate = item.querySelector("pubDate").textContent;
      const dateTime = new Date(pubDate);

      // Continue only if the event date is today or in the future
      if (dateTime >= today) {
        // Processing categories and other elements as before
        let categoriesMatch = description.match(
          /<b>Categories<\/b>:&nbsp;(.+?)<br\/>/
        );
        let categories = categoriesMatch ? categoriesMatch[1].split(", ") : [];

        categories = categories.filter(
          (category) =>
            category !==
              "Display On (Master) Campus Events/Activities Calendar" &&
            category !== "Display On Music/Theatre Calendar" &&
            category !==
              "Display On (Master) Campus Events/Activities Calendar "
        );

        let categorySpans = categories
          .map((category) => `<span class="event-cat">${category}</span>`)
          .join(" ");

        const options = { month: "long", day: "numeric", year: "numeric" };
        const formattedDate = dateTime.toLocaleDateString("en-US", options);
        const formattedTime = dateTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

        const locationRegex = /^(.+?)<br\/>/;
        const locationMatch = description.match(locationRegex);
        const location = locationMatch
          ? locationMatch[1]
          : "Location not available";

        // Construct and append the HTML
        const eventHtml = `
          <div class="event-info">
            <span class="event-title">${title}</span>
            <div class="event-date-time">
              <span class="event-date">${formattedDate}</span>
              <span class="event-time">${formattedTime}</span>
            </div>
            <span class="event-location">${location}</span>
            <div class="event-categories">${categorySpans}</div>
          </div>
        `;

        eventsContainer.innerHTML += eventHtml;
      }
    });
  })
  .catch((error) =>
    console.error("Error fetching or parsing RSS feed:", error)
  );
