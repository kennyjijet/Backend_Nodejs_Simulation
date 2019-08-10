
module.exports = function (event, context, dynamo) {

	/*dynamo.get({
		"TableName": "GameInfoData",
		Key: { "game_version" : "1.0" }
	}, function (err, data) {
		if (err) {
			context.fail(err);
			return;
		}

		context.succeed(data.Item);
	});*/
    dynamo.get({
		"TableName": "SoccerSimulationGameTable",
		Key: { "name": "game_info_data",
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