
const dataFolder = 'data'; 

function testIsOnline(callback) {
    var isOnline = require("is-online");
    isOnline().then(online => {
        callback(online);
    });
}

function initDirectory() {
    var fs = require('fs');
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder)
    }
}

function getOutageFile() {
    return dataFolder + '/outage.json';
}

function getCurrentFileName() {
    var dateFormat = require('dateformat');
    var now = new Date();

    var current = dateFormat(now, 'yyyy-mm-dd');
    return dataFolder + '/' + current + '.log';
}

function formatTime() {
    var dateFormat = require('dateformat');
}

function update() {
    var now = new Date();
    var timeNow = now.toJSON();
    testIsOnline((online) => {
        var fn = getCurrentFileName();
        var fs = require('fs');
        var record = timeNow + ' ' + ( online ? '1' : '0');

        var obj = {
            time: timeNow,
            hour: now.getHours(),
            min: now.getMinutes(),
            online: online
        };
        console.log(record);
        fs.appendFileSync(getCurrentFileName(), JSON.stringify(obj)  + ',\n'); 
        checkStateChange(online);
    });
}

function checkStateChange(online) {
    if (lastState == null && online) {
        console.log('The internet is up!')
        lastState = online;
    }

    if (lastState != online) {
        lastState = online;
        if (online) {
            console.log('Internet Outage Ended');
            if (outageStartTime) {
                var outageEndTime = new Date();
                var diffMs = outageEndTime - outageStartTime;
                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                
                var obj = {
                    startTime: outageStartTime,
                    endTime: outageEndTime,
                    duration: diffMins
                };
                var record = JSON.stringify(obj);  
                console.log(record);
                var fs = require('fs');
                fs.appendFile(getOutageFile(), record + ',\n');
            }
        } else {
            console.log('THE INTERNET IS DOWN!');
            outageStartTime = new Date();
        }
    }
}

var outageStartTime = null;

function start() {
    initDirectory();
    var now = new Date();
    var seconds = 60 - now.getSeconds();
    var ms = 1000 - now.getMilliseconds();
    console.log('First check in ' + seconds);
    setTimeout(() => {
        setInterval(update, 60000);
        update();
    }, ((seconds - 1) * 1000) + ms);
}

var lastState = null;

console.log('Uptime Monitor', new Date());
start();