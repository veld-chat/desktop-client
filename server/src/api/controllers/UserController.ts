import { Controller, Get, Route } from "tsoa";
import { injectable } from "tsyringe";
import { TokenService } from "@/token-service";
import { TokenResponse } from "../models/token-response";
import { Snowyflake } from "snowyflake";

@injectable()
@Route("api/v1/users")
export class TokenController extends Controller {
  constructor(
    private readonly snowyflake: Snowyflake,
    private readonly tokenService: TokenService
  ) {
    super();
  }

  @Get("token")
  public create(): TokenResponse {
    const id = this.snowyflake.nextId().toString();

    return {
      id,
      token: this.tokenService.createToken(id)
    };
  }
}
