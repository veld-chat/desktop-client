import 'module-alias/register';
import express from 'express';

import { Server } from 'http';
import io from 'socket.io';
import fs from "fs";
import { ClientManager } from "@/api/client-manager";

import "./commands/avatar";
import "./commands/nick";

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
})

const httpServer = new Server(app);
httpServer.listen(1234);

const config = JSON.parse(fs.readFileSync("config/config.json").toString());

const clientManager = new ClientManager(io(httpServer), { secret: config.secret });
clientManager.start();
