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

	constructor(protected service: UptimeService) {		
		this.getData();
		this.moment = require('moment');
		setInterval(() => { this.getData() }, 60000);
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
