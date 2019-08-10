
var config = require("config.js");

module.exports = function (event, context, dynamo) {

	if (!event.UID)
		return context.fail("Need UID to select player","MissingArgument");

	if (!(event.number >= 1 && event.number < 100))
		return context.fail("Need to specify number", "RangeError");
		
	if (!(event.position >= -1 && event.position < 30))
		return context.fail("Need to specify position","RangeError");

	var idid = context.identity.cognitoIdentityId;
	dynamo.query({
		TableName: "PlayerData",
		IndexName: "OwnerID-index",
		Select:"SPECIFIC_ATTRIBUTES",
		ProjectionExpression:"IDID,#p",
		ExpressionAttributeNames: { "#p": "parameter" },
		KeyConditionExpression: "OwnerID = :h",
		ExpressionAttributeValues: { ":h": idid }
	}, function (err, data) {
		if (err)
			return context.fail(err);
		
		var current;
		var other = data.Items.filter(function (item) {
			if (item.IDID != event.UID)
				return true;
			
			current = item;
			return false;
		});
		
		if (other.filter(function (item) { return item.parameter && item.parameter.number === event.number; }).length > 0)
			return context.fail("Don't make duplicate number", "RangeError");
		
		if (event.position > -1 && other.filter(function (item) { return item.parameter && item.parameter.positionIndex === event.position; }).length > 0)
			return context.fail("Don't make duplicate position", "RangeError");
			
		var wage = current.parameter.seasonWage;
		if (!(wage > 0))
			wage = 100000;
		
		var contract = current.parameter.endContract;
		if (event.signContract) {
			contract = config.season + 3 - Math.floor(Math.sqrt(Math.random()) * 2);
			wage *= 1.01;
		}
		
		dynamo.update({
			TableName: "PlayerData",
			Key: { "IDID": event.UID },
			ReturnValues:"UPDATED_NEW",
			ConditionExpression: "OwnerID = :o AND (#m = :m OR attribute_not_exists(#m)) AND (#p.endContract <= :s OR attribute_not_exists(#p.endContract))",
			UpdateExpression: "REMOVE #m , SET #p.number = :n , #p.positionIndex = :p , #p.endContract = :c , seasonWage = :w",
			ExpressionAttributeNames: { "#m": "Mode" , "#p" : "parameter" },
			ExpressionAttributeValues: {
				":o": idid,
				":m": "New",
				":s": config.season,
				":p": event.position,
				":n": event.number,
				":c": contract,
				":w": wage
			}
		},context.done);
	});
};