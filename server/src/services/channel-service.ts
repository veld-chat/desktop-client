import { Channel, ChannelDoc, User, UserDoc } from "@/db";
import { ApiChannel, ApiUser } from "@/models";
import { generateId, selectMany } from "@/utils";
import { userService } from "@/services/user-service";
import { server } from "@/server";
import { clientManager, GatewayEvents } from "@/client";
import { FilterQuery } from "mongoose";

export const channelService = new class {
  async create(name: string, creatorId: string): Promise<ApiChannel> {
    let channel = new Channel();
    channel.id = generateId();
    channel.name = name;
    channel.members = [];
    await channel.save();

    const apiChannel = this.serialize(channel, await userService.getAsObject(channel.members));

    server.io.emit(GatewayEvents.channelCreate, apiChannel);

    await this.addMember(channel.id, creatorId);

    return apiChannel;
  }

  async addMember(id: string, userId: string) {
    const channel = await Channel.findOne({ id });

    if (channel === null) {
      return false;
    }

    const client = clientManager.get(userId);
    let user: UserDoc;

    if (client) {
      user = client.user;
    } else {
      user = await User.findOne({ id: userId });

      if (!user) {
        throw new Error("User not found");
      }
    }

    if (user.channels.includes(id)) {
      return true;
    }

    user.channels.push(id);
    await client.user.save();

    channel.members.push(client.id);
    await channel.save();

    server.io.emit(GatewayEvents.memberCreate, {
      user: client.serialize(),
      channel: channel,
    });

    return true;
  }

  async get(id: string, withUsers = false): Promise<ApiChannel> {
    return (await this.getAll([id], withUsers))[0];
  }

  async getAll(ids: string[], withUsers = false, withSystem = false): Promise<ApiChannel[]> {
    let filter: FilterQuery<ChannelDoc> = { id: ids };
    if (withSystem) {
      filter = { ["$or"]: [filter, { system: true }] };
    }
    const channels = await Channel.find(filter);
    const usersById = withUsers
      ? await userService.getAsObject(selectMany(channels.map(c => c.members), i => i))
      : undefined;

    return channels.map(users => this.serialize(users, usersById));
  }

  serialize(channel: ChannelDoc, users?: {[id: string]: ApiUser} ): ApiChannel {
    return {
      id: channel.id,
      system: channel.system,
      name: channel.name,
      members: users ? channel.members.map(i => users[i]) : undefined
    };
  }
}