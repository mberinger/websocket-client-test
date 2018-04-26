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

    fetchAndExportUpdates: function(fetchFunction) {
        this.init();
        var rawUpdates = fetchFunction();
        var batchedUpdates = this.batchUpdates(rawUpdates);
        this.exportUpdates(batchedUpdates);
    }
};