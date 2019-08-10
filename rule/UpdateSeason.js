
var config = require("../config");
var cut = config.leagueTeam - 6;

function CheckSeason(dynamo, onFinish) {
	var season = 1 + Math.floor(config.day / config.seasonDay);
	var daySeason = (season - 1) * config.seasonDay;

	dynamo.query({
		TableName: "PlayerData",
		IndexName: "ModeIndex",
		Limit: 1,
		KeyConditionExpression: '#m = :m AND #t < :t',
		ExpressionAttributeNames: { '#m': 'Mode', "#t": "TimeStamp" },
		ExpressionAttributeValues: { ':m': 'League', ":t": daySeason },
		ProjectionExpression: "IDID , Rank , Scores"
	}, function (err, data) {
		if (err) {
			console.error(err);
			return setImmediate(CheckSeason, dynamo, onFinish);
		}

		var league = data.Items.shift();
		if (!league)
			return onFinish();
			
		var users = Object.keys(league.Scores).map(function (key) {
			var obj = { Score: 0, Goal: 0, Lose: 0 };
			
			return league.Scores[key].forEach(function (score) {
				obj.Score += score.Score;
				obj.Goal += score.Goal;
				obj.Lose += score.Lose;
			});

			return obj;
		}).sort(function (l, r) {
			var res = r.Score - l.Score;
			if (res == 0) {
				res = r.Goal - l.Goal;
				if (res == 0)
					res = r.Lose - l.Lose;
			}

			return res;
		});

        setImmediate(UpdateSeason, dynamo, season, users, function () {
			
			dynamo.update({
				TableName: "PlayerData",
				Key: { IDID: league.IDID },
				UpdateExpression: 'SET #t = :t REMOVE Rank',
				ExpressionAttributeNames: { '#t': 'TimeStamp' },
				ExpressionAttributeValues: { ':t': daySeason }
			}, function (err, data) {
				setImmediate(CheckSeason, dynamo, onFinish);
			});
        });
	});
}

module.exports	= CheckSeason;

function UpdateSeason(dynamo, season, users, onFinish) {

    var user = users.shift();
    if (!user)
        return onFinish();

	dynamo.update({
		TableName: "PlayerData",
		Key: { IDID: user.IDID },
		UpdateExpression: 'SET Rank = :r',
		ExpressionAttributeValues: { ":r": ChangeRank(user.Rank) }
	}, function (err, data) {
		if (err)
			users.unshift(user);

		setImmediate(UpdateSeason, dynamo, season, users, onFinish);
	});
}

function CalculateDivision(n,index) {
	var raw = Math.log(((n - 1) * index) + 1) / Math.log(n);
	return Math.ceil(Math.round(raw * 10000) / 10000);
}

function SumNPowerP(n,p) {
	return (1 - Math.pow(n,p + 1)) / (1 - n);
}

function ChangeRank(rank) {
	if (rank <= cut)
		return rank;
	
	var standing = (rank - 1) % config.leagueTeam;
	if (standing >= 2 || standing < cut)
		return rank;
	
	var leagueIndex = Math.ceil(rank / config.leagueTeam);
	var divisionIndex = CalculateDivision(3, leagueIndex);
	var lastPrev = SumNPowerP(3, divisionIndex - 1);
	var index = leagueIndex - lastPrev;
	
	if (standing < 2) {
		var prevIndex = SumNPowerP(3, divisionIndex - 2) + Math.ceil(index / 3);
		return (prevIndex * config.leagueTeam) + cut + (3 * standing) + ((index - 1) % 3);
	}

	standing -= cut;
	var nextIndex = SumNPowerP(3, divisionIndex) + (index * 3) - (standing % 3);
	return (nextIndex * config.leagueTeam) + Math.ceil(standing / 3);
}