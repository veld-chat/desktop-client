import express from 'express';
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

import {HttpServer} from './api/http-server';
const httpserverinstance = new HttpServer(express, app, http);
httpserverinstance.Listen(1234);

import {ClientManager} from './api/client-manager';
const clientmanagerinstance = new ClientManager(io);
clientmanagerinstance.Start();
