
module.exports = function (event, context, dynamo) {

	if (!event.UID) {
		context.fail("Need UID for select squad");
		return;
	}

	dynamo.update({
		TableName: "PlayerData",
		Key: { "IDID": event.UID },
		ConditionExpression: "OwnerID = :o AND #m = :m",
		UpdateExpression: "SET #m = :n , #t = :t , Price = :p , BidPrice = :bp , Bidder = :b",
		ExpressionAttributeNames: {
			"#m": "Mode",
			"#t": "TimeStamp"
		},
		ExpressionAttributeValues: {
			":o": context.identity.cognitoIdentityId,
			":t": new Date().getTime(),
			":m": "Player",
			":n": "Auction",
			":p": 800000,
			":bp": 800000 / 10,
			":b": {}
		},
	}, function (err, data) {
		if (err)
			return context.fail(err);
		if (data.errorType)
			return context.fail(data);
		context.succeed(data);
	});
};