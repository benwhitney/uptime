declare var require: any;
import { Component } from '@angular/core';
import { UptimeService } from '../uptime-service/uptime.service';
import { UptimeStatus } from '../class/outage.class';

@Component({
    selector: 'uptime-status',
    templateUrl: './uptime-status.component.html',
    styleUrls: ['./uptime-status.component.css'],
})
export class UptimeStatusComponent {
	
	public status: UptimeStatus;
	protected minutes: number;
	protected moment: any; 
	protected fromNow: string;
	protected changeDate: Date;
	protected uptime: string;
	protected updateInterval: number = 60;
	protected MS_PER_SECOND: number = 1000;

	constructor(protected service: UptimeService) {		
		this.getData();
		this.moment = require('moment');
		setInterval(() => { this.getData() }, this.updateInterval * this.MS_PER_SECOND);
		setInterval(() => { this.tick()}, this.MS_PER_SECOND);
	}

	protected tick() {
		let target;
		if (this.status.online) {
			target = new Date(this.status.outageEnd);
		} else {
			target = new Date(this.status.outageStart);
		}
		let now = new Date();
		let secondsDiff = Math.floor((now.getTime() - target.getTime()) / 1000);

		let minutesDiff = Math.floor(secondsDiff / 60);
		secondsDiff -= minutesDiff * 60;

		let hoursDiff = Math.floor(minutesDiff / 60);
		minutesDiff -= hoursDiff * 60;

		this.uptime = this.pad(hoursDiff) + ':' + this.pad(minutesDiff) + ':' + this.pad(secondsDiff);
		this.updateStatus(this.status);
	}

	private pad (val: number, size? : number) {
		var s = String(val);
		while (s.length < (size || 2)) {s = "0" + s;}
		return s;
	}
	

	protected getData() {
		this.service.getStatus().subscribe((data) => {
			this.updateStatus(data as UptimeStatus);
		});
	}

	protected updateStatus(status: UptimeStatus) {
		this.status = status;
		if (status.online) {
			this.fromNow = this.moment(status.outageEnd).fromNow();
		} else {
			this.fromNow = this.moment(status.outageStart).fromNow();			
		}
	}
}
