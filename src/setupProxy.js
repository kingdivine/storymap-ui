const createProxyMiddleware = require("http-proxy-middleware");

const storymapApiUrl =
  process.env.NODE_ENV === "production"
    ? "https://storymap-api-dq7bw.ondigitalocean.app"
    : "http://localhost:4000";

const storymapApiPath = process.env.NODE_ENV === "production" ? "/" : "/api";

module.exports = function (app) {
  app.use(
    "/storymap-api",
    createProxyMiddleware({
      target: storymapApiUrl,
      changeOrigin: true,
      pathRewrite: {
        "^/storymap-api": storymapApiPath,
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
};
