const clientFolder = __dirname.substring(0, __dirname.length - 10) + "client";

export class HttpServer {
    http: any;
    app: any;
    express: any;

    constructor(express: any, app: any, http: any) {
        console.log(clientFolder);
        this.http = http;
        this.app = app;
        this.express = express;

        app.get('/', (req: any, res: any) => {
            res.sendFile(clientFolder + "/index.html");
        });

        app.use("/assets", express.static(clientFolder + "/assets"));
    }

    Listen(port: number) {
        this.http.listen(port, function () {
            console.log('listening on *:' + port);
        });
    }
}