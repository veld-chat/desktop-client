export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type ServerMessage = {
  user: string;
  message: string;
  mentions: string[];
}

export type MessagePart = {
  content: string;
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
