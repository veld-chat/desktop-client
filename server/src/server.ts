import "reflect-metadata";
import "./commands/avatar";
import "./commands/nick";
import express from "express";
import bodyParser from "body-parser";
import io, { Server as IOServer } from 'socket.io';
import fs from "fs";
import { RegisterErrorHandler, RegisterRoutes, RegisterSwagger } from "@/api";
import { connect } from "mongoose";
import { clientManager } from "@/client";
import { Server } from "http";
import * as path from "path";

export interface Config {
  secret: string;
  connectionString: string;
}

export const server = new class {
  io: IOServer;
  options: Config;

  async start() {
    const config: Config = JSON.parse(fs.readFileSync("config/config.json").toString());

    await connect(config.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const app = express();

    app.use('/assets', express.static(path.join(__dirname, "..", "assets")));

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      next();
    });

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
  };
};

// noinspection JSIgnoredPromiseFromCall
server.start();