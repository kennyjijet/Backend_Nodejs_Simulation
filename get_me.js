function ClearEmpty(obj) {
    for (var key in obj) {
        if (obj[key] instanceof Object)
            ClearEmpty(obj[key]);
        else if (obj[key] === "" || (!obj[key] && obj[key] !== 0))
            delete obj[key];
    }

    return obj;
}

var config = require("./config");

module.exports = function (event, context, dynamo) {

	dynamo.get({
		"TableName": "PlayerData",
		Key: { "IDID": context.identity.cognitoIdentityId }
	}, function (err, data) {
		if (err)
			return context.fail(err);

		if (data && data.Item && data.Item.IDID == context.identity.cognitoIdentityId)
			return context.succeed(data.Item);

		var json = ClearEmpty(initialData);
		json.IDID = context.identity.cognitoIdentityId;
		json.Mode = "Season:" + (config.season - 1);
		dynamo.query({
			TableName: "PlayerData",
			IndexName: "RankIndex",
			Limit: 1,
			ScanIndexForward: false,
			KeyConditionExpression: '#m = :m',
			ExpressionAttributeNames: { '#m': 'Mode' },
			ExpressionAttributeValues: { ':m': json.Mode }
		}, function (err, data) {
			if (err)
				return context.fail(err);

			json.Rank = 1;
			if (data.Items && data.Items.length > 0 && data.Items[0].Rank > 0)
				json.Rank = data.Items[0].Rank + 1;

			dynamo.put({
				TableName: "PlayerData",
				Item: json
			}, function (err, data) {
				if (err)
					return context.fail(err);

				context.succeed(json);
			});
		});
	});
};

