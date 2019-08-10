	
module.exports = function (event, context, dynamo) {

	dynamo.update({
		TableName: "PlayerData",
		Key: { "IDID": context.identity.cognitoIdentityId },
		UpdateExpression: 'set #a = :v',
		ExpressionAttributeNames: { '#a': 'squad' },
		ExpressionAttributeValues: { ':v': event.squad }
	}, context.done);
}