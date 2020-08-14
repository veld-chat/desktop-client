export type ApiUser = {
  id: string;
  name: string;
  avatarUrl: string;
  bot: boolean;
  status: UserStatus;
}

export type UserStatusValue = "online" | "offline" | "dnd" | "away";
export type UserStatus = {
  statusText?: string;
  value: UserStatusValue;
}
