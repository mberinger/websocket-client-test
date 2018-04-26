#!/usr/bin/node
var Twit = require('twit');
var moment = require('moment');

var config = require('./config.js');
var publisher = require('./publisher.js');

var twitterPublisher = {

    type: "TWITTER",

    screenName: "NZTAUpdates",

    init: function() {
        // Create Twit config
        this.twitter = new Twit(config.twitter);
    },


    fetchTwitterUpdates: function(callback) {
        var app = this;

        // Initialise
        app.init();

        // Fetch tweets for configured params
        app.twitter.get(
            'users/show',
            {
                screen_name: app.screenName
            },
            function(err, data, response) {
                if (err || !data.status) {
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
        var parsedUpdate = {};
        var currentUpdate = data.status;

        parsedUpdate.id = currentUpdate.id.toString();
        parsedUpdate.title = data.name + " (@" + data.screen_name + ")";
        parsedUpdate.content = currentUpdate.text;
        parsedUpdate.type = "TWITTER";
        parsedUpdate.timestamp = currentUpdate.created_at;

        parsedUpdates.push(parsedUpdate)

        return parsedUpdates;
    }
};

// Call function with fetcher as parameter
publisher.fetchAndExportUpdates(function(callback) {
    twitterPublisher.fetchTwitterUpdates(callback);
});