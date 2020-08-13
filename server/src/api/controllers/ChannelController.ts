import { Body, Controller, Post, Request, Route, Security, Path } from "tsoa";
import { injectable } from "tsyringe";
import { ClientManager } from "@/client";
import { ApiRequest } from "@/api";
import { CreateChannelRequest, APIChannel } from "@/api/models/channel";

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
  ): Promise<APIChannel> {
    let channel = this.clientManager.createChannel(request.user.id, body.name);
    if (!channel) {
      throw new Error("internal server error");
    }
    return channel;
  }
}
