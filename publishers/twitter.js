#!/usr/bin/node
var Twit = require('twit');
var moment = require('moment');

var config = require('./config.js');
var publisher = require('./publisher.js');

var twitterPublisher = {

    type: "TWITTER",

    init: function() {
        // Create Twit config
        this.twitter = new Twit(config.twitter);
    },

    keywords: "eroad",

    getTimeOneMinuteAgoUTC: function() {
        var momentUTC = moment.utc().subtract(5, "minutes");
        return momentUTC.format('YYYY-MM-DD HH:ss');
    },

    fetchTwitterUpdates: function(callback) {
        var app = this;

        // Initialise
        app.init();

        // Fetch tweets for configured params
        app.twitter.get(
            'search/tweets',
            {
                q: app.keywords,
                //since: app.getTimeOneMinuteAgoUTC(),
                lang: "en",
                //geocode: "-36.8485 174.7633 100km", // Auckland, NZ
                count: 10
            },
            function(err, data, response) {
                if (err || !data.statuses || data.statuses.length < 1) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    } else {
                        console.log(JSON.stringify(data));
                    }
                    console.log("Did not recieve any data!");
                    callback(null);
                } else {
                    console.log("Recieved data:");
                    console.log(JSON.stringify(data));

                    var parsedTwitterResponse = app.parse(data);
                    console.log("Parsed to:");
                    console.log(JSON.stringify(parsedTwitterResponse));
                    callback(parsedTwitterResponse);
                }
            }
        );
    },

    parse: function(data) {
        parsedUpdates = [];

        for (var index in data.statuses) {
            var currentUpdate = data.statuses[index];
            var parsedUpdate = {};

            parsedUpdate.id = currentUpdate.id.toString();
            parsedUpdate.title = currentUpdate.user.name;
            parsedUpdate.subtitle = "@" + currentUpdate.user.screen_name;
            parsedUpdate.content = currentUpdate.text;
            parsedUpdate.type = "TWITTER";
            parsedUpdate.timestamp = moment(currentUpdate.created_at).utc().format('YYYY-MM-DDTHH:mm:ss+00:00');
            parsedUpdate.url = "https://twitter.com/" + currentUpdate.user.screen_name + "/status/" + currentUpdate.id_str;
            parsedUpdate.severity = 1;

            parsedUpdates.push(parsedUpdate)
        }

        return parsedUpdates;
    }
};

// Call function with fetcher as parameter
publisher.fetchAndExportUpdates(function(callback) {
    twitterPublisher.fetchTwitterUpdates(callback);
});