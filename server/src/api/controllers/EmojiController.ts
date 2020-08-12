import { Controller, Get, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { Emoji, getEmojisForHost } from "@/utils/emoji";
import { ApiRequest } from "@/api";

@injectable()
@Route("api/v1/emoji")
export class EmojiController extends Controller {
  @Get()
  public create(
    @Request() req: ApiRequest
  ): Promise<Emoji[]> {
    const prefix = req.protocol + '://' + req.get('host');

    return Promise.resolve(getEmojisForHost(prefix));
  }
}
