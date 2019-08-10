
var config = require("../config");

function GenMatch(dynamo, onFinish) {

	var matchDay = config.day % config.seasonDay;
	if (matchDay >= config.matchDays.length * 2)
		return onFinish();

	dynamo.query({
		TableName: "PlayerData",
		IndexName: "ModeIndex",
		Limit: 1,
		ScanIndexForward: false,
		KeyConditionExpression: '#m = :m AND #t <= :t',
		ExpressionAttributeNames: { '#m': 'Mode', '#t': ':t' },
		ExpressionAttributeValues: { ':m': "League", ":t": config.day }
	}, function (err, data) {
		if (err)
			return setImmediate(GenMatch, dynamo, onFinish);

		var league = data.Items.shift();
		if (!league)
			return onFinish();

		var matches = league.Matches[matchDay];
		GenSequence(dynamo, league, matches, matchDay, function () {

			dynamo.update({
				TableName: "PlayerData",
				Key: { IDID: league.IDID },
				UpdateExpression: 'SET #m = :m , #t = :t',
				ExpressionAttributeNames: { '#m': 'Mode', "#t": "TimeStamp" },
				ExpressionAttributeValues: { ':m': 'League', ":t": config.day + 1 }
			}, function (err, data) {
				setImmediate(GenMatch, dynamo, onFinish);
			});
		});
	});
}

module.exports = GenMatch;

function GenSequence(dynamo, league, matches, matchDay, onFinish) {
	var match = matches.shift();
	if (!match)
		return onFinish();

	GetMatchUsers(dynamo, match[0], match[1], function (err, unshift) {
		console.error(err);
		if (unshift)
			matches.unshift(match);
		return setImmediate(GenSequence, league, matches, matchDay, onFinish);
	}, function (home, away) {

		var gen = require('../Simulation/generate_live_match');
		var result = gen(home, away, "league");

		dynamo.update({
			TableName: "PlayerData",
			Key: { IDID: league.IDID },
			ReturnValues: "UPDATED_NEW",
			UpdateExpression: "REMOVE Matches[0] SET Scores.#h[" + matchDay + "] = :h , Scores.#a[" + matchDay + "] = :a , MatchSequence = list_append(if_not_exists(MatchSequence,:e),:s)",
			ExpressionAttributeNames: {
				"#h": home.IDID,
				"#a": away.IDID,
			},
			ExpressionAttributeValues: {
				":h": result.homeResult,
				":a": result.awayResult,
				':s': [result.sequencesData],
				':e': []
			}
		}, function (err, data) {
			if (err || !data.Attributes)
				matches.unshift(match);

			setImmediate(GenSequence, league, matches, matchDay, onFinish);
		});
	});
}

function GetMatchUsers(dynamo, homeID, awayID, onFail, onFinish) {

	dynamo.batchGet({
		RequestItems: {
			"PlayerData": {
				Keys: [
					{ "IDID": homeID },
					{ "IDID": awayID }
				]
			}
		}
	}, function (err, data) {
		if (err || !data.Responses || !data.Responses.PlayerData)
			return onFail("Fail to get player data", true);

		var home = data.Responses.PlayerData.find(function (value) { return homeID == value.IDID; });
		if (!home)
			return onFail("Fail to get home player : " + homeID, false);

		var away = data.Responses.PlayerData.find(function (value) { return awayID == value.IDID; });
		if (!away)
			return onFail("Fail to get away player : " + awayID, false);

		dynamo.query({
			TableName: "PlayerData",
			IndexName: 'OwnerID-index',
			KeyConditionExpression: 'OwnerID = :o',
			ExpressionAttributeValues: { ':hkey': homeID }
		}, function (err, data) {

			if (err || data.Items.length < 11)
				return onFail("Cannot get squad for " + homeID, false);

			home.squad = data.Items;

			dynamo.query({
				TableName: "PlayerData",
				IndexName: 'OwnerID-index',
				KeyConditionExpression: 'OwnerID = :o',
				ExpressionAttributeValues: { ':hkey': awayID }
			}, function (err, data) {
				if (err || data.Items.length < 11)
					return onFail("Cannot get squad for " + awayID, false);

				away.squad = data.Items;

				onFinish(home, away);
			});
		});
	});
}