	
module.exports = function (event, context, dynamo) {
    /*
    dynamo.update({
        TableName: 'GameInfoData',
        Key: { game_version: "1.1" },
        ExpressionAttributeNames: { '#j': 'JsonData' },
        ExpressionAttributeValues: { ':d': event },
        UpdateExpression: 'set #j = :d'
    },context.done);
    */
    dynamo.update({
        TableName: 'SoccerSimulationGameTable',
        Key: { "name": "game_info_data",
		    "versions": event.versions },
        ExpressionAttributeNames: { '#j': 'data' },
        ExpressionAttributeValues: { ':d': event },
        UpdateExpression: 'set #j = :d'
    },context.done);
};