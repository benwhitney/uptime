"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebServer {
    constructor(uptimeService) {
        this.port = 80;
        this.fallbackPort = 3000;
        this.dirName = __dirname + '/../web';
        this.express = require('express');
        this.app = this.express();
        this.uptimeService = uptimeService;
        var bodyParser = require('body-parser');
        this.app.use(bodyParser.json());
        this.app.use('/', this.express.static(this.dirName));
        this.app.use('/status', (req, res) => {
            this.getStatus(req, res);
        });
        this.app.use('/outage', (req, res) => {
            this.getOutage(req, res);
        });
        console.log('web port' + this.port);
        console.log('Web root: ' + this.dirName);
    }
    getStatus(req, res) {
        this.setJsonResponse(res);
        var fs = require('fs');
        var data = fs.readFileSync(this.uptimeService.getStatusFile());
        res.send(data);
    }
    getOutage(req, res) {
        this.setJsonResponse(res);
        var fs = require('fs');
        var data = fs.readFileSync(this.uptimeService.getOutageFile()) + ']';
        res.send(data);
    }
    setJsonResponse(res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'application/json');
    }
    start() {
        this.app
            .listen(this.port, () => {
            console.log('Web server listening on port ' + this.port);
        })
            .on('error', (err) => {
            console.log(err);
            if (this.port != this.fallbackPort) {
                this.port = this.fallbackPort;
                this.start();
            }
        });
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=webserver.js.map