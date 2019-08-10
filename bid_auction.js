var sec = 1000;
var min = sec * 60;
var hour = min * 60;

var rXTime = 30 * sec;
var r0Time = 5 * hour;
var r1Time = r0Time + (3 * min);
var r2Time = r1Time + (1 * min);

module.exports = function (event, context, dynamo) {

	if (!event.UID)
		return context.fail("Need UID for select character");

	if (!event.CurrentPrice)
		return context.fail("Need CurrentPrice for checking");

	var idid = context.identity.cognitoIdentityId;
	dynamo.batchGet({
		RequestItems: {
			"PlayerData": {
				Keys: [
					{ "IDID": idid },
					{ "IDID": event.UID }
				]
			}
		}
	}, function (err, data) {
		if (err)
			return context.fail(err);

		if (!data.Responses || !data.Responses.PlayerData || data.Responses.PlayerData.length < 2)
			return context.fail("Cannot get PlayerData or ItemData");

		var player = data.Responses.PlayerData.filter(function (data) { return data.IDID == idid; })[0];
		if (!player.currencies)
			return context.fail("Cannot get PlayerData");
		var item = data.Responses.PlayerData.filter(function (data) { return data.IDID == event.UID; })[0];
		if (!item.OwnerID || item.Mode != "Auction")
			return context.fail("Cannot get ItemData for Auction");

		if (player.currencies.token < 1)
			return context.fail("Need 1 token to place bid");

		if (!player.currencies.money)
			player.currencies.money = 0;

		if (idid == item.OwnerID)
			return context.fail("Cannot bid your own item", "ConditionalCheckFailedException");

		if (item.Price != event.CurrentPrice)
			return context.fail("Price out of sync : " + item.Price + " != " + event.CurrentPrice, "ConditionalCheckFailedException");

		var now = new Date().getTime();
		if (!item.TimeStamp || item.TimeStamp > now)
			return context.fail("Fail TimeStamp logic", "ConditionalCheckFailedException");

		if (item.TimeStamp < now - r0Time) {
			if (!item.Bidder || !item.Bidder[idid] || item.Bidder[idid].TimeStamp < item.TimeStamp)
				return context.fail("You have no permission to bid this item after initial round", "ConditionalCheckFailedException");
		}
		else if (player.currencies.money < item.Price)
			return context.fail("Not enough money for initial bidding", "ConditionalCheckFailedException");

		if (item.TimeStamp < now - r1Time) {
			if (!(item.Bidder[idid].TimeStamp > item.TimeStamp + r0Time))
				return context.fail("You have no permission to bid this item after round 1", "ConditionalCheckFailedException");
		}

		if (item.TimeStamp < now - r2Time) {
			if (item.Bidder[idid].TimeStamp < item.TimeStamp + r1Time)
				return context.fail("You have no permission to bid this item after round 2", "ConditionalCheckFailedException");


			var lastBid = Object.keys(item.Bidder).map(function (key) {
				return item.Bidder[key].TimeStamp;
			}).reduce(function (prev, current, index, array) {
				return prev > current ? prev : current;
			}, 0);

			if (lastBid + rXTime < now)
				return context.fail("You have no permission to bid item that has winner", "ConditionalCheckFailedException");
		}

		dynamo.update({
			TableName: "PlayerData",
			Key: { "IDID": event.UID },
			ReturnValues: "ALL_NEW",
			ConditionExpression: "OwnerID <> :o AND #m = :m AND Price = :p0",
			UpdateExpression: "SET Bidder.#o = :t , Price = :p1",
			ExpressionAttributeNames: {
				"#o": idid,
				"#m": "Mode",
			},
			ExpressionAttributeValues: {
				":o": idid,
				":m": "Auction",
				":p0": event.CurrentPrice,
				":p1": Math.floor((item.Price + item.BidPrice) / 1000) * 1000,
				":t": {
					TimeStamp: now,
					Bidding: event.CurrentPrice,
					Name: player.manager.Name ? player.manager.Name : null,
					Avatar: player.manager.Avatar ? player.manager.Avatar : null,
				}
			},
		}, function (err, data) {
			if (err)
				return context.fail(err);
				
			var res = data.Attributes;

			if (!player.Follow)
				player.Follow = {};

			player.Follow[event.UID] = now;
			dynamo.update({
				TableName: "PlayerData",
				Key: { "IDID": idid },
				UpdateExpression: "SET currencies.#t = currencies.#t - :t , Follow = :i",
				ExpressionAttributeNames: { "#t": "token" },
				ExpressionAttributeValues: {
					":i": player.Follow,
					":t": 1,
				},
			}, function (err, data) {
				if (err)
					return context.fail(err);
					
				context.succeed(res);
			});
		});
	});
};