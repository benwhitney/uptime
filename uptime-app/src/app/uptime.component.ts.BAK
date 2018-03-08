import { Component } from '@angular/core';
import { UptimeStatus, OutageEntry, OutageDate } from './class/outage.class';
import { UptimeService } from './uptime-service/uptime.service';

@Component({
    selector: 'uptime',
    templateUrl: './uptime.component.html',
    styleUrls: ['./uptime.component.css'],
})
export class UptimeComponent {

	// raw data
	public status: UptimeStatus;
	public allOutages: OutageEntry[];
	
	// processed data
	public outageDays : OutageDate[];

	constructor (public service: UptimeService) {
		this.getOutages();
		this.getStatus();
	}
	 
	protected getOutages() {		
		// get outages
		this.service.getOutages().subscribe((data) => {
			this.parseOutages(data);
			this.getTimeOfDayCount(this.allOutages);
		});
	}

	protected getStatus() {
		// get status
		this.service.getStatus().subscribe((data) => {
			this.updateStatus(data as UptimeStatus);
		});
	}
	
	protected updateStatus(status: UptimeStatus) {
		let moment = require('moment');
		this.status = status;
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
	}}
