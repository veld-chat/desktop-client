import { EmbedPayload } from "@/models/embed";

export interface CreateMessageRequest {
  channelId: string;
  content?: string;
  embed?: EmbedPayload;
}