
module.exports = function (event, context, dynamo) {

    dynamo.get({
        "TableName": "SoccerSimulationGameTable",
        "Key": {
			"name" : "game_info_data",
			"versions": "1.1"
		}
    }, function (err, data) {
		if (err)
			return context.fail(err);

        var gameInfo = JSON.parse(data.Item.data);

        dynamo.get({
            "TableName": "PlayerData",
            "Key": { "IDID": context.identity.cognitoIdentityId }
        }, function (err, data) {
            if (err)
                return context.fail(err);

            if (!(data.Item && data.Item.grounds))
                return context.fail("No data in Clubs");

            console.log('Get Data');

            var isChangeData = false;
            if (event.ItemType == "GroundUnit") {
                if (!data.Item || !data.Item.grounds)
                    return context.fail("grounds object not available");

                var unit = data.Item.grounds[event.ItemID];
                if (!unit) {
					context.fail("No " + event.ItemID + " in " + event.ItemType);
					return;
                }
                
                // To second
                var now = new Date().getTime() / 1000;
                if (unit.isUpgrade || unit.isUpgrade === 0) {
                    delete unit.isUpgrade;
                    isChangeData = true;
                }

                if (!unit.level) {
                    unit.level = 1;
                    isChangeData = true;
                }

                var level = unit.level - 1;

                if (unit.upgradeFinishedTimestamp <= 0) {
                    delete unit.upgradeFinishedTimestamp;
                    isChangeData = true;
                }

                if (unit.upgradeFinishedTimestamp > now) {
                    var span = unit.upgradeFinishedTimestamp - now;
                    var sec = Math.floor(span % 60);
                    span /= 60;
                    var min = Math.floor(span % 60);
                    span /= 60;
                    var hour = Math.floor(span);

                    context.fail(event.ItemType + " " + event.ItemID + " currently upgraded. Time left " + hour + " : " + min + " : " + sec);
                    return;
                }

                if (unit.upgradeFinishedTimestamp < now) {
                    if (event.Action != "Finish")
						return context.fail(event.ItemType + " " + event.ItemID + " need to finish upgraded before able to used");

					if (level >= 5)
						return context.fail(event.ItemType + " " + event.ItemID + " fully upgraded");

					console.log("upgrade " + unit.unitID);

					delete unit.upgradeFinishedTimestamp;
					unit.lastCollectProductTimestamp = now;
					unit.level++;

					isChangeData = true;
				}
			}

			if (event.Action == "Upgrade") {
				if (level >= 5)
					return context.fail(event.ItemType + " " + event.ItemID + " fully upgraded");

				var unitInfo = gameInfo.game_info.all_grounds_unit_info_data[event.ItemID];
				if (!unitInfo || !unitInfo.upgradePrice || !unitInfo.upgradeTime)
					return context.fail(event.ItemType + " " + event.ItemID + " has no upgrade info");

				if (data.Item.currencies.money < unitInfo.upgradePrice[level])
					return context.fail("Not enough money to upgrade");

				data.Item.currencies.money -= unitInfo.upgradePrice[level];
				unit.upgradeFinishedTimestamp = now + unitInfo.upgradeTime[level];
				delete unit.lastCollectProductTimestamp;

				isChangeData = true;
			}

			if (event.Action == "Collect") {
				if (!unitInfo.productTime || !unitInfo.productValue)
					return context.fail(event.ItemType + " " + event.ItemID + " don't create product");

				if (!unit.lastCollectProductTimestamp)
					unit.lastCollectProductTimestamp = now;

				var time = now - unit.lastCollectProductTimestamp;
				var prod = time * unitInfo.productValue[level] / unitInfo.productTime[level];

				prod = prod - (prod % unitInfo.productValue[level]);

				var max = unitInfo.productValue[level];
				if (prod > max)
					prod = max;

				if (prod > 0) {
					unit.lastCollectProductTimestamp = now;
					if (unit.unitID == "trainingCenter")
						data.Item.currencies.rest += prod;
					if (unit.unitID == "medicalCenter")
						data.Item.currencies.treatment += prod;
					if (unit.unitID == "youthCenter")
						context.fail("Not implemented");
				}

				isChangeData = true;
			}

            if (!isChangeData)
                return context.succeed("no change");

			dynamo.update({
				TableName: "PlayerData",
				Key: { "IDID": context.identity.cognitoIdentityId },
                ReturnValues: "UPDATED_NEW",
				UpdateExpression: 'set #a1 = :v1 , #a2 = :v2',
				ExpressionAttributeNames: { '#a1': 'grounds', '#a2': 'currencies' },
				ExpressionAttributeValues: { ':v1': data.Item.grounds, ':v2': data.Item.currencies }
			}, function (err, data) {
                if (err)
                    return context.fail(err);

                context.succeed(data.Attributes);
            });
        });
    });
};