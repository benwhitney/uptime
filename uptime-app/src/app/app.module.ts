import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { UptimeStatusComponent } from './uptime-status/uptime-status.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { UptimeService } from './uptime-service/uptime.service';
import { OutageLogComponent } from './outage-log/outage-log.component';
import { SpeedtestStatusComponent } from './speedtest-status/speedtest-status.component';

@NgModule({
    declarations: [AppComponent, UptimeStatusComponent, OutageLogComponent, SpeedtestStatusComponent],
    imports: [NgbModule.forRoot(), BrowserModule, HttpClientModule],
    providers: [UptimeService],
    bootstrap: [AppComponent],
})
export class AppModule {}
