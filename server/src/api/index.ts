import { container } from "tsyringe";
import swaggerUi from "swagger-ui-express";
import * as express from 'express';
import { TokenService } from "@/token-service";
import { Client, ClientManager } from "@/client";

export * from "./routes";
export interface ApiRequest extends express.Request {
  user: {
    id: string;
    client: Client;
  }
}

const swaggerDocument = require('./swagger.json');

export function RegisterSwagger(app: express.Application) {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export const iocContainer = {
  get: container.resolve.bind(container)
};

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