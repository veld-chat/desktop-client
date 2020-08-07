const Color = require("../structures/color");
const axios = require('axios');

module.exports = class Client
{
    constructor(id)
    {
        this.avatarid = Math.floor(Math.random() * 70) + 1;
        this.color = new Color(0,0,0);
        this.id = id;
        this.name = "anon-" + this.id;   

        axios.get('https://api.miki.bot/images/random').then((response) => {
            this.avatar = response.data.url;
        });
    }

    GetColorHex()
    {
        console.log(this.color);
        return "#" + this.color.NumToHex(this.color.red) + this.color.NumToHex(this.color.green) + this.color.NumToHex(this.color.blue);
    }

    GetAvatarUrl()
    {
        if (this.avatar) {
            return this.avatar;
        }

        return "https://images.emojiterra.com/twitter/v13.0/512px/1f914.png";
    }
}