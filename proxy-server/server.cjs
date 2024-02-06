const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { parseString } = require("xml2js");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 21600, checkperiod: 22000 }); // 21600 seconds = 6 hours
const cron = require("node-cron");

// Schedule tasks to be run on the server every 6 hours.
cron.schedule("0 */6 * * *", function () {
  console.log("Running a task every 6 hours");
  myCache.flushAll(); // This clears the cache, so fresh data is fetched next time.
});

const app = express();

app.use(cors());

// Existing endpoint for 'all-non-academic' events
app.get("/api/events", async (req, res) => {
  const cacheKey = "api-events";
  const cachedData = myCache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData); // Send cached data if available
  }
  try {
    const response = await axios.get(
      "https://25livepub.collegenet.com/calendars/all-non-academic.rss?mixin=5578"
    );
    const text = response.data;
    parseString(text, (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
    });
    myCache.set(cacheKey, result); // Cache the result
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// New endpoint for 'visitfresnocounty' events
app.get("/api/fresno", async (req, res) => {
  const cacheKey = "api-fresno"; // Unique cache key for this endpoint
  const cachedData = myCache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData); // Send cached data if available
  }

  try {
    const response = await axios.get(
      "https://www.visitfresnocounty.org/event/rss/"
    );
    const text = response.data;
    parseString(text, (err, result) => {
      if (err) {
        throw err;
      }
      myCache.set(cacheKey, result); // Cache the result
      res.json(result);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
