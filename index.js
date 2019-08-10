var aws = require('aws-sdk');
var dynamo = new aws.DynamoDB.DocumentClient();
exports.handler = function (event, context) {
	if (!context.identity)
		context.identity = {};
	if (!context.identity.cognitoIdentityId)
		context.identity.cognitoIdentityId = "ap-northeast-1:ca4762e8-07de-4085-b01f-16de85c156c7";

	
    if (event.resources && event.resources.length > 0 && event.resources[0].lastIndexOf("rule/") > 0)
		event.Function = event.resources[0].substring(event.resources[0].lastIndexOf("rule/"));

	if (event.Function == "get_live_match" || event.Function == "generate_live_match")
		event.Function = "Simulation/" + event.Function;

	var baseFail = context.fail;
    context.fail = function (message, typeName) {
        if (typeName) {
			if (!(message instanceof Error))
				message = new Error(message);
            message.name = typeName;
        }

        baseFail(message);
    };

	var action = require("./" + event.Function + ".js");
	if (!action)
		return context.fail("Cannot require " + event.Function);

	action(event, context, dynamo);
};