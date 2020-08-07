const Client = require("./client");
const axios = require('axios');
const emoji = require('node-emoji')

var nickRegex = /^[a-zA-Z0-9 ]{1,16}$/;
var ws = /\s+/;
var rateLimit = {}

setInterval(function() {
    rateLimit = {}
}, 5000);

const nickCommand = "nick ";
const avatarCommand = "avatar ";

function escape(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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

        this.clients[socket.id] = new Client(socket.id.substr(0, 6));
        //this.io.emit("sys-join", this.clients[socket.id].name);

        console.log(this.clients[socket.id]);

        socket.on("disconnect", () => { this.OnClientDisconnect(socket) });
        socket.on("usr-typ", () => { this.OnClientStartTyping(socket) });
        socket.on("usr-msg", (msg) => { this.OnClientMessageReceived(socket, msg) });
    }

    OnClientDisconnect(socket)
    {
        console.log("user " + socket.id + " disconnected");

        //this.io.emit("sys-leave", this.clients[socket.id].name);
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
        if (msg.length > 256) {
            msg = msg.substr(0, 100);
        }

        if(msg.startsWith("/"))
		{
            msg = msg.substr(1);

            if (msg.startsWith(nickCommand)) {
                var nick = msg.substr(nickCommand.length).replace(ws, ' ');
                if (nickRegex.test(nick)) {
                    this.clients[socket.id].name = nick;
                }
            } else if (msg.startsWith(avatarCommand)) {
                this.clients[socket.id].avatar = '//images.weserv.nl/?url=' + encodeURI(msg.substr(avatarCommand.length))
            } else if (msg === "avatar") {
                const lastChange = this.clients[socket.id].lastChange;

                if (lastChange && Date.now() - lastChange < 5000) {
                    // no spam imghoard ok?
                    return;
                }

                axios.get('https://api.miki.bot/images/random').then((response) => {
                    this.clients[socket.id].avatar = response.data.url;
                });
            }
            
            return;
        }
        
        var messages = rateLimit[socket.id] || 0;

        if (messages > 5) {
            return;
        }

        rateLimit[socket.id] = messages + 1;

        var messageEventArgs = {};
        messageEventArgs.userid = socket.id;
        messageEventArgs.name = this.clients[socket.id].name;
        messageEventArgs.message = escape(emoji.emojify(msg));
        messageEventArgs.avatarurl = this.clients[socket.id].GetAvatarUrl();
        //messageEventArgs.color = this.client[socket.id].GetColorHex();

    	this.io.emit('usr-msg', messageEventArgs);
    }
}