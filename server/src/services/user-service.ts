import { ChannelDoc, User, UserDoc } from "@/db";
import { clientManager } from "@/client";
import { ApiUser } from "@/models";

export const userService = new class {
  async get(id: string): Promise<ApiUser> {
    return this.serialize(await User.findOne({ id }));
  }

  async getAll(ids: string[]): Promise<ApiUser[]> {
    return (await User.find({ id: ids })).map(u => this.serialize(u));
  }

  async getAsObject(userIds: string[]) {
    const users = await userService.getAll(userIds);
    const usersById: { [id: string]: ApiUser } = {}

    for (const user of users) {
      usersById[user.id] = user;
    }

    return usersById;
  }

  serialize(user: UserDoc, client = clientManager.get(user.id)): ApiUser {
    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatar,
      bot: user.bot,
      status: {
        statusText: user.statusText,
        value: client?.status ?? "offline"
      }
    };
  }
}
