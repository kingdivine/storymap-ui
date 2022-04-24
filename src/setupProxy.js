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
  app.use(
    "/image-api",
    createProxyMiddleware({
      target: "https://storymap-images.fra1.digitaloceanspaces.com",
      changeOrigin: true,
      pathRewrite: {
        "^/image-api": "/",
      },
    })
  );
};
