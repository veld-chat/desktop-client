import { User } from "@/models/user";
import { EmbedPayload } from "@/models/embed";

export interface CreateMessageRequest {
  content?: string;
  embed?: EmbedPayload;
}

export interface ApiChannel {
  id: string;
  name: string;
  members?: User[];
}

export interface CreateChannelRequest {
  name: string;
}

export interface TokenResponse {
  id: string;
  token: string;
}