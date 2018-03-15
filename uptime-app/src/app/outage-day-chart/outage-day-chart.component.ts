declare var require: any;
import { Component, Input } from '@angular/core';
import { OutageDate, OutageEntry } from '../class/outage.class';

@Component({
    selector: 'outage-day-chart',
    templateUrl: './outage-day-chart.component.html',
    styleUrls: ['./outage-day-chart.component.css'],
})
export class OutageDayChartComponent {
    @Input() public set outageDay (value: OutageDate) {
        this._outageDay = value;
        // this._outageDay = this.getMockData();
        this.calculateEvents();
        this.calculateOffset();
    };
    public get outageDay() : OutageDate {
        return this._outageDay;
    }

    private getMockData() :OutageDate {
        let outageDate = new OutageDate();
        outageDate.key = 'asdf'
        outageDate.entries = [];

        let moment = require('moment');
        for (let i = 0; i < 24; i ++ ) {
            var entry = new OutageEntry();
            entry.startTime = moment().hours(i).minutes(0).toDate();
            entry.endTime = moment().hours(i).minutes(10).toDate();
            outageDate.entries.push(entry);
        }
        return outageDate;
    }

    private _outageDay: OutageDate;

    protected hours : number [];
    
    protected entries: OutageSummary[];

    // TODO use element width
    private gridWidth: number = 696;
    
    private minWidth: number = 4;

    public constructor() {
        this.hours = [];
        for (let i = 0; i < this.HRS_PER_DAY; i+=3) {
            this.hours.push(i);
        }
    }

    public calculateEvents() {
        this.entries = [];
        for (let entry of this.outageDay.entries) {
            const newItem = new OutageSummary();
            newItem.date = entry.startTime;
            newItem.dayStartPercent = this.getPercentOfDay(entry.startTime);
            newItem.dayEndPercent = this.getPercentOfDay(entry.endTime);
            if (newItem.dayEndPercent < newItem.dayStartPercent) {
                // overnight 
                newItem.dayEndPercent = 1;
            }
            newItem.entry = entry;
            this.entries.push(newItem);
        }
    }

    public calculateOffset() {
        for (let entry of this.entries) {
            entry.xOffset = entry.dayStartPercent * this.gridWidth;
            let xOffset2 = entry.dayEndPercent * this.gridWidth;
            entry.width = Math.max(this.minWidth, xOffset2 - entry.xOffset);

        }
    }

    private HRS_PER_DAY : number = 24;
    private MINS_PER_HOUR : number = 60;
    private MINS_PER_DAY : number = this.MINS_PER_HOUR * this.HRS_PER_DAY;

    private getPercentOfDay(date : Date) {
        let hrs: number = date.getHours();
        let mins: number = date.getMinutes();
        let pctOfDay : number = ((hrs * this.MINS_PER_HOUR) + mins) / this.MINS_PER_DAY;
        return pctOfDay;
    }
}

export class OutageSummary {
    public date : Date;
    public dayStartPercent : number;
    public dayEndPercent: number;
    
    public xOffset : number;
    public width : number; 
    public entry : OutageEntry;
}
