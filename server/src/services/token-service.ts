import * as jwt from "jsonwebtoken";
import { server } from "@/server";
import { Token } from "@/models";

export const tokenService = new class {
  createToken(id: string): string {
    return jwt.sign(
      { id } as Token,
      server.options.secret,
      { noTimestamp: true });
  }

  decode(token: string) {
    return jwt.verify(token, server.options.secret) as Token;
  }
}
