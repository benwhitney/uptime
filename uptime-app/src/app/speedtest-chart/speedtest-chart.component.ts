declare var require: any;

import { Component, Input, ElementRef, ViewChild } from "@angular/core";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { SpeedtestEntry, SpeedtestSummary } from "../speedtest-status/speedtest-status.component";
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

        var summary = new SpeedtestSummary();
        summary.processResults(this.filteredData);
        console.log('Summary of filtered', summary );

        var downloadSpeeds: number[] = [];
        var uploadSpeeds: number[] = [];
        var ping: number[] = [];
        var times: string[] = [];
        let moment = require('moment');
        let downloadColors: string [] = [];
        let uploadColors: string [] = [];
        
        for (var entry of this.filteredData) {
            downloadSpeeds.push(entry.download);
            uploadSpeeds.push(entry.upload);
            ping.push(entry.ping);
            let zScore = (summary.zScore(entry));
            downloadColors.push('rgba(0, 255, 0, .5)');
            uploadColors.push('rgba(255, 0, 0, .5)');
            // if (zScore.download > 0) {
            //     colors.push('rgba(0, 255, 0, 1)');                 
            // } else {
            //     colors.push('rgba(255, 0, 0, 1)');                                 
            // }
            times.push(moment(entry.testTime).format('HH:mm'));
        }

        console.log (downloadSpeeds.length);
        let myChart = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: times,
                datasets: [{
                    label: 'Upload Speed',
                    data: uploadSpeeds,
                    backgroundColor: uploadColors,
                    borderWidth: 1,
                },{
                    label: 'Download Speed',
                    data: downloadSpeeds,
                    backgroundColor: downloadColors,
                    borderWidth: 1,
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