const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const httpserver = require('./api/httpserver');
const httpserverinstance = new httpserver(express, app, http).Listen(1234);
const clientmanager = require('./api/clientmanager');
const clientmanagerinstance = new clientmanager(io).Start();


function processCommand(socket, msg)
{
	if(msg.startsWith("/nick"))
	{
		var newName = msg.substring(5);
		io.emit('sys-msg', clients[socket.id].name + " is now known as " + newName);
		clients[socket.id].name = newName;
		return true;
	}
	if(msg.startsWith("/youtube"))
	{
		return true;
	}
	if(msg.startsWith(".system"))
	{
		return true;
	}
	return false;
}


