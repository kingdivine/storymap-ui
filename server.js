const express = require("express");
const path = require("path");

const app = express();
const createProxyMiddleware = require("http-proxy-middleware");

const PORT = process.env.port || 3000;

app.use(
  "/storymap-api",
  createProxyMiddleware({
    target: "https://storymap-api-dq7bw.ondigitalocean.app/api",
    changeOrigin: true,
    pathRewrite: {
      "^/storymap-api": "/",
    },
  })
);
app.use(
  "/mapbox-api",
  createProxyMiddleware({
    target: "https://api.mapbox.com",
    changeOrigin: true,
    pathRewrite: {
      "^/mapbox-api": "/",
    },
  })
);
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Storymap UI running on port ${PORT}`);
});
