
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();

async function latestPriceScrapping() {
  const url = "http://dam.gov.bd/?L=B";
  const priceArray = [];
  await axios(url).then((response) => {
    const html_data = response.data;
    const $ = cheerio.load(html_data);
    $('#wrapper > div > #bcontainer > #bbody > div.mymarquee > #marqueeborder > #marqueecontent > span.stockbox ').each((index, elem) => {

      $(elem).children().each((childID, childElem) => {

        priceArray.push($(childElem).parent().next().text());
      })
    })


  });
  return priceArray;
}

app.get("/", async (req, res) => {
  try {
    const pricingLIst = await latestPriceScrapping();
    return res.status(200).json(pricingLIst);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`The server is active and running on port ${PORT}`)
);

