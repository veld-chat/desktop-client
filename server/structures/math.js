module.exports = class cMath
{
    constructor() {}

    static Clamp(x, min, max)
    {
        return Math.min(Math.max(this, min), max); 
    }
}