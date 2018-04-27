#!/usr/bin/node
var moment = require('moment');
var request = require('request');

var config = require('./config.js');
var publisher = require('./publisher.js');

var weatherPublisher = {

    type: "WEATHER",
    city: "Auckland",
    units: "metric",

    init: function() {
        // get weather config which includes the all important openweathermap apikey
        this.weatherConfig = config.weather;
    },


    fetchWeatherUpdates: function(callback) {
        var app = this;

        // Initialise
        app.init();

        var request = require('request');

        var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + this.city + '&units=' + this.units + '&appid=' + app.weatherConfig.apiKey;

        // Fetch the weather for configured params
        request(url, function (err, response, data) {
            if (err) {
                console.log(err);
                console.log("Did not receive any data!");
                callback(null);
            } else {
                console.log("Received data:");
                console.log(JSON.stringify(data));

                var parsedWeatherResponse = app.parse(data);
                console.log("Parsed to:");
                console.log(JSON.stringify(parsedWeatherResponse));
                callback(parsedWeatherResponse);
            }
        });
    },

    parse: function(data) {
        parsedUpdates = [];
        var parsedUpdate = {};

        var jsonData = JSON.parse(data);

        var weather = jsonData.weather[0];

        parsedUpdate.id = jsonData.id.toString();
        parsedUpdate.title = "Forecast in " + this.city + " is: " + weather.main;
        parsedUpdate.content = "It's currently " + jsonData.main.temp + " degrees in " + this.city + " and the weather is described as: " + weather.description;
        parsedUpdate.type = this.type;
        //parsedUpdate.timestamp = moment(jsonData.dt).utc().format('YYYY-MM-DDTHH:mm:ss+00:00');
        parsedUpdate.timestamp = moment().utc().format('YYYY-MM-DDTHH:mm:ss+00:00');

        parsedUpdates.push(parsedUpdate);

        return parsedUpdates;
    }
};

// Call function with fetcher as parameter
publisher.fetchAndExportUpdates(function(callback) {
    weatherPublisher.fetchWeatherUpdates(callback);
});