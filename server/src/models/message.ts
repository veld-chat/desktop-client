import { EmbedPayload } from "./embed";

export type Message = {
  content?: string;
  embed?: EmbedPayload;
};