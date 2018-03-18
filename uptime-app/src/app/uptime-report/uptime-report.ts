import { Component } from "@angular/core";

@Component( {
    selector: 'uptime-report',
    templateUrl: './uptime-report.html',
    styleUrls: ['./uptime-report.css'] 
})
export class UptimeReportComponent {
    public print() {
        window.print();
    }
} 