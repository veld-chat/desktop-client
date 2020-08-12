import * as express from "express";
import { Client } from "@/client";

export interface ApiRequest extends express.Request {
  user: {
    id: string;
    client: Client;
  }
}