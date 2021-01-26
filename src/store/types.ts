import {
  NotificationState,
  UserState,
  SessionState,
  ChannelState,
  MessagesState
} from "../store/modules";

export interface RootState {
  messages?: MessagesState,
  channels?: ChannelState,
  users?: UserState,
  notifications?: NotificationState,
  session?: SessionState
}
