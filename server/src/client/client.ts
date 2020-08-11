import { ClientManager } from "./client-manager";
import { UserDoc } from "@/db";
import SocketIO from "socket.io";
import { injectable } from "tsyringe";
import { ImageService } from "@/image";

@injectable()
export class Client {
    private sockets: SocketIO.Socket[] = [];

    user: UserDoc;

    constructor(
      private readonly clientManager: ClientManager,
      private readonly imageService: ImageService
    ) {}

    get socketCount() {
        return this.sockets.length;
    }

    get id() {
        return this.user.id;
    }

    get name() {
        return this.user.name;
    }

    async setName(value: string) {
        this.user.name = value;
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

    serialize() {
        return {
            id: this.id, 
            name: this.user.name,
            avatarUrl: this.user.avatar
        };
    }

    async randomAvatar() {
        await this.setAvatar(await this.imageService.getRandomImage());
    }

    error(message: string) {
        this.emit("sys-error", { message });
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