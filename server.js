const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

let clients = {};

app.get('/', function(req, res)
{
	res.sendFile(__dirname + "/index.html");
});

app.use("/assets/css", express.static(__dirname + '/assets/css'));
app.use("/assets/js", express.static(__dirname + '/assets/js'));

io.on('connection', function(socket)
{
	clients[socket.id] = {};
	clients[socket.id].name = "anon-" + socket.id;
	clients[socket.id].socket = socket;
	clients[socket.id].avatarid = Math.floor(Math.random() * 70) + 1;
	clients[socket.id].avatarurl = "https://randomuser.me/api/portraits/men/" + clients[socket.id].avatarid + ".jpg";
	clients[socket.id].namecolor = "black";

	console.log('user- connected');
   	io.emit('sys-msg', clients[socket.id].name + " has joined.");

   	socket.on("disconnect", function()
   	{
   		console.log('user- disconnected');
   		io.emit("sys-msg", clients[socket.id].name + " left.");
   	});

	socket.on('usr-msg', function(msg)
	{
		if(msg.startsWith("/"))
		{
			if(processCommand(socket, msg))
			{
				return;
			}
		}

    	io.emit('usr-msg', {name:clients[socket.id].name, message:msg.replace(/</g, "&lt;").replace(/>/g, "&gt;"), avatarurl:clients[socket.id].avatarurl});
	});
});

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

http.listen(1234, function()
{
  console.log('listening on *:1234');
});
