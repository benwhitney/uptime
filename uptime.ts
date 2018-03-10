import { UptimeConfig } from "./config";
import { WebServer } from "./webserver";
import { SpeedTestService } from "./speettest";

export class UptimeService {
	
	// internet outage start time
	private outageStartTime: Date = null;
	private outageEndTime: Date = null;

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
	
	public getStatusFile(): string {
		// get the path to the status file
		return this.config.dataFolderPath + '/status.json';
	}

	public getOutageFile(): string {
		// get the path to the outage file
		return this.config.dataFolderPath + '/outage.json';
	}

	public getLogFile() {
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
			this.writeStatusEntry(online, now);
			this.checkStateChange(online);
		});
	}
		
	private checkStateChange(online: boolean) {
		if (this.lastState === null && online) {
			// initial state is online
			console.log('The internet is up!')
			this.lastState = online;
			this.outageEndTime = new Date();			
		}

		// if state changed between last check
		if (this.lastState !== online) {
			this.lastState = online;
			if (online) {
				// offline -> online
				this.outageEndTime = new Date();
				console.log('Internet Outage Ended');
				this.writeOutageEntry();
			} else {
				// online or null -> offline 
				console.log('THE INTERNET IS DOWN!');
				this.outageStartTime = new Date();
			}
		}
	}

	private writeOutageEntry() {
		// writes an entry to outage.json
		var diffMs = this.outageEndTime.getTime() - this.outageStartTime.getTime();
		var diffMins = diffMs / this.MILLISECONDS_PER_MINUTE;                
		
		var obj = {
			startTime: this.outageStartTime,
			endTime: this.outageEndTime,
			duration: diffMins
		};

		var record = JSON.stringify(obj);  
		console.log(record);

		let fs = require('fs');

		let outageFile = this.getOutageFile();
		if (fs.existsSync(outageFile)) {
			record = ',\n' + record;
		} else {
			record = '[' + record;
		}
		fs.appendFile(outageFile, record);
	}

	private writeLogEntry(online: boolean, testTime: Date) {
		let fs = require('fs');

		let logEntry = {
			time: testTime,
			online: online,
		};

		// write output to screen
		var record = testTime + ' ' + ( online ? '1' : '0');		
		console.log(record);
		
		let logFile = this.getLogFile();
		let entry = JSON.stringify(logEntry);

		if (fs.existsSync(logFile)) {
			entry = ',\n' + entry;
		}  else {
			entry = '[' + entry;
		}
		// write to log file 
		fs.appendFileSync(logFile, entry); 
	}

	private writeStatusEntry(online: boolean, testTime: Date) {
		var fs = require('fs');

		var statusEntry = {
			time: testTime,
			online: online,			
			outageEnd: (online ? this.outageEndTime : null),
			outageStart: (!online ? this.outageStartTime : null)
		};

		// write status file 
		fs.writeFileSync(this.getStatusFile(), JSON.stringify(statusEntry));
	}

} 

// run the service
let service: UptimeService = new UptimeService();
service.start();

let speedtest: SpeedTestService = new SpeedTestService();
speedtest.runSpeedtest();

let webServer: WebServer = new WebServer(service);
webServer.start();