
var config = require("../config");

function UpdateLeague(dynamo, onFinish) {

	dynamo.query({
		TableName: "PlayerData",
		IndexName: "ModeIndex",
		Limit: 1,
		ScanIndexForward: false,
		KeyConditionExpression: '#m = :m',
		ExpressionAttributeNames: { '#m': 'Mode' },
		ExpressionAttributeValues: { ':m': "Refresh" }
	}, function (err, data) {
		if (err)
			return setImmediate(UpdateLeague, dynamo, onFinish);

		var league = data.Items.shift();
		if (!league)
			return onFinish();

		dynamo.batchGet({
			RequestItems: {
				"PlayerData": { Keys: league.Teams }
			}
		}, function (err, data) {
			if (err || !(data.Responses && data.Responses.PlayerData && data.Responses.PlayerData.length > 0))
				return setImmediate(UpdateLeague, dynamo, onFinish);

			var users = data.Responses.PlayerData;

			var rank = config.leagueTeam * (league.Rank - 1);
			users.forEach(function (user, index) {
				user.ToRank = rank + index + 1;
			});

			UpdateUserRank(dynamo, users, function () {
				dynamo.update({
					TableName: "PlayerData",
					Key: { IDID: league.IDID },
					UpdateExpression: 'SET #m = :m',
					ExpressionAttributeNames: { '#m': 'Mode', "#t": "TimeStamp" },
					ExpressionAttributeValues: { ':m': "League", ":t": config.day }
				}, function (err, data) {
					if (err)
						console.error(err);

					setImmediate(UpdateLeague, dynamo, onFinish);
				});
			});
		});
	});
}

module.exports = UpdateLeague;

function UpdateUserRank(dynamo, users, onFinish) {
	if (!(users && users.length > 0))
		return onFinish();

	var user = users.shift();
	if (user.Rank == user.ToRank)
		return setImmediate(UpdateUserRank, config.season, users, onFinish);

	dynamo.update({
		TableName: "PlayerData",
		Key: { IDID: user.IDID },
		ReturnValues: "UPDATED_NEW",
		UpdateExpression: "SET Rank = :r",
		ExpressionAttributeValues: { ':r': user.ToRank }
	}, function (err, data) {
		if (err || !data.Attributes || data.Attributes.Rank != user.ToRank)
			users.unshift(user);
		
		setImmediate(UpdateUserRank, config.season, users, onFinish);
	});
}