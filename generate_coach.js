var M = 1000000;

var config = require("config.js");

module.exports = function (event, context, dynamo) {

	if (!(event.slot >= 0 && event.slot <= 6))
		return context.fail("Need slot 0 - 6", "RangeError");

	if (event.level < 0) {
		return dynamo.update({
			TableName: "PlayerData",
			Key: { "IDID": context.identity.cognitoIdentityId },
			ReturnValues: "UPDATED_OLD",
			ConditionExpression: "size(trainingFields) > :f AND attribute_exists(trainingFields[" + event.slot + "].coach)",
			UpdateExpression: "REMOVE trainingFields[" + event.slot + "].coach",
			ExpressionAttributeValues: { ":f": event.slot }
		}, context.done);
	}

	if (!(event.level < coachRand.length))
		return context.fail("Need specific random level 0 - 4", "RangeError");

	event.slot = Math.floor(event.slot);
	var rand = coachRand[Math.floor(event.level)];

	var coach = {};
	coach.skillList = {};
	coach.birthSeason = config.season - randomRange(rand.minAge, rand.maxAge);
	coach.retireSeason = coach.birthSeason + randomRange(rand.minRetire, rand.maxRetire);


	var mainPool = poolStat[randomFloor(poolStat.length)];
	var otherPool = config.allStat.filter(function (item) { return mainPool.indexOf(item) < 0; });

	var skillCount = takeWeight(rand.skills, Math.random());

	var pool = mainPool;
	while (skillCount > 0) {

		skillCount--;
		coach.skillList[randomTake(pool)] = takeWeight(rand.levels, Math.random());
		pool = (mainPool.length > 0 && Math.random() < 0.65) ? mainPool : otherPool;
	}

	var http = require('http');
	var req = http.request("http://api.uinames.com/?gender=male&amount=" + 1, function (res) {
        console.log('Status:', res.statusCode);
        res.setEncoding('utf8');

        var body = '';
        res.on('data', function (chunk) { body += chunk; });
        res.on('end', function () {
            console.log('Successfully processed HTTPS response');
            var items = JSON.parse(body);
			console.log(items);
            if (!items || items.length != 1)
                return context.fail("Cannot generate name, Try again");

			coach.fullName = items[0].name + " " + items[0].surname;
			dynamo.update({
				TableName: "PlayerData",
				Key: { "IDID": context.identity.cognitoIdentityId },
				ReturnValues: "UPDATED_NEW",
				ConditionExpression: "currencies.money >= :m AND currencies.#t >= :t AND size(trainingFields) > :f AND attribute_not_exists(trainingFields[" + event.slot + "].coach)",
				UpdateExpression: "SET currencies.money = currencies.money - :m , currencies.#t = currencies.#t - :t , trainingFields[" + event.slot + "].coach = :c",
				ExpressionAttributeNames: { "#t": "token" },
				ExpressionAttributeValues: {
					":f": event.slot,
					":m": rand.money,
					":t": rand.token,
					":c": coach
				}
			}, context.done);
        });
    });

    req.on('error', context.fail);
    req.end();
};

function randomFloor(max) {
	return Math.floor(Math.random() * max);
};

function randomRange(min,max) {
	return min + Math.floor(Math.random() * (max - min + 1));
};

function randomTake(array) {
	return array.splice(randomFloor(array.length), 1)[0];
}

function takeWeight(array, weight) {
	if (array.length < 3 || array.length % 2 === 0)
		throw new RangeError("takeWeight need array with odd length more than 2");

	var accum = 0;

	var i = 2;
	while (i < array.length && accum + array[i - 1] <= weight) {
		accum += array[i - 1];
		i += 2;
	}

	return array[i - 2];
}

var coachRand = [
	{
		money: 0.75 * M,
		token: 0,
		minAge:45,
		maxAge:49,
		minRetire:50,
		maxRetire: 52,
		skills:[1,0.6,2],
		levels:[1,0.5,2],
	},
	{
		money: 1.25 * M,
		token: 0,
		minAge:43,
		maxAge:47,
		minRetire:50,
		maxRetire: 53,
		skills:[1,0.15,2,0.5,3],
		levels:[1,0.3,2,0.5,3],
	},
	{
		money: 3 * M,
		token: 0,
		minAge:40,
		maxAge:45,
		minRetire:50,
		maxRetire: 55,
		skills:[2,0.15,3,0.45,4],
		levels:[1,0.2,2,0.5,3],
	},
	{
		money: 0,
		token: 6,
		minAge:39,
		maxAge:44,
		minRetire:51,
		maxRetire: 56,
		skills:[3,0.1,4,0.4,5],
		levels:[2,0.3,3],
	},
	{
		money: 0,
		token: 10,
		minAge:38,
		maxAge:43,
		minRetire:52,
		maxRetire: 58,
		skills:[4,0.3,5],
		levels:[2,0.05,3],
	},
];

var poolStat = [
	["firstTouch", "dribbling", "technique", "agility"],
	["aggression", "determination", "leadership"],
	["acceleration", "agility", "pace"],
	["balance", "stamina", "strength"],
	["flair", "offTheBall", "crossing", "passing"],
	["finishing", "longShorts", "corner", "freekick", "penaltyTaking"],
	["marking", "passing", "tackling", "positioning"],
	["handling", "kicking", "rushingOut", "reflex", "oneOnOnes"],
	["decisions", "positioning", "teamwork", "heading", "jumping", "aerialAbility"]
];