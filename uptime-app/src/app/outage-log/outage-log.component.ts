declare var require: any;
import { Component } from '@angular/core';
import { UptimeService } from '../uptime-service/uptime.service';

@Component({
    selector: 'outage-log',
    templateUrl: './outage-log.component.html',
    styleUrls: ['./outage-log.component.css'],
})
export class OutageLogComponent {
	
	protected status: any;
	public outageDays : OutageDate[];
	public allOutages: OutageEntry[];


	constructor(protected service: UptimeService) {		
		this.getData();
	}

	protected getData() {
		this.service.getOutages().subscribe((data) => {
			this.status = data;
			this.parseOutages(data);
			this.getTimeOfDayCount(this.allOutages);
		});
	}

	protected getTimeOfDayCount(outages: OutageEntry[]): TimeOfDayCount[] {
		// initialize times
		let ret: TimeOfDayCount [] = [];		
		for (let i:number = 0; i <= 23; i++) {
			let entry = new TimeOfDayCount();
			entry.label = i.toString() + ':00'
			entry.interval = i;
			entry.count = 0;
			ret.push(entry);
		}

		let moment = require('moment');

		for (var outage of outages) {
			var bucket = Number(moment(outage.startTime).format('H'));
			ret[bucket].count++;
			ret[bucket].minutes += outage.duration;
		}
		console.log(ret);
		// check times
		return ret;
	}
	
	protected parseOutages(data: any) {
		this.outageDays = [];
		this.allOutages = [];
		let moment = require('moment');
		for (let outage of data) {
			// create the outage entry
			var entry = new OutageEntry();
				
			let startTime = moment(outage.startTime);
			let endTime = moment(outage.endTime);
			let duration = Math.round(moment.duration(endTime.diff(startTime)).asMinutes());

			entry = { 
				startTime: startTime.toDate(), 
				endTime : endTime.toDate(), 
				duration : duration };
			
			let key = startTime.format("dddd, MMMM Do, YYYY");
			this.getOutageDateKey(key).entries.push(entry);
			this.allOutages.push(entry);
		}
	}

	private getOutageDateKey(key: string) : OutageDate {
		for (var day of this.outageDays) {
			if (day.key === key) {
				return day;
			}
		}
		let ret = new OutageDate();
		ret.key = key;
		ret.entries = [];
		this.outageDays.push(ret);
		return ret;
	}
}

export class OutageDate {
	public key : string;
	public entries: OutageEntry[];	
}

export class OutageEntry {	
	public startTime: Date;
	public endTime: Date;
	public duration: number;
}

export class TimeOfDayCount {
	public label: string;
	public interval: number;
	public count: number;
	public minutes: number;
}