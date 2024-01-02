import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { parseString } from "xml2js";

const app = express();

// Use cors middleware to allow cross-origin requests
app.use(cors());

app.get("/api/events", async (req, res) => {
  try {
    const response = await fetch(
      "https://25livepub.collegenet.com/calendars/all-non-academic.rss?mixin=5578"
    );
    const text = await response.text();
    parseString(text, (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result); // Send JSON formatted response
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
