import express from "express";
import axios from "axios";
import cors from "cors";
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Nifty 50!!!");
});
app.get("/nifty50", async (req, res) => {
  try {
    const url =
      "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050";

    const response = await axios.get(url, {
      headers: {
        authority: "www.nseindia.com",
        method: "GET",
        path: "/api/equity-stockIndices?index=NIFTY%2050",
        scheme: "https",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
        Priority: "u=1, i",
        Referer:
          "https://www.nseindia.com/market-data/live-equity-market?symbol=NIFTY%2050",
        "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Brave";v="126"',
        "Sec-Ch-Ua-Mobile": "?1",
        "Sec-Ch-Ua-Platform": '"Android"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Gpc": "1",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
      },
    });
    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
