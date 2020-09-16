import { Body, Controller, Post, Request, Route, Security, Path, Get } from "tsoa";
import { ApiRequest } from "@/api";
import { clientManager } from "@/client";
import { channelService } from "@/services";
import { ApiChannel } from "@/models";
import { CreateChannelRequest, CreateMessageRequest } from "@/api/models";

@Security("bot")
@Route("api/v1/channels")
export class ChannelController extends Controller {

  @Post()
  public async create(
    @Request() request: ApiRequest,
    @Body() body: CreateChannelRequest
  ): Promise<ApiChannel> {
    return await channelService.create(body.name, request.user.id);
  }

  @Get("{channelId}")
  public async get(
    @Path("channelId") channelId: string
  ): Promise<ApiChannel> {
    return await channelService.get(channelId, true);
  }

  @Post("{channelId}/join")
  public async joinChannel(
    @Request() request: ApiRequest,
    @Path("channelId") channelId: string
  ) {
    return await channelService.addMember(channelId, request.user.id);
  }

  @Post("{channelId}/messages")
  public async createMessage(
    @Request() request: ApiRequest,
    @Body() body: CreateMessageRequest,
    @Path("channelId") channelId: string
  ): Promise<void> {
    await clientManager.sendMessage(request.user.id, channelId, body.content, body.embed);
  }
}
