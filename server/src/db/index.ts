import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const UserSchema = createSchema({
  id: Type.string(),
  name: Type.string(),
  avatar: Type.string(),
  lastLogin: Type.date(),
  bot: Type.boolean(),
  channels: Type.array().of(Type.string({ default: [] })),
  statusText: Type.string()
});

const ChannelSchema = createSchema({
  id: Type.string(),
  system: Type.boolean(),
  name: Type.string(),
  members: Type.array().of(Type.string({ default: [] })),
})

export const User = typedModel('User', UserSchema);
export type UserDoc = ExtractDoc<typeof UserSchema>;

export const Channel = typedModel('Channel', ChannelSchema);
export type ChannelDoc = ExtractDoc<typeof ChannelSchema>;