export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  bot: boolean;
  status: UserStatus;
};

export type UserStatusValue = "online" | "offline" | "dnd" | "away";
export type UserStatus = {
  statusText?: string;
  value: UserStatusValue;
};

export type ServerMessage = {
  id: string;
  channelId: string;
  user: string;
  embed?: Embed;
  content: string;
  mentions: string[];
};

type MessageBase = {
  user: User;
  mentions: string[];
};

export type Channel = {
  id: string;
  name: string;
  mentions?: number;

  members: string[];
  messages?: Message[];
};

export type Embed = {
  author?: EmbedAuthor;
  title?: string;
  description?: string;
  color?: number;
  footer?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export type EmbedAuthor = {
  value: string;
  iconUrl: string;
}

export type MessagePart = {
  id: string;
  content: string;
  embed?: Embed;
  isEmojiOnly: boolean;
  isMention: boolean;
}

export type Message = {
  id: string;
  user: User;
  parts: MessagePart[];
}

export type UserTyping = {
  id: string;
  lastTypingTime: number;
}
