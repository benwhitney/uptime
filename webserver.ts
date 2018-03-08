import { UptimeService } from "./uptime";

export class WebServer {
    private express: any;
    private app: any;
    private port: number = 80;
	private fallbackPort: number = 3000;
	private uptimeService: UptimeService;
	private dirName: string = __dirname + '/../web';

    constructor(uptimeService: UptimeService) {
        this.express = require('express');
		this.app = this.express();
		this.uptimeService = uptimeService;

        var bodyParser = require('body-parser');
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use('/', this.express.static(this.dirName));
        this.app.use('/status', (req: any, res: any) => {
            this.getStatus(req, res);
		});
		this.app.use('/outage', (req: any, res: any) => {
			this.getOutage(req, res);
		})

        //this.app.use('/status/:lat/:lon',(req :any, res: any) => { this.setLocation(req, res) });

        console.log('web port' + this.port);
        console.log('Web root: ' + this.dirName);
	}
	
	private getStatus(req: any, res: any) {
		this.setJsonResponse(res);
		var fs = require('fs');
		var data = fs.readFileSync(this.uptimeService.getStatusFile());		
		res.send(data);
	}

	private getOutage(req: any, res: any) {
		this.setJsonResponse(res);
		var fs = require('fs');
		var data = fs.readFileSync(this.uptimeService.getOutageFile()) + ']';
		res.send(data);
	}

	private setJsonResponse(res : any) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'application/json');
	}
	
    public start() {
        this.app
            .listen(this.port, () => {
                console.log('Web server listening on port ' + this.port);
            })
            .on('error', (err: any) => {
                console.log(err);
                if (this.port != this.fallbackPort) {
                    this.port = this.fallbackPort;
                    this.start();
                }
            });
    }
}


