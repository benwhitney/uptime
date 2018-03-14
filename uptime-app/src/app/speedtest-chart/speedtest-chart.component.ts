declare var require: any;

import { Component, Input, ElementRef, ViewChild } from "@angular/core";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { SpeedtestEntry } from "../speedtest-status/speedtest-status.component";
import * as ChartJS from 'chart.js'

@Component({
    selector: 'speedtest-chart',
    templateUrl: './speedtest-chart.component.html',
    styleUrls: ['./speedtest-chart.component.css']
})
export class SpeedtestChartComponent implements OnInit {
    @Input() public data : SpeedtestEntry[];

    public filteredData : SpeedtestEntry[];

    @Input() public lastHours : number;
    @ViewChild("chart", {read: ElementRef}) protected chart: ElementRef;
    
    constructor() {

    }

    public ngOnInit() {
        this.filterLastHours();
        this.buildChart();
    }

    public buildChart() { 
        const ctx = this.chart.nativeElement.getContext('2d');

        var downloadSpeeds: number[] = [];
        var uploadSpeeds: number[] = [];
        var ping: number[] = [];
        var times: string[] = [];
        let moment = require('moment');
        let colors: string [] = [];

        for (var entry of this.filteredData) {
            downloadSpeeds.push(entry.download);
            uploadSpeeds.push(entry.upload);
            ping.push(entry.ping);
            colors.push['#440000'];
            times.push(entry.testTime.toDateString()); // moment(entry.testTime).format('hh:mm'));
        }

        console.log (downloadSpeeds.length);
        let myChart = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: [times],
                datasets: [{
                    label: 'Download Speed',
                    data: downloadSpeeds,
                    backgroundColor: [colors
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    
        
    }
    public filterLastHours() {
        let moment = require('moment');
        this.filteredData = this.data.filter((entry) => {
            return entry.testTime && moment(entry.testTime).isAfter(moment().subtract(this.lastHours, 'hours'));
        });
        console.log('filtered data', this.filteredData);
    }
}