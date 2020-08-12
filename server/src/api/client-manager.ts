import { Client } from "./client";
import { ClientAuthRequest, Token } from "@/models/gateway-payloads";
import * as jwt from "jsonwebtoken";
import { RateLimit } from "@/utils/rate-limit";
import { commandManager } from "@/command-manager";
import SocketIO from "socket.io";
import SnowyFlake from "snowyflake";
import { validateEmbed } from "@/utils/embed-validator";
import { validate } from "@/utils/string-validator";

const snowFlake = new SnowyFlake();

export class ClientManager {
    private messageRateLimit = new RateLimit(5, 5000);
    private clients: Map<string, Client>;
    private sockets: Map<string, Client>;
    private options: any;
    private io: SocketIO.Server;

    constructor(io: SocketIO.Server, serverOptions: any) {
        this.clients = new Map();
        this.sockets = new Map();
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
        console.log("client " + socket.id + " connected");

        socket.on("disconnect", () => this.onClientDisconnect(socket));
        socket.on("login", (options) => this.onClientAuthenticated(socket, options));

        socket.emit("sys-commands", commandManager.commands);
    }

    private async onClientAuthenticated(socket: SocketIO.Socket, request: ClientAuthRequest) {
        console.log(request);
        let token: Token = null;
        let sendToken = false;
        let isBot = false;

        if (request.token) {
            try {
                token = jwt.decode(request.token) as Token;
            } catch {
                sendToken = true;
            }
        }

        if (request.bot) {
            isBot = request.bot;
        }

        const id = token?.id ?? snowFlake.nextId().toString();
        let currentUser = this.clients.get(id);
        let isNew;

        if (currentUser) {
            currentUser.registerSocket(socket);
            isNew = false;
        } else {
            currentUser = new Client(id, socket, this, token, isBot);
            this.clients.set(id, currentUser);
            isNew = true;
        }

        if (!currentUser.avatar) {
            await currentUser.randomAvatar(false);
            sendToken = true;
        }

        this.sockets.set(socket.id, currentUser);

        socket.emit("ready", {
            user: currentUser.serialize(),
            members: Array.from(this.clients.values()).map(x => x.serialize()),
            token: this.createToken(currentUser),
        });

        socket.on("usr-typ", () => this.onClientStartTyping(socket));
        socket.on("usr-msg", (msg) => this.onClientMessageReceived(socket, msg));

        if (isNew) {
            this.io.emit("sys-join", currentUser.serialize());
        }

        if (sendToken) {
            currentUser.updateToken();
        }
    }

    createToken(user: Client): string {
        return jwt.sign({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            bot: user.bot
        } as Token, this.options.secret);
    }

    private onClientDisconnect(socket: SocketIO.Socket) {
        console.log("user " + socket.id + " disconnected");
        const client = this.sockets.get(socket.id);
        this.sockets.delete(socket.id);

        if (!client) {
            return;
        }

        if (client.unregisterSocket(socket)) {
            this.clients.delete(client.id);
            this.io.emit("sys-leave", client.serialize());
        }
    }

    private onClientStartTyping(socket: SocketIO.Socket) {
        const client = this.sockets.get(socket.id);

        this.io.emit("usr-typ", client.serialize());
    }

    private async onClientMessageReceived(socket: SocketIO.Socket, msg: any) {
        const client = this.sockets.get(socket.id);

        if (commandManager.handle(this, client, msg.message)) {
            return;
        }

        if (!this.messageRateLimit.check(socket.id)) {
            return;
        }

        if ((msg.message || "").length > 256) {
            msg.message = msg.message.substr(0, 256);
        }

        this.io.emit('usr-msg', {
            message: validate(msg.message),
            embed: validateEmbed(msg.embed),
            mentions: msg.mentions,
            user: client.serialize()
        });
    }
}
