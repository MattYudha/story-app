import { createElement } from "../utils/dom.js";

export default class NotFoundView {
  constructor() {}

  init() {
    const content = createElement("div", { class: "not-found-container" });
    content.innerHTML = `
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p>Maaf, halaman yang Anda cari tidak ada. <a href="#/home">Kembali ke Beranda</a></p>
    `;
    document.getElementById("content").innerHTML = "";
    document.getElementById("content").appendChild(content);
  }

  cleanup() {
    console.log("NotFoundView cleanup called");
  }
}
