// src/js/main.js
import { initRouter } from "./router.js";

// Seleksi elemen id="main-content" bisa disesuaikan kembali jika berbeda
const mainContent = document.querySelector("#main-content");

// Seleksi elemen class="skip-to-content" (sesuai dengan index.html)
const skipLink = document.querySelector(".skip-to-content");

skipLink.addEventListener("click", function (event) {
  event.preventDefault(); // Mencegah refresh halaman
  skipLink.blur(); // Menghilangkan fokus skip to content
  mainContent.focus(); // Fokus ke konten utama
  mainContent.scrollIntoView(); // Halaman scroll ke konten utama
});

initRouter();
