import { ChannelsState } from "./reducers/channels";
import { EmojiState } from "./reducers/emojis";
import { MessagesState } from "./reducers/messages";
import { SessionState } from "./reducers/session";
import { UserState } from "./reducers/users";

export interface RootState {
  messages: MessagesState;
  channels: ChannelsState;
  users: UserState;
  emojis: EmojiState;
  sessions: SessionState;
}
