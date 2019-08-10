
var config = require("config.js");

module.exports = function (event, context, dynamo) {

	SwitchFor(event,context, dynamo, function (quality, minAge, maxAge, roles, mode) {
		if (!(minAge >= 16))
			minAge = 16;
		if (!(maxAge <= 32))
			maxAge = 32;

		if (!(quality >= 4))
			quality = 4;
		if (!(quality <= 28))
			quality = 28;

		if (roles.length < 1)
			return context.fail("Nothing generated","NoError");


		var start = process.hrtime();
		var now = new Date().getTime();
		var shift = Math.floor(process.hrtime(start)[1] / 20);
		if (shift < 1)
			shift = 1;

		console.log("GenSquad : " + start);
		var nanosec = start[1];
		var sec = Math.floor(now / 1000);
		console.log(sec + " " + nanosec);

		GenSquad(context, roles.length, function (items) {
			var writeItems = [];

			var squads = [];
			items.forEach(function (item, index) {
				nanosec += shift;
				if (nanosec > 1000000000) {
					sec++;
					nanosec = nanosec % 1000000000;
				}

				squads[index] = JSON.parse(JSON.stringify(charaData));
				squads[index].IDID = "pid" + sec + ("000000000" + nanosec).slice(-9);
				
				if (mode == "Player")
					squads[index].OwnerID = context.identity.cognitoIdentityId;
				else squads[index].Price = 10;

				squads[index].profile = GenProfile(item, minAge, maxAge);
				squads[index].status = GenStat(quality, roles[index]);
				squads[index].TimeStamp = -1;
				squads[index].Mode = mode;
				squads[index].Rank = 0;
				
				squads[index].parameter.number	= index + 1;
				squads[index].parameter.positionIndex	= -1;

				writeItems.push({ PutRequest: { Item: squads[index] } });
			}, this);

			console.log("WriteItems");
			dynamo.batchWrite({
				RequestItems: { PlayerData: writeItems }
			}, function (err, data) {
				console.log("BatchWrite");
				if (err)
					return context.fail(err);

				context.succeed(squads);
			});
		});
	});
};

function SwitchFor(event, context, dynamo, callBack) {

	switch (event.for) {
		case "Init":
			dynamo.query({
				TableName: "PlayerData",
				IndexName: "OwnerID-index",
				KeyConditionExpression: "OwnerID = :h",
				ExpressionAttributeValues: { ":h": context.identity.cognitoIdentityId }
			}, function (err, data) {
				console.log("Query Squad");
				if (err)
					return context.fail(err);

				if (data.Items && data.Items.length > 10)
					return callBack(4, 16, 24, []);

				var newPlayer = 20 - data.Items.length;

				var roles = [0, 0, 21 + Math.floor(Math.random() * 3)];
				while (roles.length < Math.ceil(newPlayer / 2))
					roles.push(1 + Math.floor(Math.random() * 10));
				while (roles.length < newPlayer)
					roles.push(11 + Math.floor(Math.random() * 13));

				callBack(4, 16, 25, roles,"Player");
			});

			return;

		case "Youth":
			dynamo.update({
				TableName: "PlayerData",
				Key: { IDID: context.identity.cognitoIdentityId },
				UpdateExpression: "grounds.youthCenter.lastCollectProductTimestamp = :t",
				ConditionExpression: "grounds.youthCenter.lastCollectProductTimestamp < :p",
				ExpressionAttributeValues: {
					":t": new Date().getTime(),
					":p": new Date().getTime() - (7 * 24 * 60 * 60 * 1000)
				}
			}, function (err, data) {
				if (err)
					return context.fail(err);

				callBack(5, 16, 18, [Math.floor(Math.random() * 24)],"Player");
			});

			return;

		case "Scout":
			if (!(event.division > 0 && event.division <= 25))
				return context.fail("for Scout need division between 1 - 25");

			dynamo.query({
				TableName: "PlayerData",
				IndexName: "ModeIndex",
				KeyConditionExpression: "#m = :m",
				ExpressionAttributeNames: { "#m": "Mode" },
				ExpressionAttributeValues: { ":m": "ScoutD" + event.division }
			}, function (err, data) {
				console.log("Query Squad");
				if (err)
					return context.fail(err);

				if (!(data.Items && data.Items.length > 10))
					data.Items = [];

				var roles = [];
				while (roles.length < 10 - data.Items.length)
					roles.push(Math.floor(Math.random() * 23));

				callBack(event.division, 25, 32, roles,"ScoutD" + event.division);
			});

			return;

		default:
			return context.succeed({
				errorCode: 0,
				errorMessage: "event.for : " + event.for + " - is not valid"
			});
	}
}

var http = require('http');
function GenSquad(context, count, callBack) {
	var req = http.request("http://api.uinames.com/?gender=male&amount=" + count, function (res) {
        console.log('Status:', res.statusCode);
        res.setEncoding('utf8');

        var body = '';
        res.on('data', function (chunk) { body += chunk; });
        res.on('end', function () {
            console.log('Successfully processed HTTPS response');
            var items = JSON.parse(body);
			console.log(items);
            if (!items || items.length != count)
                return context.fail("Cannot generate name, Try again");

			callBack(items);
        });
    });
	
    req.on('error', context.fail);
    req.end();
}

