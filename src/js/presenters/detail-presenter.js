import StoryModel from "../models/story-model.js";

export default class DetailPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async getStoryDetail(id, token) {
    try {
      const story = await this.model.getStoryDetail(id, token);
      return story;
    } catch (error) {
      throw new Error(`Gagal mengambil detail cerita: ${error.message}`);
    }
  }
}
