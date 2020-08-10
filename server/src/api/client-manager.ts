import { Client } from "./client";
import { ClientAuthOptions } from "@/models/gateway-payloads";
const emoji = require('node-emoji')
import * as jwt from "jsonwebtoken";
import { RateLimit } from "@/utils/rate-limit";
import { commandManager } from "@/command-manager";
import SocketIO from "socket.io";

function escape(input: string) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export class ClientManager {
    private messageRateLimit = new RateLimit(5, 5000);
    private clients: Map<string, Client>;
    private options: any;
    private io: SocketIO.Server;

    constructor(io: SocketIO.Server, serverOptions: any) {
        this.clients = new Map();
        this.options = serverOptions;
        this.io = io;
    }

    start() {
        this.io.on("connection", (socket) => this.onClientConnected(socket));
    }

    updateUser(user: Client) {
        this.io.emit("user-edit", user.serialize());
    }

    get(id: string) {
        return this.clients.get(id);
    }

    private onClientConnected(socket: SocketIO.Socket) {
        console.log("user " + socket.id + " connected");

        const client = new Client(socket, this);
        this.clients.set(socket.id, client);

        socket.on("disconnect", () => this.onClientDisconnect(socket));
        socket.on("login", (options) => this.onClientAuthenticated(socket, options));

        socket.emit("sys-commands", commandManager.commands);
    }

    private async onClientAuthenticated(socket: SocketIO.Socket, options: ClientAuthOptions) {
        let currentUser = this.clients.get(socket.id);
        if (!currentUser) {
            console.log("error: user tried to authenticate with invalid socket.");
            socket.error("invalid session");
            socket.disconnect(true);
            return;
        }

        if (options.avatarUrl) {
            currentUser.avatar = options.avatarUrl;
        } else {
            await currentUser.randomAvatar(false);
        }

        currentUser.name = options.name || currentUser.name;
        this.clients.set(socket.id, currentUser);

        socket.emit("ready", {
            user: currentUser.serialize(),
            members: Array.from(this.clients.values()).map(x => x.serialize()),
            token: jwt.sign(currentUser.id, this.options.secret),
        });

        socket.on("usr-typ", () => this.onClientStartTyping(socket));
        socket.on("usr-msg", (msg) => this.onClientMessageReceived(socket, msg));
        this.io.emit("sys-join", currentUser.serialize());
    }

    private onClientDisconnect(socket: SocketIO.Socket) {
        console.log("user " + socket.id + " disconnected");
        this.io.emit("sys-leave", this.clients.get(socket.id).serialize());
        this.clients.delete(socket.id);
    }

    private onClientStartTyping(socket: SocketIO.Socket) {
        this.io.emit("usr-typ", {
            id: socket.id,
            name: this.clients.get(socket.id).name,
        });
    }

    private async onClientMessageReceived(socket: SocketIO.Socket, msg: any) {
        if (commandManager.handle(this, socket.id, msg.message)) {
            return;
        }

        if (!this.messageRateLimit.check(socket.id)) {
            return;
        }

        if (msg.message.length > 256) {
            msg.message = msg.message.substr(0, 256);
        }

        this.io.emit('usr-msg', {
            message: escape(emoji.emojify(msg.message)),
            mentions: msg.mentions,
            user: this.clients.get(socket.id).serialize()
        });
    }
}
