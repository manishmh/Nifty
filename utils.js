// const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";

const url =
  "https://www.nseindia.com/market-data/live-equity-market?symbol=NIFTY%2050";

export async function scrapeData() {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: false, // Run in headless mode
    });
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url, { waitUntil: "networkidle2" });

    // await page.waitForTimeout(3000);
    // await page.waitForTimeout(3000);

    const tbodyContent = await page.evaluate(() => {
      const tbody = document.querySelector("tbody");
      return tbody ? tbody.innerHTML : "No <tbody> found";
    });

    console.log(tbodyContent);

    await browser.close();
  } catch (error) {
    console.error("Error during scraping:", error);
  }
}

scrapeData();