var initialData = {
	"IDID": "",
	"Follow": {},
	"TimeStamp":-1,
	"finances": {
		"sponsorList": [],
		"endSponsorContractTimestamp": 0,
		"todayFinancesDetaildata": {
			"sponsorship": 250000,
			"investment": 0,
			"winBonuses": 55000,
			"transfersIn": 0,
			"ticketSales": 2800000,
			"playerWages": 550000,
			"merchandise": 0,
			"constrction": 18400,
			"competitionPrizes": 18300,
			"transfersOut": 0
		},
		"seasonFinancesDetaildata": {
			"sponsorship": 250000,
			"investment": 0,
			"winBonuses": 55000,
			"transfersIn": 0,
			"ticketSales": 2800000,
			"playerWages": 550000,
			"merchandise": 0,
			"constrction": 18400,
			"competitionPrizes": 18300,
			"transfersOut": 0
		},
		"allTicketAndWinbonus": {
			"friendly_ticket": {
				"ticketPrice": 3,
				"winBonusReward": 0
			},
			"cup_ticket": {
				"ticketPrice": 3,
				"winBonusReward": 0
			},
			"league_ticket": {
				"ticketPrice": 3,
				"winBonusReward": 0
			},
			"champion_league_ticket": {
				"ticketPrice": 3,
				"winBonusReward": 0
			}
		},
		"contratedTVId": "",
		"endTVContractTimestamp": 0,
		"contratedSponsorId": "",
		"tvList": [
			{
				"sponsorID": "tv_00",
				"value": 7,
				"sponsorType": "STABLE INCOME",
				"sponsorDescription": "get 1 token daily,no matter what!"
			},
			{
				"sponsorID": "tv_01",
				"value": 7,
				"sponsorType": "EXTRA FOR DEDICATION",
				"sponsorDescription": "come back every day to earn extra."
			},
			{
				"sponsorID": "tv_02",
				"value": 7,
				"sponsorType": "WIN YOUR TOKENS",
				"sponsorDescription": "Defeat your league opponents to get more tokens!"
			},
			{
				"sponsorID": "tv_03",
				"value": 14,
				"sponsorType": "QUICK BUCK",
				"sponsorDescription": "Receive tokens upfront,investthem in the right way."
			}
		]
	},
	"trainingFields": [
		{
			"coach": {
				"skillList": [
					{
						"level": 2,
						"boostProgram": "ball_control_program"
					},
					{
						"level": 3,
						"boostProgram": "speed_program"
					}
				],
				"avatarData": {
					"beardShapId": "001",
					"hairShapId": "001",
					"hairColorId": "000000FF",
					"mouthColorId": "000000FF",
					"mouthShapId": "001",
					"eyeShapId": "001",
					"eyeColorId": "000000FF",
					"faceColorId": "",
					"characterId": "",
					"faceShapId": "001",
					"beardColorId": "000000FF"
				},
				"name": "BOBO WAKAWAKA",
				"age": 24
			},
			"trainingLevel": 0,
			"program": "ball_control_program"
		},
		{
			"coach": {
				"skillList": [
					{
						"level": 1,
						"boostProgram": "ball_control_program"
					}
				],
				"avatarData": {
					"beardShapId": "001",
					"hairShapId": "001",
					"hairColorId": "000000FF",
					"mouthColorId": "000000FF",
					"mouthShapId": "001",
					"eyeShapId": "001",
					"eyeColorId": "000000FF",
					"faceColorId": "",
					"characterId": "",
					"faceShapId": "001",
					"beardColorId": "000000FF"
				},
				"name": "BOBO WAKAWAKA",
				"age": 24
			},
			"trainingLevel": 0,
			"program": "ball_control_program"
		}
	],
	"inventory": {
		"emblemList": [
			{
				"shapeId": "000",
				"patternColor2Id": "FFFFFFFF",
				"officialId": "",
				"patternId": "000",
				"symbolId": "000",
				"patternColor1Id": "0000FFFF",
				"symbolColorId": "FF0000FF"
			},
			{
				"shapeId": "000",
				"patternColor2Id": "FFFFFFFF",
				"officialId": "",
				"patternId": "000",
				"symbolId": "000",
				"patternColor1Id": "11F59A",
				"symbolColorId": "FF0000FF"
			},
			{
				"shapeId": "000",
				"patternColor2Id": "FF0AA1",
				"officialId": "",
				"patternId": "000",
				"symbolId": "000",
				"patternColor1Id": "0000FFFF",
				"symbolColorId": "FF0000FF"
			}
		],
		"jerseyList": [
			{
				"patternColor1Id": "11F59A",
				"patternColor2Id": "FFFFFFFF",
				"officialId": "",
				"patternId": "000"
			},
			{
				"patternColor1Id": "0000FFFF",
				"patternColor2Id": "FFFFFFFF",
				"officialId": "",
				"patternId": "001"
			},
			{
				"patternColor1Id": "11F59A",
				"patternColor2Id": "FF0000FF",
				"officialId": "",
				"patternId": "000"
			},
			{
				"patternColor1Id": "0000FFFF",
				"patternColor2Id": "FF0000FF",
				"officialId": "",
				"patternId": "001"
			},
			{
				"patternColor1Id": "FF0000FF",
				"patternColor2Id": "FFFFFFFF",
				"officialId": "",
				"patternId": "000"
			}
		]
	},
	"grounds": {
		"playerRoom": {
			"level": 1,
			"lastCollectProductTimestamp": 0,
			"upgradeFinishedTimestamp": 0,
			"isUpgrade": 0
		},
		"trainingCenter": {
			"level": 1,
			"lastCollectProductTimestamp": 0,
			"upgradeFinishedTimestamp": 0,
			"isUpgrade": 0
		},
		"fitnessCenter": {
			"level": 1,
			"lastCollectProductTimestamp": 0,
			"upgradeFinishedTimestamp": 0,
			"isUpgrade": 0
		},
		"medicalCenter": {
			"level": 1,
			"lastCollectProductTimestamp": 0,
			"upgradeFinishedTimestamp": 0,
			"isUpgrade": 0
		},
		"utility": {
			"level": 1,
			"lastCollectProductTimestamp": 0,
			"upgradeFinishedTimestamp": 0,
			"isUpgrade": 0
		},
		"youthCenter": {
			"level": 1,
			"lastCollectProductTimestamp": 0,
			"upgradeFinishedTimestamp": 0,
			"isUpgrade": 0
		},
		"clubMuseum": {
			"level": 1,
			"lastCollectProductTimestamp": 0,
			"upgradeFinishedTimestamp": 0,
			"isUpgrade": 0
		},
		"stadium": {
			"level": 1,
			"lastCollectProductTimestamp": 0,
			"upgradeFinishedTimestamp": 0,
			"isUpgrade": 0
		}
	},
	"manager": {
		"managerNationality": "THA",
		"trophiesAllSeason": [
			{
				"leagueRanking": 1,
				"championLeagueLevel": -1,
				"championLeagueRound": "",
				"leagueRound": "",
				"leagueLevel": 1,
				"championLeagueRanking": -1,
				"cupRanking": -1,
				"cupLevel": 2,
				"cupRound": "Preliminary Stage"
			},
			{
				"leagueRanking": 2,
				"championLeagueLevel": 2,
				"championLeagueRound": "Top 16",
				"leagueRound": "",
				"leagueLevel": 2,
				"championLeagueRanking": -1,
				"cupRanking": 3,
				"cupLevel": 3,
				"cupRound": ""
			},
			{
				"leagueRanking": 3,
				"championLeagueLevel": 3,
				"championLeagueRound": "Top 16",
				"leagueRound": "",
				"leagueLevel": 3,
				"championLeagueRanking": -1,
				"cupRanking": -1,
				"cupLevel": 4,
				"cupRound": "Top 16"
			},
			{
				"leagueRanking": 7,
				"championLeagueLevel": 4,
				"championLeagueRound": "Group Stage",
				"leagueRound": "",
				"leagueLevel": 4,
				"championLeagueRanking": -1,
				"cupRanking": -1,
				"cupLevel": 6,
				"cupRound": "Quarter Final"
			},
			{
				"leagueRanking": 10,
				"championLeagueLevel": -1,
				"championLeagueRound": "",
				"leagueRound": "",
				"leagueLevel": 5,
				"championLeagueRanking": -1,
				"cupRanking": -1,
				"cupLevel": 7,
				"cupRound": "1/16 Finals"
			},
			{
				"leagueRanking": 11,
				"championLeagueLevel": -1,
				"championLeagueRound": "",
				"leagueRound": "11th place",
				"leagueLevel": 5,
				"championLeagueRanking": -1,
				"cupRanking": -1,
				"cupLevel": 6,
				"cupRound": "Preliminary Stage"
			}
		],
		"managerName": "TESTER",
		"managerAvatar": {
			"beardShapId": "001",
			"hairShapId": "001",
			"hairColorId": "000000FF",
			"mouthColorId": "000000FF",
			"mouthShapId": "001",
			"eyeShapId": "001",
			"eyeColorId": "000000FF",
			"faceColorId": "",
			"characterId": "",
			"faceShapId": "001",
			"beardColorId": "000000FF"
		},
		"careerStartedTimeStamp": 1438387200,
		"allAchievement": [
			{
				"id": "",
				"require_reset_progress": 0,
				"type": 0,
				"tier_count": 0
			}
		],
		"managerLevel": 5
	},
	"tactic": {
		"teamMentality": 2,
		"playOffsideTrap": 1,
		"pressingStyle": 0,
		"markingStyle": 0,
		"forceCounterattack": 0,
		"passingStyle": 1,
		"tacklingStyle": 1,
		"focusPassing": 0
	},
	"club": {
		"averagePoint": 9,
		"homeJersey": {
			"patternColor1Id": "FF0000FF",
			"patternColor2Id": "FFFFFFFF",
			"officialId": "",
			"patternId": "000"
		},
		"clubLevel": 5,
		"emblem": {
			"shapeId": "000",
			"patternColor2Id": "FFFFFFFF",
			"officialId": "",
			"patternId": "000",
			"symbolId": "000",
			"patternColor1Id": "0000FFFF",
			"symbolColorId": "FF0000FF"
		},
		"clubName": "KOMODO FC",
		"foundedTimestamp": 1446369600,
		"stadiumName": "KOMODO'S STADIUM",
		"awayJersey": {
			"patternColor1Id": "0000FFFF",
			"patternColor2Id": "FFFFFFFF",
			"officialId": "",
			"patternId": "001"
		},
		"fanClubName": "KOMODO FAN"
	},
	"currencies": {
		"money": 8340000,
		"rest": 50,
		"token": 120,
		"treatment": 120,
		"moral_booster": 35
	}
};