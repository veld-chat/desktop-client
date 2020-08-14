import { Controller, Get, Route } from "tsoa";
import { TokenResponse } from "../models";
import { generateId } from "@/utils";
import { tokenService } from "@/services";

@Route("api/v1/users")
export class TokenController extends Controller {
  @Get("token")
  public create(): TokenResponse {
    const id = generateId();

    return {
      id,
      token: tokenService.createToken(id)
    };
  }
}
