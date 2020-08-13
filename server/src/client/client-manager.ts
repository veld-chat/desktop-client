import { Client, ClientChannel } from "@/client";
import { ClientAuthRequest, Token } from "@/models/gateway-payloads";
import { RateLimit } from "@/utils/rate-limit";
import { commandManager } from "@/commands/command-manager";
import SocketIO from "socket.io";
import SnowyFlake from "snowyflake";
import { validateEmbed } from "@/utils/embed-validator";
import { escapeHtml, normalizeName, validate } from "@/utils/string-validator";
import { User, Channel } from "@/db";
import { ImageService } from "@/image";
import { container, inject, singleton } from "tsyringe";
import { logger } from "@/logger";
import { TokenService } from "@/token-service";
import { EmbedPayload } from "@/models/embed";
import { selectMany } from "@/utils/map";

const GatewayEvents = {
    ready: "ready",
    login: "login",
    createMessage: "message:create",
    userTyping: "user:typing",
    userUpdate: "user:update",
    channelCommands: "channel:commands",
    channelCreate: "channel:create",
    memberCreate: "member:create",
    memberDelete: "member:delete",
}

@singleton()
export class ClientManager {
    private messageRateLimit = new RateLimit(5, 5000);
    private clients: Map<string, Client>;
    private sockets: Map<string, Client>;
    private channels: Map<string, ClientChannel>;

    constructor(
        @inject("io") private readonly io: SocketIO.Server,
        @inject("options") private readonly options: any,
        private readonly tokenService: TokenService,
        private readonly snowFlake: SnowyFlake,
        private readonly imageService: ImageService
    ) {
        this.clients = new Map();
        this.sockets = new Map();
        this.channels = new Map();
    }

    async start() {
        logger.info("starting server")

        this.channels.set("0", this.getDefaultChannel());
        this.channels.set("1", this.getTestChannel());

        this.io.on("connection", (socket) => this.onClientConnected(socket));
    }

    async createChannel(name: string, creatorId: string): Promise<Channel | null> {
        let creator = this.clients.get(creatorId);
        if (!creator) {
            return null;
        }

        let channel = new Channel();
        channel.id = this.snowFlake.nextId().toString();
        channel.name = name;
        channel.members = [creatorId];

        let clientChannel = container.resolve(ClientChannel);
        clientChannel.channel = channel;

        this.io.emit(GatewayEvents.channelCreate, clientChannel.serialize(true));
        return channel;
    }

    async joinChannel(id: string, channelId: string) {
        if (!this.getChannel(channelId)
            || !this.get(id)) {
            return;
        }

        let user = this.get(id);
        if (!user) {
            return;
        }
        user.channels.push(channelId);
        await user.user.save();

        let channel = this.getChannel(channelId);
        channel.members.push(user.id);
        await channel.channel.save();
    }

    get(id: string) {
        return this.clients.get(id);
    }

    getChannel(channelId: string): ClientChannel {
        if (channelId === "0") {
            return this.getDefaultChannel();
        }
        return this.channels.get(channelId);
    }

    sendMessage(userId: string, channelId: string, content: string, embed?: EmbedPayload) {
        if (!channelId || !this.getChannel(channelId)) {
            return;
        }

        this.io.emit(GatewayEvents.createMessage, {
            id: this.snowFlake.nextId().toString(),
            channelId: channelId,
            user: userId,
            content: escapeHtml(content),
            embed: validateEmbed(embed),
            mentions: this.getMentions(content)
        });
    }

    updateUser(user: Client) {
        this.io.emit(GatewayEvents.userUpdate, user.serialize());
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

    getDefaultChannel(): ClientChannel {
        let channel = new Channel();
        channel.id = "0";
        channel.name = "main";
        channel.members = Array.from(this.clients.values()).map(x => x.id);

        let clientChannel = container.resolve(ClientChannel);
        clientChannel.channel = channel;
        return clientChannel;
    }

    getTestChannel(): ClientChannel {
        let channel = new Channel();
        channel.id = "1";
        channel.name = "test";
        channel.members = Array.from(this.clients.values()).map(x => x.id);

        let clientChannel = container.resolve(ClientChannel);
        clientChannel.channel = channel;
        return clientChannel;
    }

    private onClientConnected(socket: SocketIO.Socket) {
        logger.info("client", socket.id, " connected");

        socket.on("disconnect", () => this.onClientDisconnect(socket));
        socket.on(GatewayEvents.login, (options) => this.onClientAuthenticated(socket, options));

        socket.emit("channel:commands", commandManager.commands);
    }

    private async onClientAuthenticated(socket: SocketIO.Socket, request: ClientAuthRequest) {
        if (this.sockets.has(socket.id)) {
            this.onClientDisconnect(socket);
        }

        let id: string = null;
        let token: string = null;

        if (request.token) {
            try {
                id = this.tokenService.decode(request.token).id;
                token = request.token;
            } catch {
                // ignore
            }
        }

        if (!id) {
            id = this.snowFlake.nextId().toString();
        }

        let client = this.clients.get(id);
        let isNew = false;

        if (!client) {
            let user = await User.findOne({ id });

            if (!user) {
                user = new User();
                user.id = id;
                user.name = "anon-" + socket.id.substr(0, 6);
                user.avatar = await this.imageService.getRandomImage();
                user.channels = ["0", "1"];
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
            user.channels = user.channels || ["0", "1"];

            await user.save();

            client = container.resolve(Client);
            client.user = user;
            isNew = true;

            this.clients.set(id, client);
        }

        client.registerSocket(socket);
        this.sockets.set(socket.id, client);

        console.log(client.channels);

        socket.emit(GatewayEvents.ready, {
            user: client.serialize(),
            members: Array.from(this.clients.values())
                .filter(x => x)
                .map(x => x.serialize()),
            channels: client.channels
                .map(x => this.getChannel(x))
                .filter(x => x)
                .map(x => x.serialize(true)),
            token: token ?? this.tokenService.createToken(id),
        });

        socket.on(GatewayEvents.userTyping, () => this.onClientStartTyping(socket));
        socket.on(GatewayEvents.createMessage, (msg) => this.onClientMessageReceived(socket, msg));

        if (isNew) {
            for (let channel of client.channels) {
                if (!channel) {
                    continue;
                }

                this.io.emit(
                    GatewayEvents.memberCreate, {
                    user: client.serialize(),
                    channel: this.getChannel(channel).serialize(),
                });
            }
        }
    }

    private onClientDisconnect(socket: SocketIO.Socket) {
        logger.info("user", socket.id, " disconnected");
        const client = this.sockets.get(socket.id);
        this.sockets.delete(socket.id);

        if (client && client.unregisterSocket(socket)) {
            this.clients.delete(client.id);

            for (let channel of client.channels) {
                if (!channel) {
                    continue;
                }

                this.io.emit(GatewayEvents.memberDelete, {
                    user: client.serialize(),
                    channel: this.getChannel(channel).serialize(),
                });
            }
        }
    }

    private onClientStartTyping(socket: SocketIO.Socket) {
        const client = this.sockets.get(socket.id);

        this.io.emit(GatewayEvents.userTyping, {
            id: client.id,
            name: client.name,
        });
    }

    private async onClientMessageReceived(socket: SocketIO.Socket, msg: any) {
        const client = this.sockets.get(socket.id);

        console.log(msg);

        if (commandManager.handle(this, client, msg.message)) {
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
