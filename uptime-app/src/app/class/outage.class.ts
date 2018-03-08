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


export class UptimeStatus {
	online: boolean;
	time: Date;
	outageStart: Date;
	outageEnd: Date;
}