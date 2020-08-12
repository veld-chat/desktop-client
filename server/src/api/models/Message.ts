import { EmbedPayload } from "@/models/embed";

export interface MessageRequest {
  content?: string;
  embed?: EmbedPayload;
}