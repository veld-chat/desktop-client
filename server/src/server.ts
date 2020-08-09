import express from 'express';

import { Server } from 'http';
import io from 'socket.io';
import fs from "fs";

import { ClientManager } from './api/client-manager';

const app = express();
const httpServer = new Server(app);

const config = JSON.parse(fs.readFileSync("config/config.json").toString());

const clientmanagerinstance = new ClientManager(new io(httpServer), { secret: config.secret });
clientmanagerinstance.Start();
