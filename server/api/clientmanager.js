const Client = require("./client");

module.exports = class ClientManager
{ 
    constructor(io)
    {
        this.clients = {};
        this.io = io;
    }

    Start()
    {
        this.io.on("connection", (socket) => { this.OnClientConnected(socket) });
    }

    OnClientConnected(socket) 
    {
        console.log("user " + socket.id + " connected");

        this.clients[socket.id] = new Client(socket.id);
        this.io.emit("sys-msg", this.clients[socket.id].name + " has joined");

        console.log(this.clients[socket.id]);

        socket.on("disconnect", () => { this.OnClientDisconnect(socket) });
        socket.on("usr-typ", () => { this.OnClientStartTyping(socket) });
        socket.on("usr-msg", (msg) => { this.OnClientMessageReceived(socket, msg) });
    }

    OnClientDisconnect(socket)
    {
        console.log("user " + socket.id + " disconnected");

        this.io.emit("sys-msg", this.clients[socket.id].name + " has left");
        delete this.clients[socket.id];
    }

    OnClientStartTyping(socket)
    {
        var startTypingEventArgs = {};
        startTypingEventArgs.id = socket.id;
        startTypingEventArgs.name = this.clients[socket.id].name;

        this.io.emit("usr-typ", startTypingEventArgs);
    }

    OnClientMessageReceived(socket, msg)
    {
        if(msg.startsWith("/"))
		{
			if(processCommand(socket, msg))
			{
				return;
			}
		}

        var messageEventArgs = {};
        messageEventArgs.name = this.clients[socket.id].name;
        messageEventArgs.message = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        messageEventArgs.avatarurl = this.clients[socket.id].GetAvatarUrl();
        //messageEventArgs.color = this.client[socket.id].GetColorHex();

    	this.io.emit('usr-msg', messageEventArgs);
    }
}