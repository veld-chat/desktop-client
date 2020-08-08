export type User = {
  id: string;
  name: string;
  avatar?: string;
};

export type MessageCreateEvent = {
  user: User;
  message: string;
  mentions: string[];
};

export type Message = {
  mentionsSelf: boolean;
} & MessageCreateEvent;
