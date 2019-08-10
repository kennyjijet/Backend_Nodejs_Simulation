
var config = require("../config");

function UpdateRanking(dynamo, onFinish) {

	dynamo.query({
		TableName: "PlayerData",
		IndexName: "RankIndex",
		Limit: 1,
		ScanIndexForward: false,
		KeyConditionExpression: '#m = :m',
		ExpressionAttributeNames: { '#m': 'Mode' },
		ExpressionAttributeValues: { ':m': "League" }
	}, function (err, data) {
		if (err) {
			console.error(err);
			return setImmediate(UpdateRanking, dynamo, onFinish);
		}

		var league = data.Items.shift();
		UpdateUsersRanking(dynamo, league, function () {
			setImmediate(UpdateRanking, dynamo, onFinish);
		});
	});
}

module.exports = UpdateRanking;

function UpdateUsersRanking(dynamo, league, onFinish) {

	var key = league ? league.LastKey : null;
	var index = league ? league.Rank + 1 : 1;

	dynamo.query({
		TableName: "PlayerData",
		IndexName: "RankIndex",
		Limit: config.leagueTeam,
		ExclusiveStartKey: key,
		ScanIndexForward: true,
		KeyConditionExpression: '#m = :m',
		ExpressionAttributeNames: { '#m': 'Mode' },
		ExpressionAttributeValues: { ':m': "Manager" }
	}, function (err, data) {
		if (err) {
			console.error(err);
			return setImmediate(UpdateUsersRanking, dynamo, league, onFinish);
		}

		if (!(data.Items && data.Items.length > 0))
			return onFinish();

		FillBot(dynamo, data.Items, function () {

			var users = RandomSort([].concat(data.Items));

			var matches = config.matchDays.map(function (matchDay) {
				return matchDay.map(function (p) { return [users[p[0]], users[p[1]]]; });
			}).concat(config.matchDays.reverse().map(function (matchDay) {
				return matchDay.map(function (p) { return [users[p[1]], users[p[0]]]; });
			}));

			var emptyScores = data.Items.reduce(function (obj, item) {
				obj[item.IDID]	= matches.map(function (match) { return {}; });
				return obj;
			}, {});

			var lastKey = data.LastEvaluatedKey;
			dynamo.update({
				TableName: "PlayerData",
				Key: { IDID: "League:" + index },
				ReturnValues: "UPDATED_NEW",
				UpdateExpression: 'SET #m = :r , Rank = :i , LastKey = :k , Matches = :m , Scores = :s , Teams = :t',
				ExpressionAttributeNames: { '#m': 'Mode' },
				ExpressionAttributeValues: {
					":i": index,
					":k": lastKey,
					":m": matches,
					":n": "Refresh",
					":s": emptyScores,
					":t": data.Items.map(function (item) { return { IDID: item.IDID }; })
				}
			}, function (err, data) {
				if (!err)
					league = { LastKey: lastKey, Rank: index + 1 };

				console.error(err);
				setImmediate(UpdateUsersRanking, dynamo, league, onFinish);
			});
		});
	});
}

function RandomSort(array) {
	var i = array.length;
	while (i > 1) {
		var rnd = Math.floor(i * Math.random());
		i--;

		var tmp = array[rnd];
		array[rnd] = array[i];
		array[i] = tmp;
	}
}

var bots = [];
function FillBot(dynamo, users, onFinish) {
	if (users.length >= config.leagueTeam)
		return onFinish();
		
	if (bots && bots.length >= config.leagueTeam) {
		var tmpBots = [].concat(bots);
		while (users.length < config.leagueTeam)
			users.push(tmpBots.splice(Math.floor(Math.random() * tmpBots.length), 1).shift());
			
		return onFinish();
	}

	dynamo.query({
		Limit: 50,
		TableName: "PlayerData",
		IndexName: "RankIndex",
		KeyConditionExpression: '#m = :m',
		ExpressionAttributeNames: { '#m': 'Mode' },
		ExpressionAttributeValues: { ':m': "Bot" }
	}, function (err, data) {

		bots = data.Items.map(function (item) { return item.IDID; });
		if (err || (bots && bots.length >= config.leagueTeam))
			return setImmediate(FillBot, dynamo, users, onFinish);

		throw new Error("Not enough bot in database");
	});
}
