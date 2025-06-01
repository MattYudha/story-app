import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  server: {
    port: 3000,
    cors: true,
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: "dist",
  },
  publicDir: "public",
  base: "/story-app/", // Pastikan sesuai dengan repositori
});
