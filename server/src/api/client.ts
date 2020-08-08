import { Color } from "../structures/color";
import axios from 'axios';

export class Client
{
    id: string;
    color: Color;
    name: string;
    avatar: string;

    constructor(id: string)
    {
        this.color = new Color(0,0,0);
        this.id = id;
        this.name = "anon-" + this.id;

        axios.get('https://api.miki.bot/images/random').then((response) => {
            this.avatar = response.data.url;
        });
    }

    GetColorHex()
    {
        return "#" + this.color.toHex(this.color.red) + this.color.toHex(this.color.green) + this.color.toHex(this.color.blue);
    }

    toJSON() {
        return {
            id: this.id, 
            name: this.name, 
            avatarUrl: this.avatar
        };
    }
}