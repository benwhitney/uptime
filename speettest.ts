import { UptimeConfig } from "./config";

export class SpeedTestService {
    private config : UptimeConfig;

	private MILLISECONDS_PER_SECOND: number = 1000;

    constructor() {
        this.config = new UptimeConfig();
        	// initial update
		this.update();
        
        // create timer
        setInterval(
            () => this.update(), 
            this.config.speedtestIntervalSeconds * this.MILLISECONDS_PER_SECOND);
    }

    update() {
        console.log('Running SpeedTest');
        var exec = require('child_process').exec;
        exec('speed-test -v -j', (error: any, stdout: string, stderr: any) => {
            console.log('result from speedtest',  stdout);
            this.writeSpeedtestLog(stdout);
        });
    }

    writeSpeedtestLog(data: any) {
        if (data) {
            const fs = require('fs');
            const filename = this.getSpeedtestLogFile();
            let entry = data;
            if (fs.existsSync(filename)) {
                entry = '[' + data;
            }
            fs.appendFileSync(filename, entry + '\n');
        }
    }

    getSpeedtestLogFile() {
        return this.config.dataFolderPath + 'speedtest.log';
    }
}