import { Client } from "@/client";
import { RateLimit } from "@/utils/rate-limit";
import { commandManager } from "@/commands/command-manager";
import { Socket } from "socket.io";
import { validateEmbed } from "@/utils/embed-validator";
import { escapeHtml, normalizeName } from "@/utils/string-validator";
import { User, Channel, ChannelDoc } from "@/db";
import { logger } from "@/logger";
import { selectMany } from "@/utils/map";
import { server } from "@/server";
import { generateId } from "@/utils";
import { channelService, tokenService, userService } from "@/services";
import { imageService } from "@/services/image-service";
import { ClientAuthRequest, EmbedPayload } from "@/models";

export const GatewayEvents = {
    ready: "ready",
    login: "login",
    createMessage: "message:create",
    deleteMessage: "message:delete",
    editMessage: "message:edit",
    userJoin: "user:join",
    userLeave: "user:leave",
    userTyping: "user:typing",
    userUpdate: "user:update",
    channelCommands: "channel:commands",
    channelCreate: "channel:create",
    memberCreate: "member:create",
    memberDelete: "member:delete",
}

export interface Message {
    id: string,
    channelId: string,
    user: string,
    content: string,
    embed: EmbedPayload,
    mentions: Array<string>,
}

export interface EditMessage {
    id: string;
    channelId: string;
    user: string;
    oldContent: string;
    newContent: string;
    embed: EmbedPayload;
    mentions: Array<string>;
}

export const clientManager = new class {
    private messageRateLimit = new RateLimit(5, 5000);
    private clients: Map<string, Client>;
    private sockets: Map<string, Client>;
    private mainChannel: string;

    constructor() {
        this.clients = new Map();
        this.sockets = new Map();
    }

    async start() {
        logger.info("starting server")

        let main = await Channel.findOne({ name: "main", system: true });

        if (main === null) {
            main = new Channel();
            main.id = generateId();
            main.name = "main";
            main.system = true;
            await main.save();
        }

        this.mainChannel = main.id;

        server.io.on("connection", (socket) => this.onClientConnected(socket));
    }

    get(id: string) {
        return this.clients.get(id);
    }

    sendMessage(userId: string, channelId: string, content: string, embed?: EmbedPayload) {
        const isMain = channelId === this.mainChannel;

        let msg: Message = {
            id: generateId(),
            channelId: channelId,
            user: userId,
            content: escapeHtml(content),
            embed: validateEmbed(embed),
            mentions: this.getMentions(content)
        };

        for (const client of this.clients.values()) {
            if (isMain || client.user.channels.includes(channelId)) {
                client.emit(GatewayEvents.createMessage, msg);
            }
        }
    }

    editMessage(userId: string, channelId: string, content: string, embed?: EmbedPayload) {
        const isMain = channelId === this.mainChannel;

        let msg: EditMessage = {
            id: generateId(),
            channelId: channelId,
            user: userId,
            oldContent: escapeHtml(content/* old message content thing here */),
            newContent: escapeHtml(content),
            embed: validateEmbed(embed),
            mentions: this.getMentions(content)
        };

        for (const client of this.clients.values()) {
            if (isMain || client.user.channels.includes(channelId)) {
                client.emit(GatewayEvents.editMessage, msg);
            }
        }
    }

    updateUser(user: Client) {
        server.io.emit(GatewayEvents.userUpdate, user.serialize());
    }

    getMentions(content: string): string[] {
        if (!content) {
            return [];
        }

        return selectMany(
            content
                .split(" ")
                .filter(word => word.startsWith("@"))
                .map(mention => mention.substr(1)),
            nick => [...this.clients.values()]
                .filter(c => c.name === nick)
                .map(c => c.id)
        );
    }

    private onClientConnected(socket: Socket) {
        logger.info("client", socket.id, " connected");

        socket.on("disconnect", () => this.onClientDisconnect(socket));
        socket.on(GatewayEvents.login, (options) => this.onClientAuthenticated(socket, options));

        socket.emit("channel:commands", commandManager.commands);
    }

    private async onClientAuthenticated(socket: Socket, request: ClientAuthRequest) {
        if (this.sockets.has(socket.id)) {
            await this.onClientDisconnect(socket);
        }

        let id: string = null;
        let token: string = null;

        if (request.token) {
            try {
                id = tokenService.decode(request.token).id;
                token = request.token;
            } catch {
                // ignore
            }
        }

        if (!id) {
            id = generateId();
        }

        let client = this.clients.get(id);
        let isNew = false;

        if (!client) {
            let user = await User.findOne({ id });

            if (!user) {
                user = new User();
                user.id = id;
                user.name = "anon-" + socket.id.substr(0, 6);
                user.avatar = await imageService.getRandomImage();
            }

            if (request.name) {
                try {
                    user.name = normalizeName(request.name);
                } catch {
                    // ignore
                }
            }

            user.lastLogin = new Date();
            user.bot = !!request.bot;

            await user.save();

            client = new Client();
            client.user = user;
            isNew = true;

            this.clients.set(id, client);
        }

        client.registerSocket(socket);
        this.sockets.set(socket.id, client);

        socket.emit(GatewayEvents.ready, {
            user: client.serialize(),
            members: Array.from(this.clients.values())
                .filter(x => x)
                .map(x => x.serialize()),
            channels: await channelService.getAll(client.user.channels, true, true),
            token: token ?? tokenService.createToken(id),
            mainChannel: this.mainChannel
        });

        socket.on(GatewayEvents.userTyping, () => this.onClientStartTyping(socket));
        socket.on(GatewayEvents.createMessage, (msg) => this.onClientMessageReceived(socket, msg));
        server.io.emit(GatewayEvents.userJoin, client.serialize());
    }

    private async onClientDisconnect(socket: Socket) {
        const client = this.sockets.get(socket.id);
        this.sockets.delete(socket.id);

        if (client && client.unregisterSocket(socket)) {
            this.clients.delete(client.id);
            server.io.emit(GatewayEvents.userLeave, await userService.get(client.id));
        }
    }

    private onClientStartTyping(socket: Socket) {
        const client = this.sockets.get(socket.id);

        server.io.emit(GatewayEvents.userTyping, {
            id: client.id,
            name: client.name,
        });
    }

    private async onClientMessageReceived(socket: Socket, msg: any) {
        const client = this.sockets.get(socket.id);

        if (commandManager.handle(client, msg.content)) {
            return;
        }

        if (!this.messageRateLimit.check(socket.id)) {
            return;
        }

        if ((msg.message || "").length > 256) {
            msg.message = msg.message.substr(0, 256);
        }

        this.sendMessage(client.id, msg.channelId, msg.content);
    }
}
