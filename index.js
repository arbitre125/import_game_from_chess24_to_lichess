const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;

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
      res.send({ link: page.url() });
    })();
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
