import { NotificationState, MessageState, UserState, SessionState } from "@/store/modules";

export interface RootState {
  users?: UserState,
  notifications?: NotificationState,
  session?: SessionState,
  messages?: MessageState
}
