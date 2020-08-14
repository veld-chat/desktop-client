import { UserDoc } from "@/db";
import SocketIO from "socket.io";
import { normalizeName } from "@/utils/string-validator";
import { clientManager } from "@/client/client-manager";
import { userService } from "@/services";
import { imageService } from "@/services/image-service";
import { ApiUser, UserStatusValue } from "@/models";

export class Client {
    private sockets: SocketIO.Socket[] = [];

    user: UserDoc;
    status: UserStatusValue = "online";

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
        clientManager.updateUser(this);
        await this.user.save();
    }

    get avatar() {
        return this.user.avatar;
    }

    async setAvatar(value: string) {
        this.user.avatar = value;
        clientManager.updateUser(this);
        await this.user.save();
    }

    serialize(): ApiUser {
        return userService.serialize(this.user, this);
    }

    async randomAvatar() {
        await this.setAvatar(await imageService.getRandomImage());
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