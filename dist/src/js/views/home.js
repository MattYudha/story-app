// src/js/views/home.js
import HomePresenter from "../presenters/home-presenter.js"; // dari src/js/views/ ke src/js/presenters/home-presenter.js
import { createElement } from "../utils/dom.js"; // dari src/js/views/ ke src/js/utils/dom.js

export default class HomeView {
  constructor() {
    this.presenter = new HomePresenter(this);
  }

  async init() {
    const content = createElement("div", { class: "home-container" });
    content.innerHTML = `
      <h2>Daftar Cerita</h2>
      <div id="story-list"></div>
    `;
    document.getElementById("content").innerHTML = "";
    document.getElementById("content").appendChild(content);

    await this.presenter.loadStories();
  }

  displayStories(stories) {
    const storyList = document.getElementById("story-list");
    storyList.innerHTML = "";
    stories.forEach((story) => {
      const storyItem = createElement("div", { class: "story-item" });
      storyItem.innerHTML = `
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <img src="${story.photoUrl}" alt="Foto cerita" style="max-width: 100%;">
        <p>Dibuat pada: ${new Date(story.createdAt).toLocaleDateString()}</p>
        ${
          story.lat && story.lon
            ? `<div id="map-${story.id}" style="height: 200px;"></div>`
            : ""
        }
        <a href="#/detail/${
          story.id
        }" aria-label="Lihat detail cerita">Lihat Detail</a>
      `;
      storyList.appendChild(storyItem);

      if (story.lat && story.lon) {
        this.presenter.initMap(
          `map-${story.id}`,
          story.lat,
          story.lon,
          story.name
        );
      }
    });
  }

  showMessage(message, retryCallback) {
    const storyList = document.getElementById("story-list");
    storyList.innerHTML = `
      <p>${message}</p>
      ${retryCallback ? '<button id="retry-btn">Coba Lagi</button>' : ""}
    `;
    if (retryCallback) {
      document
        .getElementById("retry-btn")
        .addEventListener("click", retryCallback);
    }
  }
}
