This program will check your internet uptime.

Will perform a Ping or  NSLOOKUP on the desired IP once per minute.

We can either log the time up or time down.

working file:

YYYY-MM-DD.dat

HH:MM 1|0

Hourly:

{ 
    status: 1,
    timeOffset: 0 (seconds past midnight)
}

Daily:

{
    summary : {
        up: number,
        down: number
    },
    outages: [{
        startDate: date,
        endDate: date,
        duration: number 
    }]
}