import {
  NotificationState,
  UserState,
  SessionState,
  ChannelState,
  MessagesState,
  EmojiState
} from "../store/modules";

export interface RootState {
  messages?: MessagesState,
  channels?: ChannelState,
  users?: UserState,
  emoji?: EmojiState,
  notifications?: NotificationState,
  session?: SessionState
}
