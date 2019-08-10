
module.exports = function (event, context, dynamo) {
	dynamo.get({
		"TableName": "Simulation",
		Key: { "access_token": "xxxxxx" },
		AttributesToGet: ["sequence"]
	}, function (err, data) {
		if (err)
			return context.fail(err);

		var sequence = covertRealTimeToSequence(event.timestamp);

		console.log(sequence);

		var nextTimeStamp = "nextEventTimestamp_" + sequence;

		var sequenceData = {
			"live_match_data": {
				"eventList": [],
				"nextEventTimestamp": data.Item["sequence"][nextTimeStamp],
			}
		};

		sequenceData.live_match_data.eventList = sequenceGenerator(data.Item["sequence"][sequence]);
		context.succeed(sequenceData);
	});
};

function covertRealTimeToSequence(timeStampFromClient) { 
	
	var afterHalf = timeStampFromClient >= 480;
	if (afterHalf)
		timeStampFromClient -= 480;

	if (timeStampFromClient >= 300)
		return afterHalf ? null : "sequence11";

	var seq = 1 + Math.floor(timeStampFromClient / 30);
	if (afterHalf)
		seq += 11;

	return "sequence" + seq;
}


////////////////////////////////////////////////////////////////

//// get important events  
function sequenceGenerator(sequence) {

	var statNames = ["pass", "teamTeamwork", "teamAttack", "teamDefence", "score", "ballWinning",
		"teamORT", "possesion", "shotsInGoals", "touches", "longPass", "shortPass"];

	var eventNames = ["indexBallPositionX", "indexBallPositionY", "eventTimestamp", "eventAction",
		"inGameMinute", "isHomeTeam", "mainPlayerName", "subPlayerName"];

	return sequence.map(function (seq, index) {

		var event = {};
		eventNames.forEach(function (name, index) {
			event[name] = seq[index];
		});

		var seqHome = seq[8];
		var seqAway = seq[9];

		event.statsHome = {};
		event.statsAway = {};
		statNames.forEach(function (name, i) {
			event.statsHome[name] = seqHome[i];
			event.statsAway[name] = seqAway[i];
		});

		return event;
	});
}