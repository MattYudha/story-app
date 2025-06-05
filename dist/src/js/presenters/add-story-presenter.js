// src/js/presenters/add-story-presenter.js
import StoryModel from "../models/story-model.js"; // dari src/js/presenters/ ke src/js/models/story-model.js
import { initMap, onMapClick } from "../map.js"; // dari src/js/presenters/ ke src/js/map.js
import { showStoryNotification, subscribeUser } from "../notification.js"; // dari src/js/presenters/ ke src/js/notification.js

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
    this.coordinates = {};
  }

  initMap(containerId) {
    const map = initMap(containerId);
    onMapClick(map, (lat, lon) => {
      this.coordinates = { lat, lon };
      console.log("Koordinat dipilih:", lat, lon);
    });
  }

  getCoordinates() {
    return this.coordinates;
  }

  async addStory(description, photo, lat, lon, token) {
    try {
      let response;
      if (token) {
        response = await this.model.addStory({
          description,
          photo,
          lat: lat || this.coordinates.lat,
          lon: lon || this.coordinates.lon,
          token,
        });
        await subscribeUser(token);
        await showStoryNotification(description);
      } else {
        response = await this.model.addGuestStory({
          description,
          photo,
          lat: lat || this.coordinates.lat,
          lon: lon || this.coordinates.lon,
        });
      }
      this.view.showMessage("Cerita berhasil ditambahkan!");
      this.view.stopCamera();
      window.location.hash = "#/home";
    } catch (error) {
      this.view.showMessage(`Gagal menambahkan cerita: ${error.message}`);
    }
  }
}
