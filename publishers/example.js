#!/usr/bin/node
var publisher = require('./publisher.js');

// Set up publisher here

// Call function with fetcher as parameter
publisher.fetchAndExportUpdates(function() {
    return [
        {
            "id": "1",
            "title": "Overspeed",
            "content": "Jane is going too fast!",
            "type": "OVERSPEED",
            "timestamp": "2018-04-26T03:43:21+00:00"
        },
        {
            "id": "2",
            "title": "Traffic Alert",
            "content": "CRASH occurred on SH1 (thanks, Gwyneth)",
            "type": "TRAFFIC",
            "timestamp": "2018-04-26T03:59:21+00:00"
        }
    ];
});