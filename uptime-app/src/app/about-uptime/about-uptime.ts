import { Component } from "@angular/core";

@Component({
    selector: 'about-uptime',
    templateUrl :'./about-uptime.html',
    styleUrls: ['./about-uptime.css' ]
})
export class AboutUptimeComponent {

    // todo: get the update interval seconds from the config
    public updateIntervalSeconds: number = 30;
}