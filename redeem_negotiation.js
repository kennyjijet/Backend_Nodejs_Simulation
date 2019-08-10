
module.exports = function (event, context, dynamo) {

	if (!event.UID)
		return context.fail("Need UID for select item");

	var now = new Date().getTime();
	var yesterday = now - (24 * 60 * 60 * 1000);

	var IDID = context.identity.cognitoIdentityId;
	dynamo.batchGet({
		RequestItems: {
			"PlayerData": {
				Keys: [
					{ "IDID": event.UID },
					{ "IDID": IDID }
				]
			}
		}
	}, function (err, data) {
		if (err)
			return context.fail(err);

		var playerData = data.Responses.PlayerData;
		if (!playerData || playerData.length < 2)
			return context.fail("Error from batch get player and item");

		var item = playerData.filter(function (value) { return value.IDID == event.UID; }).shift();
		if (!item || !item.OwnerID)
			return context.fail("Cannot find item " + event.UID);

		if (item.OwnerID == IDID) {
			return dynamo.update({
				"TableName": "PlayerData",
				Key: { "IDID": IDID },
				ReturnValues: "UPDATED_NEW",
				UpdateExpression: "REMOVE Follow.#u",
				ExpressionAttributeNames: { "#u": event.UID },
			}, function (err, data) {
				if (err)
					return context.fail(err);

				context.succeed(item);
			});
		}

		if (!item.Negotiation || (item.Negotiation[IDID] && item.Negotiation[IDID].time > yesterday))
			return context.succeed("Cannot Redeem");

		var player = playerData.filter(function (value) { return value.IDID == IDID; }).shift();
		if (!player || !player.Follow[event.UID])
			return context.fail("Cannot get player to redeem");

		dynamo.update({
			"TableName": "PlayerData",
			Key: { "IDID": IDID },
			ReturnValues: "UPDATED_NEW",
			UpdateExpression: "SET currencies.#t = currencies.#t + :ct,currencies.money = currencies.money + :cm REMOVE Follow.#u",
			ExpressionAttributeNames: {
				"#u": event.UID,
				"#t": "token"
			},
			ExpressionAttributeValues: {
				":ct": player.Follow[event.UID].token,
				":cm": player.Follow[event.UID].money,
			}
		}, function (err, data) {
			if (err)
				return context.fail(err);

			context.succeed(data);
		});
	});
};