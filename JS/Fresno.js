fetch("https://proxy-server-fs.wl.r.appspot.com/api/fresno")
  .then((response) => response.json())
  .then((json) => {
    const items = json.rss.channel[0].item;
    const eventsContainer = document.querySelector(".fresno-events-container");

    items.forEach((item) => {
      const title = item.title[0];
      const categories = item.category.map((cat) => cat.trim());
      // Skip events with the 'Brewery Events' category
      if (categories.includes("Brewery Events")) {
        return;
      }
      const pubDate = new Date(item.pubDate[0]);
      const description = item.description[0];

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
