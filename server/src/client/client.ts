import { ClientManager } from "./client-manager";
import { UserDoc } from "@/db";
import SocketIO from "socket.io";
import { injectable } from "tsyringe";
import { ImageService } from "@/image";
import { normalizeName } from "@/utils/string-validator";
import { User } from "@/models/user";

@injectable()
export class Client {
    private sockets: SocketIO.Socket[] = [];

    user: UserDoc;

    constructor(
        private readonly clientManager: ClientManager,
        private readonly imageService: ImageService
    ) { }

    get id() {
        return this.user.id;
    }

    get name() {
        return this.user.name;
    }

    get bot() {
        return this.user.bot;
    }

    get channels(): string[] {
        return this.user.channels;
    }

    async setName(value: string) {
        this.user.name = normalizeName(value);
        this.clientManager.updateUser(this);
        await this.user.save();
    }

    get avatar() {
        return this.user.avatar;
    }

    async setAvatar(value: string) {
        this.user.avatar = value;
        this.clientManager.updateUser(this);
        await this.user.save();
    }

    serialize(): User {
        return {
            id: this.id,
            name: this.user.name,
            avatarUrl: this.user.avatar,
            bot: this.user.bot,
            status: {
                value: "online"
            }
        };
    }

    async randomAvatar() {
        await this.setAvatar(await this.imageService.getRandomImage());
    }

    error(content: string) {
        this.emit("sys-error", { content });
    }

    emit(event: string, ...args: any[]) {
        for (const socket of this.sockets) {
            socket.emit(event, ...args);
        }
    }

    registerSocket(socket: SocketIO.Socket) {
        this.sockets = [...this.sockets, socket];
    }

    unregisterSocket(socket: SocketIO.Socket) {
        this.sockets = this.sockets.filter(e => e.id !== socket.id);
        return this.sockets.length === 0;
    }
}