import "reflect-metadata";
import express from 'express';
import bodyParser from "body-parser";
import { Server } from 'http';
import io from 'socket.io';
import fs from "fs";
import "./commands/avatar";
import "./commands/nick";
import * as path from "path";
import SocketIO from "socket.io";
import { RegisterErrorHandler, RegisterRoutes, RegisterSwagger } from "@/api";
import mongoose from "mongoose";
import { clientManager } from "@/client";

export interface Config {
  secret: string;
  connectionString: string;
}

export const server = new class {
  io: SocketIO.Server;
  options: Config;

  async start() {
    const config: Config = JSON.parse(fs.readFileSync("config/config.json").toString());

    await mongoose.connect(config.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const app = express();

    app.use('/assets', express.static(path.join(__dirname, "..", "assets")));

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    })

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    RegisterRoutes(app);
    RegisterSwagger(app);
    RegisterErrorHandler(app);

    const httpServer = new Server(app);
    httpServer.listen(1234);

    this.io = io(httpServer);
    this.options = config;

    await clientManager.start();
  }
}

// noinspection JSIgnoredPromiseFromCall
server.start();