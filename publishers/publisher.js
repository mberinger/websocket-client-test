#!/usr/bin/node

// Create app
module.exports = {
    init: function() {
        // Initialise AWS - requires config in ~/.aws/credentials
        var AWS = require('aws-sdk');
        AWS.config.update({region: 'us-east-2'});
        this.ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
    },

    batchUpdates: function(rawUpdates) {
        // Group items into batch
        var batchedUpdates = {
            RequestItems: {
                "liveroad": []
            }
        };
        var tableUpdates = batchedUpdates.RequestItems.liveroad;

        // Iterate over messages and put into correct format
        for (var index in rawUpdates) {
            var newUpdate = {
                "id" : { N: rawUpdates[index].id },
                "title": { S: rawUpdates[index].title },
                "content": { S: rawUpdates[index].content },
                "type": { S: rawUpdates[index].type },
                "timestamp": { S: rawUpdates[index].timestamp },
                "severity": { S: rawUpdates[index].severity }
            };

            // Optional parameters
            if (rawUpdates[index].subtitle) {
                newUpdate["subtitle"] = { S: rawUpdates[index].subtitle };
            }
            if (rawUpdates[index].url) {
                newUpdate["url"] = { S: rawUpdates[index].url };
            }

            tableUpdates.push({
                PutRequest: {
                    Item: newUpdate
                }
            });
        }

        console.log("Published items: ")
        console.log(JSON.stringify(batchedUpdates));

        return batchedUpdates;
    },

    exportUpdates: function(batchedUpdates) {
        // Call DynamoDB to add the item to the table
        this.ddb.batchWriteItem(batchedUpdates, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });
    },

    sanitiseUpdates: function(rawUpdates) {
        for (var index in rawUpdates) {
            var currentUpdate = rawUpdates[index];

            // Sanitise..
        }

        return rawUpdates;
    },

    fetchAndExportUpdates: function(fetchFunction) {
        var mainApp = this;

        mainApp.init();
        fetchFunction(function(rawUpdates) {
            if (rawUpdates != null) {
                var sanitisedUpdates = mainApp.sanitiseUpdates(rawUpdates)
                var batchedUpdates = mainApp.batchUpdates(sanitisedUpdates);

                console.log("Sending updates..");
                console.log(JSON.stringify(batchedUpdates));

                mainApp.exportUpdates(batchedUpdates);
            } else {
                console.log("Recieved no updates");
            }
        });
    }
};