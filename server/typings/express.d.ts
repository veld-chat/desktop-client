import { Client } from "@/client";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      client: Client;
    }
  }
}