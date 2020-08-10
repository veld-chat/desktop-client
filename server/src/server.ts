import express from 'express';

import { Server } from 'http';
import io from 'socket.io';
import fs from "fs";
import { ClientManager } from "@/api/client-manager";

import "./commands/avatar";
import "./commands/nick";
import { getEmojisForHost } from "@/utils/emoji";
import * as path from "path";

const app = express();

app.use('/emoji', express.static(path.join(__dirname, "emoji")))

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

const clientManager = new ClientManager(io(httpServer), { secret: config.secret });
clientManager.start();
