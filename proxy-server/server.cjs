const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { parseString } = require("xml2js");

const app = express();

app.use(cors());

// Existing endpoint for 'all-non-academic' events
app.get("/api/events", async (req, res) => {
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
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// New endpoint for 'visitfresnocounty' events
app.get("/api/fresno", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.visitfresnocounty.org/event/rss/"
    );
    const text = response.data;
    parseString(text, (err, result) => {
      if (err) {
        throw err;
      }
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
