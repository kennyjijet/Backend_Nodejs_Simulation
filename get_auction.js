var sec = 1000;
var min = sec * 60;
var hour = min * 60;

var r0Time = 5 * hour;
var r1Time = r0Time + (3 * min);
var r2Time = r1Time + (1 * min);
var rXTime = 30 * sec;

module.exports = function (event, context, dynamo) {

	if (!event.UID)
		return context.fail("Need UID for select item");

	dynamo.get({
		"TableName": "PlayerData",
		Key: { "IDID": event.UID }
	}, function (err, data) {
		if (err)
			return context.fail(err);

		var item = data.Item;
		if (item.Mode != "Auction" || !(item.Price > 0))
			return context.fail("This item is not on Auction");

		var idid = context.identity.cognitoIdentityId;
		
		var bidders = Object.keys(item.Bidder);
		if (idid == item.OwnerID)
		{
			if (bidders.length > 0 || item.TimeStamp > now - r0Time)
				return context.fail("You cannot get your own item");
			
			return dynamo.update({
				"TableName": "PlayerData",
				Key: { "IDID": event.UID },
				ReturnValues: "ALL_NEW",
				UpdateExpression: "SET #m = :m , Bidder = :e REMOVE #t",
				ExpressionAttributeNames: {
					"#m": "Mode",
					"#t": "TimeStamp"
				},
				ExpressionAttributeValues: {
					":m": "Player",
					":e": {}
				}
			}, context.done);
		}

		var bidder = bidders.map(function (k) {
			return { key: k, value: item.Bidder[k].TimeStamp };
		}).reduce(function (prev, current) {
			return prev.value > current.value ? prev : current;
		});
		
		console.log("bidder : " + bidder);
		if (bidder.key != idid)
			return context.fail("You don't own this item","ConditionalCheckFailedException");

		var now = new Date().getTime();
		if (item.TimeStamp + r0Time > now)
			return context.fail("Auction not finished","ConditionalCheckFailedException");

		if (item.TimeStamp + r1Time > now) {
			var r1Count = bidders.filter(function (key) {
				return item.Bidder[key].TimeStamp > item.TimeStamp;
			}).length;

			if (r1Count > 1)
				return context.fail("Auction not finished", "ConditionalCheckFailedException");
		}

		if (item.TimeStamp + r2Time > now) {
			var r2Count = bidders.filter(function (key) {
				return item.Bidder[key].TimeStamp > item.TimeStamp + r0Time;
			}).length;

			if (r2Count > 1)
				return context.fail("Auction not finished", "ConditionalCheckFailedException");
		}

		if (item.TimeStamp + r2Time <= now && bidder.value + rXTime > now)
			return context.fail("Auction not finished", "ConditionalCheckFailedException");

		dynamo.update({
			"TableName": "PlayerData",
			Key: { "IDID": item.OwnerID },
			UpdateExpression: "ADD currencies.money :m",
			ExpressionAttributeValues: { ":m": item.Price }
		}, function (err, data) {
			if (err)
				return context.fail(err);

			dynamo.update({
				"TableName": "PlayerData",
				Key: { "IDID": event.UID },
				UpdateExpression: "SET OwnerID = :o , #m = :m , Bidder = :e REMOVE #t",
				ExpressionAttributeNames: {
					"#m": "Mode",
					"#t": "TimeStamp"
				},
				ExpressionAttributeValues: {
					":m": "Player",
					":o": idid,
					":e": {}
				}
			}, function (err, data) {
				if (err)
					return context.fail(err);

				dynamo.update({
					"TableName": "PlayerData",
					Key: { "IDID": idid },
					UpdateExpression: "SET currencies.money = currencies.money - :m REMOVE Follow.#u",
					ExpressionAttributeNames: { "#u": event.UID },
					ExpressionAttributeValues: { ":m": item.Price }
				}, function (err, data) {
					if (err)
						return context.fail(err);

					context.succeed(item);
				});
			});
		});
	});
};