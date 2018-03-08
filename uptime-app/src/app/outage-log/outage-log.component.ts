import { Component, Input } from '@angular/core';
import { OutageDate } from '../class/outage.class';

@Component({
    selector: 'outage-log',
    templateUrl: './outage-log.component.html',
    styleUrls: ['./outage-log.component.css'],
})
export class OutageLogComponent {
	
	@Input() public outageDays : OutageDate[];

	constructor() {			
	}
}

