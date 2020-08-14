import { Controller, Get, Request, Route } from "tsoa";
import { Emoji, getEmojisForHost } from "@/utils/emoji";
import { ApiRequest } from "@/api";

@Route("api/v1/emojis")
export class EmojiController extends Controller {
  @Get()
  public create(
    @Request() req: ApiRequest
  ): Promise<Emoji[]> {
    const prefix = req.protocol + '://' + req.get('host');

    return Promise.resolve(getEmojisForHost(prefix));
  }
}
