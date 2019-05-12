const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/import", (req, res) => {
  if (req.body.pgn) {
    const importButtonSelector = ".submit.button.text";
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://lichess.org/paste");
      await page.type("#form3-pgn", req.body.pgn);
      await Promise.all([
        page.click(importButtonSelector),
        page.waitForNavigation({ waitUntil: "networkidle0" })
      ]);
      await browser.close();
      if (page.url() === "https://lichess.org/import") {
        res.send({ error: "Could not upload png to lichess" });
      } else {
        res.send({ link: page.url() });
      }
    })();
  }
});

app.get("/", (req, res) => {
  res.send("Upload from pgn to lichess");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
