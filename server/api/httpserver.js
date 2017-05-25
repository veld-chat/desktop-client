const clientFolder = __dirname.substring(0, __dirname.length - 10) + "client";

module.exports = class HttpServer
{


    constructor(express, app, http)
    {
        console.log(clientFolder);
        this.http = http;
        this.app = app;
        this.express = express;

        app.get('/', function(req, res)
        {
            res.sendFile(clientFolder + "/index.html");
        });

        app.use("/assets/css", express.static(clientFolder + "/assets/css"));
        app.use("/assets/js", express.static(clientFolder + "/assets/js"));
    }

    Listen(port)
    {
        this.http.listen(port, function()
        {
            console.log('listening on *:' + port);
        });
    }
}