const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const httpserver = require('./api/httpserver');
const httpserverinstance = new httpserver(express, app, http).Listen(1234);
const clientmanager = require('./api/clientmanager');
const clientmanagerinstance = new clientmanager(io).Start();