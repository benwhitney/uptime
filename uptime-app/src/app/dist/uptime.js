"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const webserver_1 = require("./webserver");
class UptimeService {
    constructor() {
        this.outageStartTime = null;
        this.outageEndTime = null;
        this.lastState = null;
        this.MILLISECONDS_PER_SECOND = 1000;
        this.MILLISECONDS_PER_MINUTE = 60000;
    }
    start() {
        this.config = new config_1.UptimeConfig();
        console.log('Uptime starting up.');
        console.log('Checking internet status every: ' + this.config.updateIntervalSeconds + ' seconds.');
        this.initDirectory();
        this.update();
        setInterval(() => this.update(), this.config.updateIntervalSeconds * this.MILLISECONDS_PER_SECOND);
    }
    getStatusFile() {
        return this.config.dataFolderPath + '/status.json';
    }
    getOutageFile() {
        return this.config.dataFolderPath + '/outage.json';
    }
    getLogFile() {
        var dateFormat = require('dateformat');
        var now = new Date();
        var current = dateFormat(now, 'yyyy-mm-dd');
        return this.config.dataFolderPath + '/' + current + '.log';
    }
    isOnline(callback) {
        var isOnline = require("is-online");
        isOnline().then((online) => {
            callback(online);
        });
    }
    initDirectory() {
        var fs = require('fs');
        if (!fs.existsSync(this.config.dataFolderPath)) {
            fs.mkdirSync(this.config.dataFolderPath);
        }
    }
    update() {
        var now = new Date();
        var timeNow = now.toJSON();
        this.isOnline((online) => {
            this.writeLogEntry(online, now);
            this.writeStatusEntry(online, now);
            this.checkStateChange(online);
        });
    }
    checkStateChange(online) {
        if (this.lastState === null && online) {
            console.log('The internet is up!');
            this.lastState = online;
            this.outageEndTime = new Date();
        }
        if (this.lastState !== online) {
            this.lastState = online;
            if (online) {
                this.outageEndTime = new Date();
                console.log('Internet Outage Ended');
                this.writeOutageEntry();
            }
            else {
                console.log('THE INTERNET IS DOWN!');
                this.outageStartTime = new Date();
            }
        }
    }
    writeOutageEntry() {
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
        }
        else {
            record = '[' + record;
        }
        fs.appendFile(outageFile, record);
    }
    writeLogEntry(online, testTime) {
        let fs = require('fs');
        let logEntry = {
            time: testTime,
            online: online,
        };
        var record = testTime + ' ' + (online ? '1' : '0');
        console.log(record);
        let logFile = this.getLogFile();
        let entry = JSON.stringify(logEntry);
        if (fs.existsSync(logFile)) {
            entry = ',\n' + entry;
        }
        else {
            entry = '[' + entry;
        }
        fs.appendFileSync(logFile, entry);
    }
    writeStatusEntry(online, testTime) {
        var fs = require('fs');
        var statusEntry = {
            time: testTime,
            online: online,
            outageEnd: (online ? this.outageEndTime : null),
            outageStart: (!online ? this.outageStartTime : null)
        };
        fs.writeFileSync(this.getStatusFile(), JSON.stringify(statusEntry));
    }
}
exports.UptimeService = UptimeService;
let service = new UptimeService();
service.start();
let webServer = new webserver_1.WebServer(service);
webServer.start();
//# sourceMappingURL=uptime.js.map