var allPosition = {
	"GK": {
		t5: ["handling", "reflex", "rushingOut"],
		t2: ["kicking", "oneOnOnes", "aerialAbility", "positioning", "jumping", "decisions", "teamwork"]
	}, "DC": {
		t6: ["tackling"],
		t4: ["strength", "marking", "heading"],
		t2: ["positioning", "decisions", "passing", "teamwork", "acceleration", "balance", "jumping", "pace", "stamina", "technique"],
	}, "DW": {
		t6: ["tackling"],
		t4: ["strength", "marking", "pace"],
		t2: ["dribbling", "crossing", "passing", "positioning", "teamwork", "acceleration", "balance", "stamina", "agility", "technique"],
	}, "DMC": {
		t4: ["strength", "marking", "decisions", "tackling"],
		t2: ["positioning", "passing", "heading", "acceleration", "agility", "balance", "pace", "stamina", "technique", "teamwork"],
	}, "MC": {
		t6: ["passing"],
		t4: ["tackling", "technique", "positioning"],
		t2: ["longShorts", "dribbling", "decisions", "heading", "strength", "balance", "agility", "acceleration", "stamina"],
	}, "AMC": {
		t6: ["passing"],
		t4: ["decisions", "technique", "dribbling"],
		t2: ["offTheBall", "longShorts", "finishing", "crossing", "acceleration", "balance", "agility", "pace", "stamina", "strength"],
	}, "MW": {
		t4: ["dribbling", "crossing", "passing", "pace", "technique", "acceleration"],
		t2: ["positioning", "longShorts", "offTheBall", "agility", "balance", "stamina", "strength", "decisions"],
	}, "ST": {
		t6: ["finishing"],
		t4: ["heading", "dribbling", "pace"],
		t2: ["acceleration", "agility", "balance", "strength", "offTheBall", "technique", "passing", "jumping", "stamina", "longShorts", "decisions"],
	}
};

function GenProfile(item,minAge,maxAge)
{
	var profile = {};
	
	profile.birthSeason = config.season - Math.floor(minAge + ((maxAge - minAge + 1) * Math.random()));
	
	profile.fullName = item.name + " " + item.surname;
	profile.shortName = item.name[0] + ". " + item.surname;
	profile.nationality = item.country;
	
	profile.height = Math.floor(150 + (30 * Math.sqrt(2 * Math.random())));
	profile.weight = Math.floor(Math.pow(profile.height / 100, 2) * (20 + (5 * Math.random())));
	
	var footed = Math.floor(3 * Math.sqrt(Math.random()));
	profile.footed = ["either", "left", "right"][footed];
	
	profile.progressRate = Math.floor(4 * Math.pow(Math.random(),3));
	profile.cureRate = Math.floor(4 * Math.pow(Math.random(), 3));
	
	profile.talents = [];
	
	return profile;
}

var slotPositions = [
	[0,0],
	[1,2],[1,1],[1,0],[1,-1],[1,-2],
	[2,2],[2,1],[2,0],[2,-1],[2,-2],
	[3,2],[3,1],[3,0],[3,-1],[3,-2],
	[4,2],[4,1],[4,0],[4,-1],[4,-2],
	[5,1],[5,0],[5,-1],
];

function GenStat(quality, role) {
	var statData = {};
	config.allStat.forEach(function (stat) {
		statData[stat] = 200 + (quality * 15) + Math.floor(quality * 10 * Math.sqrt(Math.random()));
	}, this);

	statData.humanRelation = {};
	statData.roles = [];

	statData.roles[0] = 0;

	var isGoal = false;
	if (role < 1) {
		statData.roles[0] = 1600 + Math.ceil(Math.random() * 400);
		role = 1 + Math.floor(Math.random() * 23);
		isGoal = true;
	}

	var adjac = 0;
	var exceptGoal = slotPositions.slice(1);
	
	exceptGoal.forEach(function (item, i) {
		var lx = exceptGoal[i][0] - exceptGoal[role - 1][0];
		var ly = exceptGoal[i][1] - exceptGoal[role - 1][1];

		statData.roles[i + 1] = Math.sqrt((lx * lx) + (ly * ly));
		if (statData.roles[i + 1] < 1.1)
			adjac++;
	});

	statData.roles[0] = Math.floor(statData.roles[0]);
	exceptGoal.forEach(function (item, i) {
		var l = statData.roles[i + 1];

		statData.roles[i + 1] *= (1600 + Math.ceil(Math.random() * 400)) / Math.pow(adjac, l);
		if (isGoal)
			statData.roles[i + 1] *= 0.5;

		statData.roles[i + 1] = Math.floor(statData.roles[i + 1]);
	});

	var roleStat;
	if (isGoal)
		roleStat = "GK";
	else if (role == 1 && role == 5 && role == 6 && role == 10)
		roleStat = "DW";
	else if (role == 11 && role == 15 && role == 16 && role == 20)
		roleStat = "MW";
	else if (role < 5)
		roleStat = "DC";
	else if (role < 10)
		roleStat = "DMC";
	else if (role < 15)
		roleStat = "MC";
	else if (role < 20)
		roleStat = "AMC";
	else roleStat = "ST";
	
	var weightRole = allPosition[roleStat];
	Object.keys(weightRole).map(function (key) {
		var mul = ["t1", "t2", "t3", "t4", "t5", "t6"].indexOf(key) + 1;
		
		var stats = weightRole[key];
		for (var i in stats)
			statData[stats[i]] += (100 * mul + (Math.sqrt(Math.random()) * 50 * mul)) * quality / 28;
	});

	config.allStat.forEach(function (stat) {
		statData[stat] = Math.floor(statData[stat]);
	});

	return statData;
}

var charaData = {
	"IDID": "",
	"footballPlayer": {},
	"Negotiation": {},
	"profile": { },
	"parameter": {
		"condition": 80,
		"morale": 80,
		"injury": 0,
	}
};
