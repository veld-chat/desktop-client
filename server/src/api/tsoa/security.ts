import { TokenService } from "@/token-service";
import { ClientManager } from "@/client";
import { container } from "tsyringe";
import * as express from "express";

let tokenService: TokenService;
let clientManager: ClientManager;

export function initApi() {
  tokenService = container.resolve(TokenService);
  clientManager = container.resolve(ClientManager);
}

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
) {
  const authValue = request.header("Authorization");

  if (!authValue || !authValue.startsWith("Bearer ")) {
    throw new Error("Expected Authentication header.")
  }

  const token = tokenService.decode(authValue.substr(7));

  return {
    id: token.id,
    client: clientManager.get(token.id)
  };
}
