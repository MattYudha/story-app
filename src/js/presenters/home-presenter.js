import StoryModel from "../models/story-model.js";
import { db } from "../db.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async loadStories() {
    try {
      const response = await this.model.getStories();
      const stories = response.listStory; // Sesuai struktur API Dicoding

      // Simpan ke IndexedDB
      await db.init();
      for (const story of stories) {
        await db.saveStory(story);
      }

      await this.view.displayStories(stories);
    } catch (error) {
      console.error("Error loading stories:", error.message);
      if (error.message.includes("No authentication token found")) {
        this.view.showMessage(
          "Anda belum login. Silakan login untuk melihat cerita.",
          () => (window.location.hash = "#/login")
        );
      } else {
        // Coba ambil dari IndexedDB jika offline
        await db.init();
        const cachedStories = await db.getAllStories();
        if (cachedStories.length > 0) {
          this.view.displayStories(cachedStories);
          this.view.showMessage(
            "Anda offline. Menampilkan data dari cache.",
            null
          );
        } else {
          this.view.showMessage(
            "Gagal memuat cerita: Tidak ada koneksi dan cache kosong. Silakan periksa koneksi Anda dan muat ulang halaman setelah tersambung.",
            () => window.location.reload()
          );
        }
      }
    }
  }
}
