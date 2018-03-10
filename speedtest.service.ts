import { UptimeConfig } from "./config";
import { Logger } from "./logger";

export class SpeedTestService {
    private config : UptimeConfig;
    private logger: Logger;
	private MILLISECONDS_PER_SECOND: number = 1000;

    constructor() {
        this.config = new UptimeConfig();
        this.logger = new Logger('Speedtest');
    }

    start() {
        // initial update
		this.update();
        
        // create timer
        setInterval(
            () => this.update(), 
            this.config.speedtestIntervalSeconds * this.MILLISECONDS_PER_SECOND);
    }
    
    update() {
        this.logger.log('Running SpeedTest');
        var exec = require('child_process').exec;
        exec('speed-test -j', (error: any, stdout: string, stderr: any) => {
            var data = JSON.parse(stdout.trim());
            data.testTime = new Date();
            this.logger.log('Result from speedtest',  data);
            this.writeSpeedtestLog(data);
        });
    }

    writeSpeedtestLog(data: any) {
        if (data) {
            const fs = require('fs');
            const filename = this.getSpeedtestLogFile();
            var raw = JSON.stringify(data);
            let entry = raw;
            if (!fs.existsSync(filename)) {
                entry = '[' + entry;
            } else {
                entry = ',' + entry;
            }
            this.logger.log(entry);
            fs.appendFileSync(filename, entry);

            const statusFile = this.getSpeedtestStatusFile();
            this.logger.log('Writing status to ' + statusFile);
            this.logger.log(raw);
            fs.writeFileSync(statusFile, raw);
        }
    }

    public getSpeedtestLogFile() {
        return this.config.dataFolderPath + 'speedtest.json';
    }

    public getSpeedtestStatusFile() {
        return this.config.dataFolderPath + 'speedtest-status.json';
    }
}