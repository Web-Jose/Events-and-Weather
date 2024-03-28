// Encode the RSS feed URL
const fresnoRSS = encodeURIComponent(
  "https://www.visitfresnocounty.org/event/rss/"
);

console.time("FetchTime");
// Fetch the RSS feed through AllOrigins
fetch(`https://api.allorigins.win/get?url=${fresnoRSS}`)
  .then((response) => response.json())
  .then((data) => {
    console.timeEnd("FetchTime");
    // Assuming the data.contents is a string of your RSS XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");

    // Proceed with your existing logic, adjusted for direct XML manipulation
    const items = xmlDoc.querySelectorAll("item");
    const eventsContainer = document.querySelector(".fresno-events-container");

    items.forEach((item) => {
      const title = item.getElementsByTagName("title")[0].textContent;
      const categoryElements = item.getElementsByTagName("category");
      const categories = Array.from(categoryElements).map((cat) =>
        cat.textContent.trim()
      );

      // Skip events with the 'Brewery Events' category
      if (categories.includes("Brewery Events")) {
        return;
      }

      const pubDate = new Date(
        item.getElementsByTagName("pubDate")[0].textContent
      );
      const description =
        item.getElementsByTagName("description")[0].textContent;

      // Extract and modify the image URL from the description
      const imageRegex = /<img src='([^']+)'/;
      const imageMatch = description.match(imageRegex);
      let imageUrl = imageMatch ? imageMatch[1] : "";
      imageUrl = imageUrl.replace(/h_\d+/, "h_500").replace(/w_\d+/, "w_500");

      const formattedDate = pubDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const categorySpans = categories
        .map((category) => `<span class="event-cat">${category}</span>`)
        .join(" ");

      const eventHtml = `
        <div class="fresno-event">
          <div class="fresno-image">
            <img src="${imageUrl}" alt="${title}" />
          </div>
          <div class="fresno-info">
            <span class="fresno-title">${title}</span>
            <span class="fresno-date">${formattedDate}</span>
            <div class="fresno-categories">${categorySpans}</div>
          </div>
        </div>
      `;

      eventsContainer.innerHTML += eventHtml;
    });
  })
  .catch((error) =>
    console.error("Error fetching or parsing RSS feed:", error)
  );
