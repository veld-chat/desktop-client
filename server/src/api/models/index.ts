import { EmbedPayload } from "@/models";

export interface CreateMessageRequest {
  content?: string;
  embed?: EmbedPayload;
}

export interface CreateChannelRequest {
  name: string;
}

export interface TokenResponse {
  id: string;
  token: string;
}