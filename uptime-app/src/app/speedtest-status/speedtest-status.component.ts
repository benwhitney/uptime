declare var require: any;
import { Component } from '@angular/core';
import { UptimeService } from '../uptime-service/uptime.service';

@Component({
    selector: 'speedtest-status',
    templateUrl: 'speedtest-status.component.html',
    styleUrls: ['speedtest-status.component.css'],
})
export class SpeedtestStatusComponent {
	constructor(private service : UptimeService) {
		this.getData();
		setInterval(() => { this.getData() }, 60000);
	}

	public data : SpeedtestEntry[];
	public summary: SpeedtestSummary;
	public zScore: SpeedtestEntry;
	public testTimeAgo: string;
	public relativeSpeed: string;
	public btnDisabled: boolean = false;

	public getData() {
		this.service.getSpeedtest().subscribe((data:SpeedtestEntry[]) => {
			this.processResults(data);
		});
	}

	public refresh() {
		console.log('Refreshing speedtest');
		this.btnDisabled = true;
		this.service.refreshSpeedtest().subscribe((data: SpeedtestEntry) => {
			console.log('Updated speedtest from server', data);
			this.summary.latest = data;
			this.interpretSpeed();
			this.btnDisabled = false;
		});
	}

	private processResults(data: SpeedtestEntry[]) {		
		this.data = data;
		this.summary = new SpeedtestSummary();
		this.summary.processResults(data);
		this.interpretSpeed();

		console.log(this.zScore);
		console.log(this.summary);
	}

	private interpretSpeed() {
		this.zScore = this.summary.zScore(this.summary.latest);
		let relativeSpeed: string = 'Download speed is within the normal range.';
		if (this.zScore.download < 0) {
			if (this.zScore.download < -0.5) {
				relativeSpeed = 'Download speed is slightly slower than average.';
			}
			if (this.zScore.download < -1) {
				relativeSpeed = 'Download speed is much slower than average.';
			}
		} else {
			if (this.zScore.download > 0.5) {
				relativeSpeed = 'Download speed is faster than average';
			}
		}
		this.relativeSpeed = relativeSpeed;
		let moment = require("moment");
		this.testTimeAgo = moment(this.summary.latest.testTime).fromNow();
	}
}

export class SpeedtestSummary {
	public latest : SpeedtestEntry = new SpeedtestEntry();
	public min : SpeedtestEntry = new SpeedtestEntry();
	public max : SpeedtestEntry = new SpeedtestEntry();
	public avg : SpeedtestEntry = new SpeedtestEntry(); 
	public stdev: SpeedtestEntry = new SpeedtestEntry();

	constructor() {
		const MAX_VAL = 99999999;
		
		this.min.ping = MAX_VAL;
		this.max.ping = 0;
		this.min.upload = MAX_VAL;
		this.max.upload = 0;
		this.min.download = MAX_VAL;
		this.max.download = 0;
	}

	public processResults(entries: SpeedtestEntry[]) {
		let totalPing: number = 0;
		let totalUpload: number = 0;
		let totalDownload: number = 0;

		for (let test of entries) {
			this.countEntry(test);
			totalPing += test.ping;
			totalUpload += test.upload;
			totalDownload += test.download;
		}
		this.latest = entries[entries.length-1];

		this.avg.ping = Math.floor(totalPing / entries.length);
		this.avg.download = Math.floor(totalDownload / entries.length);
		this.avg.upload = Math.floor(totalUpload / entries.length);
		
		// calculate standard deviation
		let calcPing: number = 0;
		let calcUpload: number = 0;
		let calcDownload: number = 0;

		for (let test of entries) {
			calcPing += Math.pow(test.ping - this.avg.ping, 2);
			calcDownload += Math.pow(test.download - this.avg.download, 2);
			calcUpload += Math.pow(test.upload - this.avg.upload, 2);
		}

		this.stdev.ping = Math.sqrt(calcPing / entries.length);
		this.stdev.download = Math.sqrt(calcDownload / entries.length);
		this.stdev.upload = Math.sqrt(calcUpload / entries.length);
	}

	public zScore(entry: SpeedtestEntry) : SpeedtestEntry {
		let ret = new SpeedtestEntry;
		ret.ping = (entry.ping - this.avg.ping) / this.stdev.ping;
		ret.download = (entry.download - this.avg.download) / this.stdev.download;
		ret.upload = (entry.upload - this.avg.upload) / this.stdev.upload;
		return ret;
	}

	public countEntry(entry: SpeedtestEntry) : void {
		if (entry.ping > this.max.ping) {
			this.max.ping = entry.ping;
		}

		if (entry.ping < this.min.ping) {
			this.min.ping = entry.ping;
		}

		if (entry.upload > this.max.upload) {
			this.max.upload = entry.upload;			
		}

		if (entry.upload < this.min.upload) {
			this.min.upload = entry.upload;
		}

		if (entry.download > this.max.download ) {
			this.max.download = entry.download;
		}

		if (entry.download < this.min.download) {
			this.min.download = entry.download;
		}
	}
}

export class SpeedtestEntry {
	public ping : number;
	public download: number;
	public upload: number;
	public testTime: Date;
}


