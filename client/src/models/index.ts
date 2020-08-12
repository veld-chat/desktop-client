export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type ServerMessage = {
  user: string;
  embed?: Embed;
  message: string;
  mentions: string[];
}

type MessageBase = {
  user: User;
  mentions: string[];
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
  content: string;
  embed: Embed;
  isEmojiOnly: boolean;
  isMention: boolean;
}

export type Message = {
  user: string;
  parts: MessagePart[];
}

export type UserTyping = {
  id: string;
  lastTypingTime: number;
}
