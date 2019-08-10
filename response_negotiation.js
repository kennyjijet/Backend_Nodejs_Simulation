
module.exports = function (event, context, dynamo) {

	if (!event.UID)
		return context.fail("Need UID for select item");

	if (!event.Target)
		return context.fail("Need another player ID for select item");

	if (!event.Accept) {
		dynamo.update({
			"TableName": "PlayerData",
			Key: { "IDID": event.UID },
			ConditionExpression: "OwnerID = :o",
			UpdateExpression: "REMOVE Negotiation.#o",
			ExpressionAttributeNames: { "#o": event.Target },
			ExpressionAttributeValues: { ":o": context.identity.cognitoIdentityId }
		}, function (err, data) {
			if (err)
				return context.fail(err);

			dynamo.update({
				"TableName": "PlayerData",
				Key: { "IDID": event.Target },
				UpdateExpression: "REMOVE Follow.#u",
				ExpressionAttributeNames: { "#u": event.Target }
			}, function (err, data) {
				if (err)
					return context.fail(err);

				context.succeed(data);
			});
		});

		return;
	}

	var now = new Date().getTime();
	var yesterday = now - (24 * 60 * 60 * 1000);

	dynamo.update({
		"TableName": "PlayerData",
		Key: { "IDID": event.UID },
		ReturnValues: "UPDATED_OLD",
		ConditionExpression: "OwnerID = :o AND Negotiation.#o.#t > :t AND #m = :m",
		UpdateExpression: "SET OwnerID = :n , Negotiation = :e",
		ExpressionAttributeNames: {
			"#o": event.Target,
			"#m": "Mode",
			"#t": "time",
		},
		ExpressionAttributeValues: {
			":o": context.identity.cognitoIdentityId,
			":n": event.Target,
			":t": yesterday,
			":m": "Player",
			":e": {}
		}
	}, function (err, data) {
		if (err)
			return context.fail(err);

		var receive = data.Attributes.Negotiation[event.Target];
		dynamo.update({
			"TableName": "PlayerData",
			Key: { "IDID": context.identity.cognitoIdentityId },
			UpdateExpression: "SET currencies.#t = currencies.#t + :ct,currencies.money = currencies.money + :cm",
			ExpressionAttributeNames: {
				"#t": "token",
			},
			ExpressionAttributeValues: {
				":ct": receive.token,
				":cm": receive.money
			}
		}, function (err, data) {
			if (err)
				return context.fail(err);

			context.succeed(data);
		});
	});
};