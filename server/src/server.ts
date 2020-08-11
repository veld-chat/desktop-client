import "reflect-metadata";
import express from 'express';

import { Server } from 'http';
import io from 'socket.io';
import fs from "fs";
import { ClientManager } from "@/client";

import "./commands/avatar";
import "./commands/nick";
import { getEmojisForHost } from "@/utils/emoji";
import * as path from "path";
import { container } from "tsyringe";
import SocketIO from "socket.io";
import SnowyFlake from "snowyflake";

const app = express();

app.use('/assets', express.static(path.join(__dirname, "..", "assets")))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
})

app.get("/emojis", (req, res) => {
  const prefix = req.protocol + '://' + req.get('host');

  return res.json(getEmojisForHost(prefix)).status(200);
})

const httpServer = new Server(app);
httpServer.listen(1234);

const config = JSON.parse(fs.readFileSync("config/config.json").toString());

container.registerSingleton(SnowyFlake);
container.register<SocketIO.Server>("io", { useValue: io(httpServer) });
container.register<any>("options", { useValue: config });

const clientManager = container.resolve(ClientManager);
clientManager.start();
