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
import { initApi, RegisterRoutes, RegisterSwagger } from "@/api";
import { ValidateError } from "tsoa";
import { Request, Response } from "express-serve-static-core";

const app = express();

app.use('/assets', express.static(path.join(__dirname, "..", "assets")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
})

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

RegisterRoutes(app);
RegisterSwagger(app);

app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: express.NextFunction
) {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

const httpServer = new Server(app);
httpServer.listen(1234);

const config = JSON.parse(fs.readFileSync("config/config.json").toString());

container.registerSingleton(SnowyFlake);
container.register<SocketIO.Server>("io", { useValue: io(httpServer) });
container.register<any>("options", { useValue: config });

initApi();

const clientManager = container.resolve(ClientManager);
clientManager.start();
