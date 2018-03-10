import { UptimeService } from "./uptime.service";
import { Logger } from "./logger";
import { SpeedTestService } from "./speedtest.service";

export class WebServer {
    private express: any;
    private app: any;
    private port: number = 80;
	private fallbackPort: number = 3000;
	private dirName: string = __dirname + '/../web';
    private logger: Logger;

    constructor(private uptimeService: UptimeService, private speedtest: SpeedTestService) {
        this.express = require('express');
        this.logger = new Logger('Web');
		this.app = this.express();

        var bodyParser = require('body-parser');
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use('/', this.express.static(this.dirName));
        this.app.use('/status', (req: any, res: any) => {
            this.getStatus(req, res);
		});
		this.app.use('/outage', (req: any, res: any) => {
			this.getOutage(req, res);
        })
        this.app.use('/speedtest', (req: any, res: any) => {
            this.getSpeedtest(req, res);
        });

        //this.app.use('/status/:lat/:lon',(req :any, res: any) => { this.setLocation(req, res) });

        this.logger.log('web port' + this.port);
        this.logger.log('Web root: ' + this.dirName);
	}
	
	private getStatus(req: any, res: any) {
		this.setJsonResponse(res);
		var fs = require('fs');
        var data = fs.readFileSync(this.uptimeService.getStatusFile());		
        this.logger.log('Sending status file');
		res.send(data);
	}

	private getOutage(req: any, res: any) {
		this.setJsonResponse(res);
		var fs = require('fs');
        var data = fs.readFileSync(this.uptimeService.getOutageFile()) + ']';
        this.logger.log('Sending outage file');
		res.send(data);
    }
    
    private getSpeedtest(req: any, res: any) {
        this.setJsonResponse(res);
        var fs = require('fs');
        var data = fs.readFileSync(this.speedtest.getSpeedtestLogFile()) + ']';
        this.logger.log('Sending speedtest file');
        res.send(data);
    }

	private setJsonResponse(res : any) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'application/json');
	}
	
    public start() {
        this.app
            .listen(this.port, () => {
                this.logger.log('Web server listening on port ' + this.port);
            })
            .on('error', (err: any) => {
                this.logger.log(err);
                if (this.port != this.fallbackPort) {
                    this.port = this.fallbackPort;
                    this.start();
                }
            });
    }
}


