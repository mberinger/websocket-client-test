#!/usr/bin/node
var publisher = require('./publisher.js');
var Twit = require('twit');
var config = require('./config.js');

var twitterPublisher = {

    type: "TWITTER",

    init: function() {
        // Create Twit config
        this.twitter = new Twit(config.twitter);
    },

    queryParams: {
        q: 'NZTA',
        count: 1
    },

    fetchTwitterUpdates: function(callback) {
        var app = this;

        // Initialise
        app.init();

        // Fetch tweets for configured params
        this.twitter.get(
            'search/tweets',
            this.queryParams,
            function(err, data, response) {
                console.log("Recieved data:");
                console.log(JSON.stringify(data));

                var parsedTwitterResponse = app.parse(data);
                console.log("Parsed to:");
                console.log(JSON.stringify(parsedTwitterResponse));
                callback(parsedTwitterResponse);
            }
        );
    },

    parse: function(data) {
        parsedUpdates = [];

        for (var index in data.statuses) {
            var currentUpdate = data.statuses[index];
            var parsedUpdate = {};

            parsedUpdate.id = currentUpdate.id.toString();
            parsedUpdate.title = currentUpdate.user.name + " (@" + currentUpdate.user.screen_name + ")";
            parsedUpdate.content = currentUpdate.text;
            parsedUpdate.type = "TWITTER";
            parsedUpdate.timestamp = currentUpdate.created_at;

            parsedUpdates.push(parsedUpdate)
        }

        return parsedUpdates;
    }
};

// Call function with fetcher as parameter
publisher.fetchAndExportUpdates(function(callback) {
    twitterPublisher.fetchTwitterUpdates(callback);
});