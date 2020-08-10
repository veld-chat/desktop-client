import axios from 'axios';
import { ClientManager } from "@/api/client-manager";
import SocketIO, { Socket } from "socket.io";
import { Token } from "@/models/gateway-payloads";

export class Client {
    private sockets: SocketIO.Socket[] = [];
    private _name: string;
    private _avatar: string;
    private clientManager: ClientManager;

    readonly id: string;

    constructor(id: string, socket: Socket, clientManager: ClientManager, token: Token = null) {
        this.id = id;
        this.sockets = [socket];
        this.clientManager = clientManager;
        this._name = token?.name ?? `anon-${socket.id}`;
        this._avatar = token?.avatar;
    }

    get name() {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
        this.clientManager.updateUser(this);
        this.updateToken();
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value: string) {
        this._avatar = value;
        this.clientManager.updateUser(this);
        this.updateToken();
    }

    serialize() {
        return {
            id: this.id, 
            name: this._name,
            avatarUrl: this._avatar
        };
    }

    async randomAvatar(update = true) {
        try {
            const response = await axios.get('https://api.miki.bot/images/random');
            this._avatar = response.data.url;
        } catch {
            console.warn("Tried to fetch a random avatar but Imghoard didn't reply!")
            this._avatar = "https://cdn.miki.ai/ext/imgh/1cAvfJMBuq.jpeg";
        }

        if (update) {
            this.clientManager.updateUser(this);
            this.updateToken();
        }
    }

    updateToken() {
        this.emit("token", this.clientManager.createToken(this));
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