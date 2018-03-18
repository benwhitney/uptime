import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { UptimeStatusComponent } from './uptime-status/uptime-status.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { UptimeService } from './uptime-service/uptime.service';
import { OutageLogComponent } from './outage-log/outage-log.component';
import { SpeedtestStatusComponent } from './speedtest-status/speedtest-status.component';
import { OutageDayChartComponent } from './outage-day-chart/outage-day-chart.component';
import { SpeedtestChartComponent } from './speedtest-chart/speedtest-chart.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AboutUptimeComponent } from './about-uptime/about-uptime';
import { UptimeReportComponent } from './uptime-report/uptime-report';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard-component';

const appRoutes : Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'report', component: UptimeReportComponent },
    { path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
]

@NgModule({
    declarations: 
    [
        AppComponent,
        AboutUptimeComponent,
        DashboardComponent,
        UptimeStatusComponent, 
        OutageLogComponent, 
        SpeedtestStatusComponent, 
        OutageDayChartComponent,
        SpeedtestChartComponent,
        SpinnerComponent,
        UptimeReportComponent,
    ],
    imports: 
    [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
          ),      
        NgbModule.forRoot(), 
        BrowserModule,
        HttpClientModule,
    ],
    providers: 
    [
        UptimeService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
