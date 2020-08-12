import "reflect-metadata";
import express from 'express';
import bodyParser from "body-parser";
import { Server } from 'http';
import io from 'socket.io';
import fs from "fs";
import { ClientManager } from "@/client";
import "./commands/avatar";
import "./commands/nick";
import * as path from "path";
import { container } from "tsyringe";
import SocketIO from "socket.io";
import SnowyFlake from "snowyflake";
import { initApi, RegisterErrorHandler, RegisterRoutes, RegisterSwagger } from "@/api";
import mongoose from "mongoose";

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

async function start() {
  const config = JSON.parse(fs.readFileSync("config/config.json").toString());

  await mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const httpServer = new Server(app);
  httpServer.listen(1234);

  container.registerSingleton(SnowyFlake);
  container.register<SocketIO.Server>("io", { useValue: io(httpServer) });
  container.register<any>("options", { useValue: config });

  initApi();

  const clientManager = container.resolve(ClientManager);
  await clientManager.start();
}

// noinspection JSIgnoredPromiseFromCall
start();