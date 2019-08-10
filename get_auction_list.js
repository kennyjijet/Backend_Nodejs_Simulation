
module.exports = function (event, context, dynamo) {

	/*
    dynamo.get({
		"TableName": "Auction",
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
		Key: { "name": event.name,
		    "versions": event.versions
		}
	}, function (err, data) {
		if (err) {
			context.fail(err);
			return;
		}
		context.succeed(JSON.parse(data.Item.data));
	});
};