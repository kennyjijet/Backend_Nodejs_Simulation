
module.exports = function(event, context,dynamo){

	/*
    dynamo.get({
		"TableName": "SoccerSimulationGameTable",
		Key: { "access_token": event.access_token }
	}, function (err, data) {
		if (err) {
			context.fail(err);
			return;
		}
		
		context.succeed(JSON.parse(data.Item.JsonData));
	});
    */
	dynamo.get({
		"TableName": "SoccerSimulationGameTable",
		Key: { "name": "news",
		    "versions": "1.0"
		}
	}, function (err, data) {
		if (err) {
			context.fail(err);
			return;
		}
		context.succeed(JSON.parse(data.Item.data));
	});
    
}