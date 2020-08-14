import { Body, Controller, Post, Request, Route, Security, Path } from "tsoa";
import { injectable } from "tsyringe";
import { ClientManager } from "@/client";
import { ApiRequest } from "@/api";
import { CreateChannelRequest, ApiChannel } from "../models";
import { CreateMessageRequest } from "../models";

@injectable()
@Security("bot")
@Route("api/v1/channels")
export class ChannelController extends Controller {
  constructor(
    private readonly clientManager: ClientManager
  ) {
    super();
  }

  @Post()
  public async create(
    @Request() request: ApiRequest,
    @Body() body: CreateChannelRequest
  ): Promise<ApiChannel> {
    let channel = this.clientManager.createChannel(request.user.id, body.name);
    if (!channel) {
      throw new Error("internal server error");
    }
    return channel;
  }

  @Post("{channelId}/messages")
  public async createMessage(
    @Request() request: ApiRequest,
    @Body() body: CreateMessageRequest,
    @Path("channelId") channelId: string
  ): Promise<void> {
    await this.clientManager.sendMessage(request.user.id, channelId, body.content, body.embed);
  }
}
