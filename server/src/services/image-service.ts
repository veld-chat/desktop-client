import axios from "axios";
import { logger } from "@/logger";

export const imageService = new class {
  /**
   * Get a random image from Imghoard.
   */
  async getRandomImage() {
    try {
      const response = await axios.get('https://api.miki.bot/images/random');
      return response.data.url;
    } catch(e) {
      logger.warn("Tried to fetch a random avatar but Imghoard didn't reply!", e);
      return "https://cdn.miki.ai/ext/imgh/1cAvfJMBuq.jpeg";
    }
  }
}