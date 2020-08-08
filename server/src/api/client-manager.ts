import { Client } from "./client";
import axios from 'axios';
const emoji = require('node-emoji')

var nickRegex = /^[a-zA-Z0-9 ]{1,16}$/;
var ws = /\s+/;
var rateLimit: any = {}

setInterval(function() {
    rateLimit = {}
}, 5000);

const nickCommand = "nick ";
const avatarCommand = "avatar ";

function escape(input: string) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export class ClientManager
{ 
    clients: Map<string, Client>;
    io: SocketIO.EngineSocket;

    constructor(io: SocketIO.EngineSocket)
    {
        this.clients = new Map();
        this.io = io;
    }

    Start()
    {
        this.io.on("connection", (socket) => { this.OnClientConnected(socket) });
    }

    OnClientConnected(socket: SocketIO.Socket) 
    {
        console.log("user " + socket.id + " connected");
        let newClient = new Client(socket.id);
        this.clients.set(socket.id, newClient);
        this.io.emit("sys-join", newClient);

        socket.on("disconnect", () => { this.OnClientDisconnect(socket) });
        socket.on("usr-typ", () => { this.OnClientStartTyping(socket) });
        socket.on("usr-msg", (msg) => { this.OnClientMessageReceived(socket, msg) });
    }

    OnClientDisconnect(socket: SocketIO.Socket)
    {
        console.log("user " + socket.id + " disconnected");
        this.io.emit("sys-leave", this.clients.get(socket.id));
        this.clients.delete(socket.id);
    }

    OnClientStartTyping(socket: SocketIO.Socket)
    {
        this.io.emit("usr-typ", {
            id: socket.id,
            name: this.clients.get(socket.id).name,
        });
    }

    async OnClientMessageReceived(socket: SocketIO.Socket, msg: any)
    {
        console.log(msg);

        if (msg.message.length > 256) {
            msg.message = msg.message.substr(0, 256);
        }

        if(msg.message.startsWith("/"))
		{
            msg.message = msg.message.substr(1);

            if (msg.message.startsWith(nickCommand)) {
                var nick = msg.message.substr(nickCommand.length).replace(ws, ' ');
                if (nickRegex.test(nick)) {
                    let user = this.clients.get(socket.id);
                    user.name = nick;
                    this.clients.set(user.id, user);
                    this.io.emit("user-edit", user);
                }
            } else if (msg.message.startsWith(avatarCommand)) {
                let user = this.clients.get(socket.id);
                user.avatar = '//images.weserv.nl/?url=' + encodeURI(msg.message.substr(avatarCommand.length));
                this.clients.set(user.id, user);
                this.io.emit("user-edit", user);
            } else if (msg.message === "avatar") {
                let avatarRateLimit = rateLimit[`${socket.id}:avatar`];
                if (avatarRateLimit && Date.now() - avatarRateLimit < 5000) {
                    // no spam imghoard ok?
                    return;
                }

                let response = await axios.get('https://api.miki.bot/images/random')
                    .catch(err => console.log(err));
                if(response) {
                    let user = this.clients.get(socket.id);
                    user.avatar = response.data.url;
                    this.io.emit("user-edit", user);
                }
            }
            
            return;
        }
        
        var messages = rateLimit[socket.id] || 0;

        if (messages > 5) {
            return;
        }

        rateLimit[socket.id] = messages + 1;

    	this.io.emit('usr-msg', {
            message: escape(emoji.emojify(msg.message)),
            mentions: msg.mentions,
            user: this.clients.get(socket.id).toJSON()
        });
    }
}