import { inject, singleton } from "tsyringe";
import * as jwt from "jsonwebtoken";
import { Token } from "@/models/gateway-payloads";
import { Snowyflake } from "snowyflake";

@singleton()
export class TokenService {
  constructor(
    @inject("options") private readonly options: any
  ) {}

  createToken(id: string): string {
    return jwt.sign(
      { id } as Token,
      this.options.secret,
      { noTimestamp: true });
  }

  decode(token: string) {
    return jwt.verify(token, this.options.secret) as Token;
  }
}