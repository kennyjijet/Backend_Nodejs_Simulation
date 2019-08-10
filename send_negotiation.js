
module.exports = function (event, context, dynamo) {

	if (!event.UID)
		return context.succeed({
				"errorCode": 0,
				"errorMessage": "Need UID for select item"
			});

	if (!(event.Scale >= 0 && event.Scale <= 104))
		return context.succeed({
				"errorCode": 1,
				"errorMessage": "Need Scale 0 - 104 for calculate price"
			});

	dynamo.get({
		"TableName": "PlayerData",
		Key: { "IDID": event.UID },
	}, function (err, data) {
		if (err)
			return context.fail(err);

		if (!data.Item || !data.Item.OwnerID)
			return context.succeed({
				"errorCode": 2,
				"errorMessage": "Cannot get item " + event.UID
			});
			
		if (data.Item.OwnerID == context.identity.cognitoIdentityId)
			return context.succeed({
				"errorCode": 3,
				"errorMessage": "Cannot send negotiation to owned item"
			});
			
		if (data.Item.Mode != "Player")
			return context.succeed({
				"errorCode": 4,
				"errorMessage": "Cannot send negotiation to item with non Player mode"
			});

		//Calculate price from item
		var price = 800000;

		var token = 4 + (2 * Math.floor(event.Scale / 5));
		var cost = price * (1 + (0.01 * event.Scale));
		var now = new Date().getTime();

		dynamo.update({
			"TableName": "PlayerData",
			Key: { "IDID": context.identity.cognitoIdentityId },
			ConditionExpression: "currencies.money >= :cm AND currencies.#t >= :ct AND attribute_not_exists(Follow.#u)",
			UpdateExpression: "SET Follow.#u = :u,currencies.#t = currencies.#t - :ct,currencies.money = currencies.money - :cm",
			ExpressionAttributeNames: {
				"#u": event.UID,
				"#t": "token"
			},
			ExpressionAttributeValues: {
				":ct": token,
				":cm": cost,
				":u": {
					time: now,
					money: cost,
					token: token
				}
			}
		}, function (err, data) {
			if (err)
				return context.fail(err);

			dynamo.update({
				"TableName": "PlayerData",
				Key: { "IDID": event.UID },
				ReturnValues: "ALL_NEW",
				UpdateExpression: "SET Negotiation.#o = :n",
				ExpressionAttributeNames: { "#o": context.identity.cognitoIdentityId },
				ExpressionAttributeValues: {
					":n": {
						time: now,
						money: cost,
						token: Math.ceil((token - 4) / 2)
					}
				}
			}, function (err, data) {
				if (err)
					return context.fail(err);

				context.succeed(data.Attributes);
			});
		});
	});
};