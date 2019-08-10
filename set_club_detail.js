	
module.exports = function (event, context, dynamo) {
	dynamo.update({
		TableName: "PlayerData",
		Key: { "IDID": context.identity.cognitoIdentityId },
		UpdateExpression: 'set #a = :v',
		ExpressionAttributeNames: { '#a': 'club' },
		ExpressionAttributeValues: { ':v': event.club }
	}, context.done);
}