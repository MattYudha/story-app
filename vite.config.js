import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  server: {
    port: 3000,
    cors: true,
    fs: {
      strict: false, // Mengizinkan akses ke file di luar root, diperlukan untuk sw.js
    },
  },
  build: {
    outDir: "../dist",
  },
  publicDir: "../public", // Disesuaikan untuk memastikan folder public diakses dengan benar
  base: "/dicoding-story/", // Ditambahkan untuk GitHub Pages deployment
});
