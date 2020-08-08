import express from 'express';

import { Server } from 'http';
import io from 'socket.io';
import fs from "fs";

import { HttpServer } from './api/http-server';
import { ClientManager } from './api/client-manager';

const app = express();
const httpServer = new Server(app);

const config = JSON.parse(fs.readFileSync("config/config.json").toString());

const httpserverinstance = new HttpServer(express, app, httpServer);
httpserverinstance.Listen(1234);

const clientmanagerinstance = new ClientManager(new io(httpServer), { secret: config.secret });
clientmanagerinstance.Start();
