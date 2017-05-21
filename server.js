var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res)
{
	res.sendFile(__dirname + "/index.html");
});

app.use("/assets/css", express.static(__dirname + '/assets/css'));
app.use("/assets/js", express.static(__dirname + '/assets/js'));

io.on('connection', function(socket)
{
	console.log('a user connected');
   	io.emit('sys-msg', "A new user has connected");
	
	socket.on('usr-msg', function(msg)
	{
    	io.emit('usr-msg', msg);
	});
});

http.listen(3000, function()
{
  console.log('listening on *:3000');
});
