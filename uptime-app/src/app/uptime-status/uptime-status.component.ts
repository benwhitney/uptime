import { Component } from '@angular/core';
import { UptimeService } from '../uptime-service/uptime.service';

@Component({
    selector: 'uptime-status',
    templateUrl: './uptime-status.component.html',
    styleUrls: ['./uptime-status.component.css'],
})
export class UptimeStatusComponent {
	
	protected status: any;

	constructor(protected service: UptimeService) {		
		this.getData();
	}

	protected getData() {
		this.service.getStatus().subscribe((data) => {
			this.status = data;
		});
	}
}
