#!/usr/bin/node
var publisher = require('./publisher.js');
var moment = require('moment');

var getCurrentUTCTime = function() {
    return moment().utc().format('YYYY-MM-DDTHH:mm:ss+00:00');
}

// Samples
var samples = {
    "ENFORCEMENT": [
        {
            "id": "951",
            "title": "Roadside Inspection",
            "content": "Pete S. pulled over",
            "type": "ENFORCEMENT",
            "timestamp": getCurrentUTCTime(),
            "severity": "3"
        },
        {
            "id": "952",
            "title": "Roadside Inspection",
            "content": "John C. inspection complete",
            "type": "ENFORCEMENT",
            "timestamp": getCurrentUTCTime(),
            "severity": "2"
        },
        {
            "id": "953",
            "title": "Speeding Ticket",
            "content": "Mike A. speeding ticket",
            "type": "ENFORCEMENT",
            "timestamp": getCurrentUTCTime(),
            "severity": "3"
        }
    ],
    "GEOFENCE":  [
        {
            "id": "961",
            "title": "Arrived at Depot",
            "content": "Mike A. arrived at Depot",
            "type": "GEOFENCE",
            "timestamp": getCurrentUTCTime(),
            "severity": "1"
        },
        {
            "id": "962",
            "title": "Left Depot",
            "content": "Mike A. left the Depot",
            "type": "GEOFENCE",
            "timestamp": getCurrentUTCTime(),
            "severity": "1"
        },
        {
            "id": "963",
            "title": "Site Checkin",
            "content": "John B. arrived on site",
            "type": "GEOFENCE",
            "timestamp": getCurrentUTCTime(),
            "severity": "1"
        },
        {
            "id": "964",
            "title": "Site Checkout",
            "content": "John B. left the site",
            "type": "GEOFENCE",
            "timestamp": getCurrentUTCTime(),
            "subtitle" : "Depot",
            "severity": "1"
        }
    ],
    "TRAFFIC":  [
        {
            "id": "971",
            "title": "Traffic Update",
            "content": "Harbour Bridge closed",
            "type": "TRAFFIC",
            "timestamp": getCurrentUTCTime(),
            "severity": "4"
        },
        {
            "id": "972",
            "title": "Traffic Update",
            "content": "Harbour Bridge Reopened",
            "type": "TRAFFIC",
            "timestamp": getCurrentUTCTime(),
            "severity": "2"
        },
        {
            "id": "973",
            "title": "Traffic Update",
            "content": "Traffic flowing in your area",
            "type": "TRAFFIC",
            "timestamp": getCurrentUTCTime(),
            "severity": "1"
        },
        {
            "id": "974",
            "title": "Traffic Update",
            "content": "SH1 Closed for repairs after 10PM",
            "type": "TRAFFIC",
            "timestamp": getCurrentUTCTime(),
            "severity": "3"
        }
    ],
    "OVERSPEED":  [
        {
            "id": "981",
            "title": "Overspeed Alert",
            "content": "Mike B. 110km/h in 50km/h",
            "type": "OVERSPEED",
            "timestamp": getCurrentUTCTime(),
            "severity": "4"
        },
        {
            "id": "982",
            "title": "Overspeed Alert",
            "content": "John C. 55km/h in 50km/h",
            "type": "OVERSPEED",
            "timestamp": getCurrentUTCTime(),
            "severity": "2"
        },
        {
            "id": "983",
            "title": "Overspeed Alert",
            "content": "Pete A. 60km/h in 50km/h",
            "type": "OVERSPEED",
            "timestamp": getCurrentUTCTime(),
            "severity": "2"
        }
    ]
};

var requestType = process.argv[2];
if (requestType == undefined) {
    console.log("Please suggest a type");
    return;
}

// Get random event for type
var possibleMessages = samples[requestType];
if (possibleMessages == undefined) {
    console.log("Please suggest a valid type");
    return;
}
var message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];


// Call function with fetcher as parameter
publisher.fetchAndExportUpdates(function(callback) {
    callback([message]);
});