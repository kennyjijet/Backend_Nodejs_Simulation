	
module.exports = function (event, context, dynamo) {

	dynamo.update({
		TableName: "PlayerData",
		Key: { "IDID": context.identity.cognitoIdentityId },
		UpdateExpression: 'set #a = :v',
		ExpressionAttributeNames: { '#a': 'tactic' },
		ExpressionAttributeValues: { ':v': event.tactic }
	}, context.done);
};