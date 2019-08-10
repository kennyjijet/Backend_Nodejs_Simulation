
module.exports = function (event, context, dynamo) {

	if (!event.UID)
		return context.fail("Need UID to get scout");

	dynamo.get({
		TableName: "PlayerData",
		Key: { IDID: event.UID },
	}, function (err, data) {
		if (err)
			return context.fail(err);

		var item = data.Item;
		if (!(item && item.Price > 0))
			return context.fail("Cannot find item scout " + event.UID);
			
		if (item.Mode.indexOf("Scout") != 0)
			return context.fail("Cannot get non scout item " + event.UID);

		dynamo.update({
			TableName: "PlayerData",
			Key: { IDID: context.identity.cognitoIdentityId },
			ConditionExpression: "currencies.#t >= :t AND attribute_not_exists(PendingItem)",
			UpdateExpression: "SET currencies.#t = currencies.#t - :t , PendingItem = :i",
			ExpressionAttributeNames: { "#t": "token" },
			ExpressionAttributeValues: {
				":t": item.Price,
				":i": item,
			}
		}, function (err, data) {
			if (err)
				return context.fail(err);

			dynamo.update({
				TableName: "PlayerData",
				Key: { IDID: event.UID },
				ReturnValues: "ALL_NEW",
				ConditionExpression: "#m = :m",
				UpdateExpression: "SET #m = :n , OwnerID = :o REMOVE Price",
				ExpressionAttributeNames: { "#m": "Mode" },
				ExpressionAttributeValues: {
					":m": item.Mode,
					":n": "Player",
					":o": context.identity.cognitoIdentityId,
				}
			}, function (err, data) {
				if (err)
					return context.fail(err);

				item = data.Attributes;
				dynamo.update({
					TableName: "PlayerData",
					Key: { IDID: context.identity.cognitoIdentityId },
					UpdateExpression: "REMOVE PendingItem"
				}, function (err, data) {
					context.done(err,item);
				});
			});
		});
	});
};