import { Component } from '@angular/core';
import { UptimeService } from '../uptime-service/uptime.service';

@Component({
    selector: 'outage-log',
    templateUrl: './outage-log.component.html',
    styleUrls: ['./outage-log.component.css'],
})
export class OutageLogComponent {
	
	protected status: any;

	constructor(protected service: UptimeService) {		
		this.getData();
	}

	protected getData() {
		this.service.getOutages().subscribe((data) => {
			this.status = data;
		});
	}
}
