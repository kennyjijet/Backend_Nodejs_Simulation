
module.exports = function (event, context, dynamo) {
    console.log(event.identityId);
    
    dynamo.get({
        TableName: 'PlayerData',
        Key: { "IDID": context.identity.cognitoIdentityId }
    }, function (err, data) {
        console.log(err);
        if (err) {
			context.fail(err);
			return;
        }

        if (!data && !data.Item) {
			context.fail("Connot find user IDID : " + context.identity.cognitoIdentityId);
			return;
        }

		trainSquad();
		
		dynamo.update({
			TableName: "PlayerData",
			Key: { "IDID" : context.identity.cognitoIdentityId },
			UpdateExpression: 'set #a = :v',
			ExpressionAttributeNames: { '#a': 'squad' },
			ExpressionAttributeValues: { ':v': data.Item.squad },
            ReturnValues: "UPDATED_NEW"
		}, function (err, data) {
			console.log(err);
			if (err) {
				context.fail(err);
				return;
			}
			
			if (!data || !data.Attributes || !data.Attributes.squad || !data.Attributes.squad.mySquad) {
				context.fail("No squad data");
				return;
			}
			
			var squad = data.Attributes.squad.mySquad;
			squad = squad.filter(function (item) { return event.trainee_squad_uid_list.indexOf(item.squadUid) >= 0;  });
			
			context.succeed(squad);
		});
	});
}

function trainSquad(event, player_data) {
	var attributeAdditive = 0;
	var conditionReduction = 0;
	var conditionReductionValue = 0;
	var attributeAdditiveLevel = 0;
	var attributeAdditiveBoost = 0;
	var injury = 10;
	var injuryPercentage = 0;
	var levelCoach = 0;
	var attributeAdditiveCoach = 0;
	var boost = false;
	for (var Index = 0; Index < event.coach.skillList.length; Index++) {
		if (event.training_program === event.coach.skillList[Index].boostProgram) {
			boost = true;
			levelCoach = event.coach.skillList[Index].level;
		}
	}

	if (event.training_level === 0) {
		conditionReduction = 10;
		attributeAdditiveLevel = 1;
		conditionReductionValue = 0.5;
	}

	else if (event.training_level === 1) {
		conditionReduction = 20;
		attributeAdditiveLevel = 2;
		conditionReductionValue = 1;
	}
	else if (event.training_level === 2) {
		conditionReduction = 30;
		attributeAdditiveLevel = 3;
		conditionReductionValue = 1.5;
	}
	if (boost === true) {
		attributeAdditive = attributeAdditiveLevel + (attributeAdditiveLevel * levelCoach);
	} else {
		attributeAdditive = attributeAdditiveLevel;
	}
	var listAdditiveStatus = [];
	/////Add random
	var listAdditiveIdex = 0;
	//var maxAttributeList = event.training_attr_list.length * attributeAdditive;
	for (var attributeIndex = 0; attributeIndex < attributeAdditive; attributeIndex++) {
		for (var trainAttrIndex = 0; trainAttrIndex < event.training_attr_list.length; trainAttrIndex++) {
			listAdditiveStatus[listAdditiveIdex] = event.training_attr_list[trainAttrIndex];
			listAdditiveIdex++;
		}
	}
	//context.succeed(listAdditiveStatus);
	var conditionTemp = 0;

	event.trainee_squad_uid_list.array.forEach(function (trainee) {
		player_data.squad.mySquad.forEach(function (squad) {

			if (trainee !== squad.squadUid)
				return;

			conditionTemp = conditionReduction;
			if (squad.footballPlayer.age > 30)
				conditionTemp += squad.footballPlayer.age * conditionReductionValue;

			if (squad.condition > conditionTemp) {
				squad.condition -= conditionTemp;
				if (squad.condition < 50) {
					var randomInjury = Math.ceil(Math.random() * (100 - 1) + 1);
					if (randomInjury <= 30) {
						squad.injury -= 5;
					}
				}

				for (var trainIndex = 0; trainIndex < attributeAdditive; trainIndex++) {
					var randomAdditive = Math.floor(Math.random() * (listAdditiveStatus.length));
					squad.footballPlayer[listAdditiveStatus[randomAdditive]] += 1;
				}
			}
		}, this);
	}, this);
}