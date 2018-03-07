import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UptimeStatusComponent } from './uptime-status/uptime-status.component';
import { HttpClientModule } from '@angular/common/http';
import { UptimeService } from './uptime-service/uptime.service';
import { OutageLogComponent } from './outage-log/outage-log.component';

@NgModule({
    declarations: [AppComponent, UptimeStatusComponent, OutageLogComponent],
    imports: [BrowserModule, HttpClientModule],
    providers: [UptimeService],
    bootstrap: [AppComponent],
})
export class AppModule {}
