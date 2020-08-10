export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type MessageBase = {
  user: User;
  mentions: string[];
};

export type MessageCreateEvent = {
  message: string;
} & MessageBase

export type MessagePart = {
  content: string;
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
