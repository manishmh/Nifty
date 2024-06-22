import express from "express";
import axios from "axios";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import axiosRetry from "axios-retry";
import puppeteer from "puppeteer";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Nifty 50  0!!!");
});

// Proxy setup
app.use(
  "/nse-api",
  createProxyMiddleware({
    target: "https://www.nseindia.com",
    changeOrigin: true,
    pathRewrite: {
      "^/nse-api": "", // remove base path
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(
        "User-Agent",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36"
      );
      console.log("Proxy request headers:", proxyReq.getHeaders());
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error");
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log("Proxy response status:", proxyRes.statusCode);
    },
    timeout: 10000,
    secure: false,
  })
);

app.get("/pupt", async (req, res) => {
  try {
    const url =
      "https://www.nseindia.com/market-data/live-equity-market?symbol=NIFTY%2050";

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
    res.status(200).send("done");

    await browser.close();
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).send("Internal server error");
  }
});
app.get("/nifty50", async (req, res) => {
  try {
    const url =
      "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050";
    console.log("Requesting URL:", url);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
        // "Accept-Language": "en-US,en;q=0.5",
      },
    });
    // console.log("Response data:", response.data);

    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
