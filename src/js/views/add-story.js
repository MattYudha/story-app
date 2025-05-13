// src/js/views/add-story.js
import AddStoryPresenter from "../presenters/add-story-presenter.js";
import { createElement } from "../utils/dom.js";
import {
  startCamera,
  captureImage,
  stopCamera,
  dataURLtoFile,
} from "../camera.js";
import { getToken } from "../utils/auth.js";

export default class AddStoryView {
  constructor() {
    this.presenter = new AddStoryPresenter(this);
    this.stream = null;
    this.photo = null;
  }

  async init() {
    const token = getToken();
    if (!token) {
      this.showMessage("Silakan login terlebih dahulu!");
      window.location.hash = "#/login";
      return;
    }

    const content = createElement("div", { class: "add-story-container" });
    content.innerHTML = `
      <h2>Tambah Cerita Baru</h2>
      <form id="add-story-form">
        <div class="form-group">
          <label for="description">Deskripsi</label>
          <textarea id="description" required aria-required="true"></textarea>
        </div>
        <div class="form-group">
          <label for="photo">Foto</label>
          <video id="camera" autoplay playsinline></video>
          <button type="button" id="capture" aria-label="Ambil foto menggunakan kamera">Ambil Foto</button>
          <canvas id="canvas" style="display:none;"></canvas>
          <img id="preview" style="max-width: 100%; display:none;" alt="Pratinjau Foto" />
        </div>
        <div class="form-group">
          <label for="map">Pilih Lokasi</label>
          <div id="map" style="height: 300px;"></div>
        </div>
        <button type="submit" aria-label="Kirim cerita baru">Kirim Cerita</button>
      </form>
    `;
    document.getElementById("content").innerHTML = "";
    document.getElementById("content").appendChild(content);

    const video = document.getElementById("camera");
    try {
      this.stream = await startCamera(video);
    } catch (error) {
      this.showMessage(
        "Gagal mengakses kamera: Izin ditolak. Silakan izinkan akses kamera di pengaturan browser."
      );
      return;
    }

    this.presenter.initMap("map");

    document.getElementById("capture").addEventListener("click", async () => {
      const canvas = document.getElementById("canvas");
      const preview = document.getElementById("preview");
      const dataURL = captureImage(video, canvas);
      this.photo = dataURLtoFile(dataURL, "story.jpg");
      preview.src = dataURL;
      preview.style.display = "block";
    });

    document
      .getElementById("add-story-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        if (!this.photo) {
          this.showMessage("Silakan ambil foto terlebih dahulu!");
          return;
        }
        const { lat, lon } = this.presenter.getCoordinates();
        await this.presenter.addStory(description, this.photo, lat, lon, token);
      });
  }

  stopCamera() {
    stopCamera(this.stream);
  }

  showMessage(message) {
    alert(message);
  }
}
