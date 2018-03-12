export class Logger { 
	constructor(public logName: string) {				
	}

	public log(...args: any[]) {
		console.log('[' + this.logName + ']', args);
	}
}