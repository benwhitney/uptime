import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UptimeService {
	
	public baseUrl: string = 'http://localhost';

	constructor(protected http: HttpClient) {
		
	}

	public getStatus() {
		return this.http.get(this.baseUrl + '/status');
	}

	public getOutages() {
		return this.http.get(this.baseUrl + '/outage');
	}
}