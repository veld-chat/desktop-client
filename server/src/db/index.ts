import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const UserSchema = createSchema({
  id: Type.string(),
  name: Type.string(),
  avatar: Type.string(),
  lastLogin: Type.date(),
  bot: Type.boolean()
});

export const User = typedModel('User', UserSchema);
export type UserDoc = ExtractDoc<typeof UserSchema>;