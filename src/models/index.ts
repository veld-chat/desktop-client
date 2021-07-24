export enum StatusType {
  Online = 0,
  Offline = 1
}

export enum UserBadges {
  None = 0,
  Supporter = 1,
  Admin = 2,
  Bot = 4
}

export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  badges: UserBadges;
  isBot: boolean;
  status?: UserStatus;
};

export type UserStatus = {
  statusText?: string;
  statusType: StatusType;
};

export type ServerMessage = {
  id: string;
  channelId: string;
  author: User;
  embed?: Embed;
  content: string;
  reactions: ReactionAggregate[];
  timestamp: Date;
  //  mentions: string[];
};

export type CreateMessagePayload = {
  message: Message;
  channelId: string;
};

export interface ServerEditMessage extends ServerMessage {
  newContent: string;
  newEmbed?: Embed;
  updatedTimestamp: number;
}

export type PresenceUpdateArgs = {
  userId: string;
  statusType: StatusType;
  statusText?: string;
};

export type ScrollPosition = number | "end";

export type ServerChannel = {
  id: string;
  system: boolean;
  name: string;
  members: User[];
};

export type Channel = {
  id: string;
  system: boolean;
  name: string;
  members: string[];
  scroll: ScrollPosition;
  lastMessageId?: string;
  unreadAmount: number;
  mentionAmount: number;
};

export type Embed = {
  author?: EmbedAuthor;
  title?: string;
  description?: string;
  color?: number;
  footer?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
};

export type EmbedAuthor = {
  value: string;
  iconUrl: string;
};

export type MessagePart = {
  id: string;
  content: string;
  embed?: Embed;
  reactions: ReactionAggregate[];
  isEmojiOnly: boolean;
  isMention: boolean;
};

export type ReactionAggregate = {
  emoji: string;
  count: number;
  me: boolean;
};

export type Message = {
  id: string;
  author: User;
  timestamp: Date;
  parts: MessagePart[];
};

export type UserTyping = {
  id: string;
  lastTypingTime: number;
};

export type MessagePartContent = {
  content: string;
  mentionType?: "user" | "channel";
  mentionId?: string;
};
