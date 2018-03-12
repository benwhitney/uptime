import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UptimeService {
	
	public baseUrl: string = 'http://192.168.0.101';

	constructor(protected http: HttpClient) {
	}


	public getStatus() {
		return this.http.get(this.baseUrl + '/status');
	}

	public getOutages() {
		return this.http.get(this.baseUrl + '/outage');
	}

	public getSpeedtest() {
		return this.http.get(this.baseUrl + '/speedtest');
	}

	public refreshSpeedtest() {
		return this.http.post(this.baseUrl + '/runSpeedtest', null);
	}
}
