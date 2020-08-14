import * as express from "express";
import { clientManager } from "@/client";
import { tokenService } from "@/services";
import { AuthError } from "@/api/errors";
import { Token } from "@/models";

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
) {
  const authValue = request.header("Authorization");

  if (!authValue || !authValue.startsWith("Bearer ")) {
    throw new AuthError("Expected Authentication header")
  }

  let token: Token;

  try {
    token = tokenService.decode(authValue.substr(7));
  } catch {
    throw new AuthError("Invalid token")
  }

  return {
    id: token.id,
    client: clientManager.get(token.id)
  };
}
