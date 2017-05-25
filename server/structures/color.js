const cMath = require("./math");

module.exports = class Color
{
    constructor(red, green, blue)
    {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    ToHex()
    {
        return "#" + NumToHex(this.red) + NumToHex(this.green) + NumToHex(this.blue);
    }

    NumToHex(c)
    {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}