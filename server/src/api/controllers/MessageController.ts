import { Body, Controller, Post, Request, Route, Security, Path } from "tsoa";
import { CreateMessageRequest } from "@/api/models/message";
import { injectable } from "tsyringe";
import { ClientManager } from "@/client";
import { ApiRequest } from "@/api";

@injectable()
@Security("bot")
@Route("api/v1/channels/{channelId}")
export class MessageController extends Controller {
  constructor(
    private readonly clientManager: ClientManager
  ) {
    super();
  }

  @Post()
  public async create(
    @Request() request: ApiRequest,
    @Body() body: CreateMessageRequest,
    @Path("channelId") channelId: string
  ): Promise<void> {
    await this.clientManager.sendMessage(request.user.id, channelId, body.content, body.embed);
  }
}
