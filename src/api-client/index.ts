import { User } from "../models";
import axios, { Method } from "axios";
import store from "../store/store";
import { createLogger, LoggerInstance } from "../services/logger";

export function client() {
  const host = localStorage.getItem("gateway") || "api.veld.chat";
  const token = store.getState().sessions.token || "";

  return new ApiClient(host, token);
}

export class ApiClient {
  baseUrl: string;
  token: string;
  logger: LoggerInstance;

  constructor(baseUrl, token) {
    this.baseUrl = `https://${baseUrl}/`;
    this.token = token;
    this.logger = createLogger("ApiClient");
  }

  async getChannelMembers(channelId): Promise<Array<User>> {
    return await this.request(`channels/${channelId}/members`, "GET");
  }

  async editUser(name) {
    return await this.request("users/me", "PATCH", { name });
  }

  async joinChannel(channelName) {
    return await this.request(`channels/join`, "POST", {
      channel: channelName
    });
  }

  async sendMessage(channelId: string, content: string) {
    return await this.request(`channels/${channelId}/messages`, "POST", {
      content
    });
  }

  private async request<TRes, TReq>(
    url: string,
    method: Method,
    body?: TReq
  ): Promise<TRes> {
    this.logger.log(method, url, body);
    this.logger.log(this.token);
    try {
      const response = await axios({
        url: `${this.baseUrl}${url}`,
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        data: body
      });
      this.logger.log(method, url, response.data);
      return response.data as TRes;
    } catch (err) {
      this.logger.log(method, url, err);
    }
    return null;
  }
}
