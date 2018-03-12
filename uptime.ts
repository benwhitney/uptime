import { UptimeService } from './uptime.service';
import { SpeedTestService } from './speedtest.service';
import { WebServer } from './webserver';

// run the service
let service: UptimeService = new UptimeService();
service.start();

let speedtest: SpeedTestService = new SpeedTestService();
speedtest.start();

let webServer: WebServer = new WebServer(service, speedtest);
webServer.start();
