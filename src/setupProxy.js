const createProxyMiddleware = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/storymap-api",
    createProxyMiddleware({
      target: "http://localhost:8080",
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
};
