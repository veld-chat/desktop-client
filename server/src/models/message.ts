import { EmbedPayload } from "./embed";
import { User } from "./user";

export type Message = {
  content?: string;
  embed?: EmbedPayload;
  mentions?: string[];
  user: User;
};