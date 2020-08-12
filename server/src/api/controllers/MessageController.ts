import { Body, Controller, Post, Request, Route, Security } from "tsoa";
import { MessageRequest } from "@/api/models/Message";
import { injectable } from "tsyringe";
import { ClientManager } from "@/client";
import { ApiRequest } from "@/api";

@injectable()
@Security("bot")
@Route("api/v1/message")
export class MessageController extends Controller {
  constructor(
    private readonly clientManager: ClientManager
  ) {
    super();
  }

  @Post()
  public async create(
    @Request() request: ApiRequest,
    @Body() body: MessageRequest
  ): Promise<void> {
    await this.clientManager.sendMessage(request.user.id, body.content, body.embed);
  }
}
