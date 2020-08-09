import axios from 'axios';
import { ClientManager } from "@/api/client-manager";
import SocketIO, { Socket } from "socket.io";

export class Client {
    private socket: SocketIO.Socket;
    private _name: string;
    private _avatar: string;
    private clientManager: ClientManager;

    constructor(socket: Socket, clientManager: ClientManager) {
        this.socket = socket;
        this._name = "anon-" + this.id;
        this.clientManager = clientManager;
    }

    get id() {
        return this.socket.id;
    }

    get name() {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
        this.clientManager.updateUser(this);
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value: string) {
        this._avatar = value;
        this.clientManager.updateUser(this);
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
        }
    }

    error(message: string) {
        this.socket.emit("sys-error", { message });
    }
}