import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    viteTsconfigPaths(),
    eslint({ exclude: ["node_modules", "dist", "build", "public"] }),
  ],
  server: {
    open: true,
    port: 3000,
    proxy: {
      "/storymap-api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/storymap-api/, ""),
      },
      "/mapbox-api": {
        target: "https://api.mapbox.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mapbox-api/, ""),
      },
      "/image-api": {
        target: "https://fra1.digitaloceanspaces.com/storymap-images",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/image-api/, ""),
      },
    },
  },
});
