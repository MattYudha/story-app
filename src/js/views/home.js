import HomePresenter from "../presenters/home-presenter.js";
import { createElement } from "../utils/dom.js";
import { initMap, addMarker } from "/js/map.js";
import { db } from "/js/db.js"; // Ditambahkan untuk I

export default class HomeView {
  constructor() {
    this.presenter = new HomePresenter(this);
  }

  async init() {
    const content = createElement("div", { class: "home-container" });
    content.innerHTML = `
        <h2 id="story-title" aria-live="polite">Daftar Cerita</h2>
        <div id="story-list" role="region" aria-label="Daftar cerita"></div>
      `;
    document.getElementById("content").innerHTML = "";
    document.getElementById("content").appendChild(content);

    // Inisialisasi IndexedDB dan penanganan offline
    try {
      await db.init();
      const cachedStories = await db.getAllStories();
      if (navigator.onLine === false && cachedStories.length > 0) {
        this.displayStories(cachedStories);
        this.showMessage("Anda offline. Menampilkan data dari cache.", null);
      }
    } catch (error) {
      console.error("Failed to initialize IndexedDB:", error);
    }

    // Muat ulang saat koneksi kembali
    window.addEventListener("online", () => {
      this.presenter.loadStories();
    });

    await this.presenter.loadStories();
  }

  displayStories(stories) {
    const storyList = document.getElementById("story-list");
    storyList.innerHTML = "";
    if (stories.length === 0) {
      storyList.innerHTML =
        "<p role='alert'>Tidak ada cerita untuk ditampilkan.</p>";
      return;
    }
    stories.forEach((story) => {
      const storyItem = createElement("div", {
        class: "story-item",
        role: "article",
      });
      storyItem.innerHTML = `
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <img src="${story.photoUrl}" alt="Foto cerita ${
        story.name
      }" style="max-width: 100%;">
          <p>Dibuat pada: ${new Date(story.createdAt).toLocaleDateString()}</p>
          ${
            story.lat && story.lon
              ? `<div id="map-${story.id}" style="height: 200px;" aria-label="Peta lokasi ${story.name}"></div>`
              : ""
          }
          <a href="#/detail/${story.id}" aria-label="Lihat detail cerita ${
        story.name
      }">Lihat Detail</a>
        `;
      storyList.appendChild(storyItem);

      if (story.lat && story.lon) {
        const map = initMap(`map-${story.id}`, story.lat, story.lon, 13);
        if (map) {
          addMarker(map, story.lat, story.lon, story.name);
        } else {
          console.warn(`Failed to initialize map for story ${story.id}`);
        }
      }
    });
  }

  showMessage(message, retryCallback) {
    const storyList = document.getElementById("story-list");
    storyList.innerHTML = `
        <p role="alert">${message}</p>
        ${
          retryCallback
            ? '<button id="retry-btn" aria-label="Coba lagi">Coba Lagi</button>'
            : ""
        }
      `;
    if (retryCallback) {
      document
        .getElementById("retry-btn")
        .addEventListener("click", retryCallback);
    }
  }

  cleanup() {
    console.log("HomeView cleanup called");
  }
}
