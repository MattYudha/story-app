import AddStoryPresenter from "../presenters/add-story-presenter.js";
import { createElement } from "../utils/dom.js";
import {
  startCamera,
  captureImage,
  stopCamera,
  dataURLtoFile,
} from "/js/camera.js";
import { initMap, addMarker, onMapClick } from "/js/map.js";

export default class AddStoryView {
  constructor() {
    this.presenter = new AddStoryPresenter(this);
    this.stream = null;
    this.coordinates = {};
    this.marker = null;
    this.map = null;
  }

  async init() {
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
          <video id="camera" autoplay></video>
          <button type="button" id="capture">Ambil Foto</button>
          <canvas id="canvas" style="display:none;"></canvas>
        </div>
        <div class="form-group">
          <label for="map">Pilih Lokasi</label>
          <div id="map" style="height: 300px;"></div>
        </div>
        <button type="submit">Kirim Cerita</button>
      </form>
      <div id="login-section">
        <h3>Login untuk Mengunggah</h3>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required aria-required="true">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required aria-required="true">
        </div>
        <button type="button" id="login-btn">Login</button>
      </div>
    `;
    document.getElementById("content").innerHTML = "";
    document.getElementById("content").appendChild(content);

    const video = document.getElementById("camera");
    this.stream = await startCamera(video);

    this.map = initMap("map");
    if (this.map) {
      this.marker = addMarker(this.map, -6.2, 106.8, "Pilih lokasi");
      if (this.marker) {
        this.marker.setPopupContent(
          "Geser marker atau klik peta untuk memilih lokasi"
        );
        this.marker.dragging.enable();
        this.coordinates = { lat: -6.2, lon: 106.8 };

        this.marker.on("moveend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          this.coordinates = { lat, lon: lng };
        });

        onMapClick(this.map, (lat, lon) => {
          this.coordinates = { lat, lon };
          this.marker.setLatLng([lat, lon]);
        });
      } else {
        console.error("Failed to create marker: addMarker returned undefined");
      }
    } else {
      console.error("Failed to initialize map: initMap returned undefined");
    }

    document.getElementById("capture").addEventListener("click", async () => {
      const canvas = document.getElementById("canvas");
      const dataURL = captureImage(video, canvas);
      this.photo = dataURLtoFile(dataURL, "story.jpg");
    });

    document
      .getElementById("add-story-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const token = localStorage.getItem("token");
        const { lat, lon } = this.coordinates;
        await this.presenter.addStory(description, this.photo, lat, lon, token);
      });

    document.getElementById("login-btn").addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      await this.presenter.login({ email, password });
    });
  }

  stopCamera() {
    stopCamera(this.stream);
    this.stream = null;
  }

  cleanup() {
    if (this.stream) {
      this.stopCamera();
      console.log("Camera stream stopped on cleanup"); // Tambahkan log untuk debugging
    }
  }

  showMessage(message) {
    alert(message);
  }

  navigateToHome() {
    window.location.hash = "#/home";
  }
}
