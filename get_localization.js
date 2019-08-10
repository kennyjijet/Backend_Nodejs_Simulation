
module.exports = function (event, context, dynamo) {

	/*var params = {
		AttributesToGet: [
			"language_version",
			"JsonData"
		],
		TableName: 'SoccerSimulationGameTable',
		Key: {
			"language_version": event.language_version
		}
    };

    dynamo.getItem(params, function (err, data) {
		if (data) {
			console.log(data);
			//var JsonObject = JSON.parse(data.Item.JsonData);
			//var JsonObject = (data.Item.JsonData.JsonData);
			//context.succeed(JsonObject);
			//context.succeed(data.Item.JsonData.JsonData[event.language_code]);
            context.succeed(data.Item.data.JsonData[event.language_code]);
		}
        else {
            context.succeed(err);
        }
    });*/
		dynamo.get({
			"TableName": "SoccerSimulationGameTable",
			Key: { 
              "name": "localization",
              "versions": event.language_version,
            }
		}, function (err, data) {
			if (err) {
				context.fail(err);
				return;
			}
			context.succeed(data.Item.data.JsonData[event.language_code]);
		});
        
   /*dynamo.get({
		"TableName": "SoccerSimulationGameTable",
		Key: { "name": event.name,
		    "versions": event.versions
		}
	}, function (err, data) {
		if (err) {
			context.fail(err);
			return;
		}
		context.succeed(JSON.parse(data.Item.data));
	});*/
};