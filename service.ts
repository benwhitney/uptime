import { UptimeConfig } from "./config";

export class UptimeService {
	
	// internet outage start time
	private outageStartTime: Date = null;

	// last state (online = true)
	private lastState?: boolean = null;

	private MILLISECONDS_PER_SECOND: number = 1000;
	private MILLISECONDS_PER_MINUTE: number = 60000;

	// start the online monitor
	public start() {
		this.config = new UptimeConfig();
		console.log('Uptime starting up.');
		console.log('Checking internet status every: ' + this.config.updateIntervalSeconds + ' seconds.');

		this.initDirectory();

		// initial update
		this.update();

		// create timer
		setInterval(
			() => this.update(), 
			this.config.updateIntervalSeconds * this.MILLISECONDS_PER_SECOND);
	}

	public config: UptimeConfig;
	
	private getStatusFile(): string {
		// get the path to the status file
		return this.config.dataFolderPath + '/status.json';

	}
	private getOutageFile(): string {
		// get the path to the outage file
		return this.config.dataFolderPath + '/outage.json';
	}

	private getLogFile() {
		// get the path to the log file
		var dateFormat = require('dateformat');
		var now = new Date();
		var current = dateFormat(now, 'yyyy-mm-dd');
		return this.config.dataFolderPath + '/' + current + '.log';
	}
	
	private isOnline(callback: (online: boolean) => any) {
		// check if online
		var isOnline = require("is-online");
		isOnline().then((online:boolean) => {
			callback(online);
		});
	}
	
	private initDirectory() {
		// create directory if it doesn't exist
		var fs = require('fs');
		if (!fs.existsSync(this.config.dataFolderPath)) {
			fs.mkdirSync(this.config.dataFolderPath)
		}
	}
	
	private update() {
		var now = new Date();
		var timeNow = now.toJSON();
		this.isOnline((online) => {
			this.writeLogEntry(online, now);
			this.checkStateChange(online);
		});
	}
		
	private checkStateChange(online: boolean) {
		if (this.lastState === null && online) {
			// initial state is online
			console.log('The internet is up!')
			this.lastState = online;
		}

		// if state changed between last check
		if (this.lastState !== online) {
			this.lastState = online;
			if (online) {
				// offline -> online
				console.log('Internet Outage Ended');
				this.writeOutageEntry(this.outageStartTime);
			} else {
				// online or null -> offline 
				console.log('THE INTERNET IS DOWN!');
				this.outageStartTime = new Date();
			}
		}
	}

	private writeOutageEntry(outageStartTime: Date) {
		// writes an entry to outage.json
		let outageEndTime = new Date();
		var diffMs = outageEndTime.getTime() - outageStartTime.getTime();
		var diffMins = diffMs / this.MILLISECONDS_PER_MINUTE;                
		
		var obj = {
			startTime: outageStartTime,
			endTime: outageEndTime,
			duration: diffMins
		};

		var record = JSON.stringify(obj);  
		console.log(record);

		var fs = require('fs');
		fs.appendFile(this.getOutageFile(), record + ',\n');
	}

	private writeLogEntry(online: boolean, testTime: Date) {
		var fs = require('fs');

		var obj = {
			time: testTime,
			online: online
		};

		// write output to screen
		var record = testTime + ' ' + ( online ? '1' : '0');		
		console.log(record);
		
		// write to log file 
		fs.appendFileSync(this.getLogFile(), JSON.stringify(obj)  + ',\n'); 

		// write status file 
		fs.writeFileSync(this.getStatusFile(), JSON.stringify(obj));
	}

} 

// run the service
let service: UptimeService = new UptimeService();
service.start();