fetch(
  "https://25livepub.collegenet.com/calendars/all-non-academic.rss?mixin=5578"
)
  .then((response) => response.text())
  .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
  .then((data) => {
    const items = data.querySelectorAll("item");
    const eventsContainer = document.querySelector(".fs-events-container");
    const allowedCategories = [
      "Campus Events/Activities",
      "Diversity Calendar",
      "Library Meetings/Workshops",
      "Music/Theatre Events",
      "Open to Public",
      "Save Mart Center",
      "Student Involvement",
    ];

    items.forEach((item) => {
      const title = item.querySelector("title").textContent;
      const description = item.querySelector("description").textContent;
      const categories = description
        .match(/<b>Categories<\/b>:&nbsp;(.+?)<br\/>/)[1]
        .split(", ");

      if (
        categories.some((category) =>
          allowedCategories.includes(category.trim())
        )
      ) {
        const dateTimeRegex =
          /(\w+,\s\w+\s\d{1,2},\s\d{4},\s\d{1,2}:\d{2}\s(?:AM|PM)\s&ndash;&nbsp;\d{1,2}:\d{2}\s(?:AM|PM))/;
        const dateTimeMatch = description.match(dateTimeRegex);
        const dateTime = dateTimeMatch
          ? dateTimeMatch[0]
          : "Date/Time not available";
        const locationRegex = /^(.+?)<br\/>/;
        const locationMatch = description.match(locationRegex);
        const location = locationMatch
          ? locationMatch[1]
          : "Location not available";

        const eventHtml = `
          <div class="event-info">
            <span class="event-title">${title}</span>
            <span class="event-date-time">${dateTime}</span>
            <span class="event-location">${location}</span>
            <div class="event-categories">${categories.join(", ")}</div>
          </div>
        `;

        eventsContainer.innerHTML += eventHtml;
      }
    });
  })
  .catch((error) =>
    console.error("Error fetching or parsing RSS feed:", error)
  );
