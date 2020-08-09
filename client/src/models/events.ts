export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type MessageCreateEvent = {
  user: User;
  message: string;
  mentions: string[];
};

export type Message = {
  mentionsSelf: boolean;
} & MessageCreateEvent;

export type UserTyping = {
  id: string;
  lastTypingTime: number;
}
