fetch("https://proxy-server-housing.wl.r.appspot.com/api/events")
  .then((response) => response.json())
  .then((json) => {
    const items = json.rss.channel[0].item;
    const eventsContainer = document.querySelector(".fs-events-container");

    items.forEach((item) => {
      const title = item.title[0];
      const description = item.description[0];
      const categoriesMatch = description.match(
        /<b>Categories<\/b>:&nbsp;(.+?)<br\/>/
      );
      let categories = categoriesMatch ? categoriesMatch[1].split(", ") : [];

      // Remove 'Display On (Master) Campus Events/Activities Calendar' and 'Display On Music/Theatre Calendar' from categories
      categories = categories.filter(
        (category) =>
          category !==
            "Display On (Master) Campus Events/Activities Calendar" &&
          category !== "Display On Music/Theatre Calendar" &&
          category !== "Display On (Master) Campus Events/Activities Calendar "
      );
      let categorySpans = categories
        .map((category) => `<span class="event-cat">${category}</span>`)
        .join(" ");
      /*
      const descriptionTextMatch = description.match(/<p>(.*?)<\/p>/);
      const descriptionText = descriptionTextMatch
        ? descriptionTextMatch[1]
        : "";
      */

      const dateTime = new Date(item.pubDate[0]);
      // Convert GMT to PST (GMT-8)
      dateTime.setHours(dateTime.getHours());
      const options = {
        month: "long",
        day: "numeric",
        year: "numeric",
      };
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
    });
  })
  .catch((error) =>
    console.error("Error fetching or parsing RSS feed:", error)
  );
