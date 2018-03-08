declare var require: any;
import { Component, Input } from '@angular/core';
import { UptimeStatus } from '../class/outage.class';

@Component({
    selector: 'uptime-status',
    templateUrl: './uptime-status.component.html',
    styleUrls: ['./uptime-status.component.css'],
})
export class UptimeStatusComponent {
	
	@Input() public status: UptimeStatus;
	protected minutes: number;
	protected fromNow: string;
	protected changeDate: Date;

	constructor() {		
	
	}
}
