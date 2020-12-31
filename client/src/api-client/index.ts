import axios, { AxiosError } from "axios";
import { session } from "../store";

export function client() {
  const host = localStorage.getItem("gateway") || "api.veld.chat";
  const token = (session.state as any).token;

  console.log(`creating new api client with host '${host}' on token '${token}'.`)
  return new ApiClient(
    host,
    token,
  )
}

export class ApiClient {
  baseUrl: string;
  token: string;

  constructor(baseUrl, token) {
    this.baseUrl = `https://${baseUrl}/`;
    this.token = token;
  }

  async joinChannel(channelName) {
    const response = await axios.post(
      `${this.baseUrl}channels/join`, {
      channel: channelName,
    }, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
    return response.data;
  }

  async sendMessage(channelId: string, content: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}channels/${channelId}/messages`, {
        content,
      }, {
        headers: {
          "Authorization": `Bearer ${this.token}`
        }
      })
      return response.data;
    } catch (err) {
      console.log((err as AxiosError).response);
    }
  }
}