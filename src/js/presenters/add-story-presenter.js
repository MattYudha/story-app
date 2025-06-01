import StoryModel from "../models/story-model.js";
import { subscribeUser, showStoryNotification } from "../notification.js"; // Diperbarui path
import { login } from "../utils/auth.js";
import { saveToken } from "../utils/auth.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async addStory(description, photo, lat, lon, token) {
    try {
      let response;
      if (token) {
        response = await this.model.addStory({
          description,
          photo,
          lat,
          lon,
          token,
        });
        await subscribeUser(token); // Langganan push saat login
        await showStoryNotification(
          `Cerita "${description}" telah ditambahkan!`
        );
      } else {
        response = await this.model.addGuestStory({
          description,
          photo,
          lat,
          lon,
        });
      }
      this.view.showMessage("Cerita berhasil ditambahkan!");
      this.view.stopCamera();
      this.view.navigateToHome();
    } catch (error) {
      this.view.showMessage(`Gagal menambahkan cerita: ${error.message}`);
    }
  }

  async login({ email, password }) {
    try {
      const response = await login({ email, password });
      if (response.error) throw new Error(response.message);
      saveToken(response.loginResult.token);
      await subscribeUser(response.loginResult.token); // Langganan push setelah login
      this.view.showMessage("Login berhasil!");
    } catch (error) {
      this.view.showMessage(`Login gagal: ${error.message}`);
    }
  }
}
