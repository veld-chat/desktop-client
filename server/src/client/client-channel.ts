import { injectable } from "tsyringe";
import { ChannelDoc } from "@/db";
import { ApiChannel } from "@/api/models/channel";
import { ClientManager } from "./client-manager";

@injectable()
export class ClientChannel {
  channel: ChannelDoc;

  constructor(
    private readonly clientManager: ClientManager
  ) { }

  serialize(withMembers: boolean = false): ApiChannel {
    return {
      id: this.channel.id,
      name: this.channel.name,
      members: withMembers
        ? this.channel.members
          .map(x => this.clientManager.get(x))
          .filter(x => x)
          .map(x => x.serialize())
        : null
    };
  }

  get members(): string[] {
    return this.channel.members;
  }
}