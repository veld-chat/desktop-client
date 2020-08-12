export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  status: UserStatus;
};

export type UserStatusValue = "online" | "offline" | "dnd" | "away";
export type UserStatus = {
  statusText?: string;
  value: UserStatusValue;
}

type MessageBase = {
  user: User;
  mentions: string[];
};

export type Channel = {
  id: string;
  name: string;
  mentions?: number;
  members: User[];
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

export type MessageCreateEvent = {
  content: string;
  embed?: Embed;
} & MessageBase

export type MessagePart = {
  content: string;
  embed: Embed;
  isEmojiOnly: boolean;
  isMention: boolean;
}

export type Message = {
  parts: MessagePart[];
} & MessageBase;

export type UserTyping = {
  id: string;
  lastTypingTime: number;
}
