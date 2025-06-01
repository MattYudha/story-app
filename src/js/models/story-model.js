export default class StoryModel {
  async getStories() {
    const authData = JSON.parse(localStorage.getItem("auth")) || {};
    const { token } = authData; // Baris 5: Destruktur dengan fallback

    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stories");
    }

    return response.json();
  }

  async addStory({ name, description, photo, lat, lon }) {
    const authData = JSON.parse(localStorage.getItem("auth")) || {};
    const { token } = authData;

    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to add story");
    }

    return response.json();
  }
}
