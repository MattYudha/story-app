import DetailPresenter from "../presenters/detail-presenter.js";
import { createElement } from "../utils/dom.js";
import { getToken } from "../utils/auth.js";
import { initMap, addMarker } from "/js/map.js"; // Tambahkan impor untuk fungsi peta

export default class DetailView {
  constructor() {
    this.presenter = new DetailPresenter(this);
  }

  async init({ id }) {
    const token = getToken();
    if (!token) {
      window.location.hash = "#/login";
      return;
    }

    const content = createElement("div", { class: "detail-container" });
    content.innerHTML = `
      <h2>Detail Cerita</h2>
      <div id="story-detail"></div>
    `;
    document.getElementById("content").innerHTML = "";
    document.getElementById("content").appendChild(content);

    try {
      const story = await this.presenter.getStoryDetail(id, token);
      this.displayStory(story);
    } catch (error) {
      this.showMessage(error.message);
    }
  }

  displayStory(story) {
    const storyDetail = document.getElementById("story-detail");
    storyDetail.innerHTML = `
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <img src="${story.photoUrl}" alt="Foto cerita" style="max-width: 100%;">
      <p>Dibuat pada: ${new Date(story.createdAt).toLocaleDateString()}</p>
      ${
        story.lat && story.lon
          ? `<div id="map-detail" style="height: 300px;"></div>`
          : ""
      }
    `;

    if (story.lat && story.lon) {
      const map = initMap("map-detail", story.lat, story.lon, 13);
      addMarker(map, story.lat, story.lon, story.name);
    }
  }

  showMessage(message) {
    const storyDetail = document.getElementById("story-detail");
    storyDetail.innerHTML = `<p>${message}</p>`;
  }

  cleanup() {
    // Tidak ada pembersihan khusus untuk DetailView
    console.log("DetailView cleanup called");
  }
}
