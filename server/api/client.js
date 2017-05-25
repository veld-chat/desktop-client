const Color = require("../structures/color");

module.exports = class Client
{
    constructor(id)
    {
        this.avatarid = Math.floor(Math.random() * 70) + 1;
        this.color = new Color(0,0,0);
        this.id = id;
        this.name = "anon-" + this.id;   
    }

    GetColorHex()
    {
        console.log(this.color);
        return "#" + this.color.NumToHex(this.color.red) + this.color.NumToHex(this.color.green) + this.color.NumToHex(this.color.blue);
    }

    GetAvatarUrl()
    {
        return "https://randomuser.me/api/portraits/men/" + this.avatarid + ".jpg";
    }
}