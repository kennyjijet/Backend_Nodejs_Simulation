
var aws = require('aws-sdk');

var lambda = new aws.Lambda();

module.exports = function (dynamo, season, onFinish) {
	var config = require('../config');
    if (!(config && config.season > 0))
		return context.fail("No config.season");

	var UpdateSeason = require("./UpdateSeason");
	var UpdateRanking = require("./UpdateRanking");
	var UpdateLeague = require("./UpdateLeague");
	var GenMatch = require("./GenMatch");

	UpdateSeason(dynamo, function () {
		UpdateRanking(dynamo, function () {
			UpdateLeague(dynamo, function () {
				GenMatch(dynamo,function () {
					context.succeed();
				});
			});
		});
	});
};