export class Color
{
    red: number;
    green: number;
    blue: number;

    constructor(red: number, green: number, blue: number)
    {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    ToHex()
    {
        return "#" + this.toHex(this.red) + this.toHex(this.green) + this.toHex(this.blue);
    }

    toHex(c: number)
    {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}