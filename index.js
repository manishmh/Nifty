import express from "express";
import axios from "axios";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cors());

// Proxy setup
app.use(
  "/nse-api",
  createProxyMiddleware({
    target: "https://www.nseindia.com",
    changeOrigin: true,
    pathRewrite: {
      "^/nse-api": "",
    },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader(
        "User-Agent",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36"
      );
    },
  })
);

app.get("/", (req, res) => {
  res.send("Nifty 50 0!!!");
});

app.get("/nifty50", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
        },
      }
    );

    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
