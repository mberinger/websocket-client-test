#!/usr/bin/node

// Create app
var app = {
    init: function() {
        // Initialise AWS - requires config in ~/.aws/credentials
        var AWS = require('aws-sdk');
        AWS.config.update({region: 'us-east-2'});
        this.ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
    },

    fetchUpdates: function() {
        // Declare update fetching logic here
        // Should return array of objects similar to https://github.com/TedChenNZ/avocado-spread/blob/master/dev-api-server/controllers/data.json
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
            tableUpdates.push({
                PutRequest: {
                    Item: {
                        "id" : { N: rawUpdates[index].id },
                        "title": { S: rawUpdates[index].title },
                        "content": { S: rawUpdates[index].content },
                        "type": { S: rawUpdates[index].type },
                        "timestamp": { S: rawUpdates[index].timestamp }
                    }
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

    fetchAndExportUpdates: function() {
        app.init();
        var updates = app.fetchUpdates();
        var batchedUpdates = app.batchUpdates(updates);
        app.exportUpdates(batchedUpdates);
    }
};

// Run
app.fetchAndExportUpdates();