
module.exports = function (event, context, dynamo) {
	/*var playerExists = false;
	///////////////////////////// Create new item Dynamo (putItem)
	//context.succeed(playerExists);
	if (playerExists)
		return;

	dynamo.put({
		TableName: "Localization",
		Item: {
			'language_version': event.language_version,
			'JsonData': event
		}
	},context.done);
    */
    dynamo.put({
		TableName: "SoccerSimulationGameTable",
		Item: {
			'name': "localization",
			'versions':event.language_version,
			'data': event
		}
	},context.done);
}