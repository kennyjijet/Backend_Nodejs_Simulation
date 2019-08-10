module.exports = {
	day: 1,
	seasonDay : 28,
	zone: 1,

	leagueTeam: 14,
	allStat: [
		"tackling", "heading", "marking", "positioning", "passing", "dribbling", "finishing"
		, "crossing", "strength", "aggression", "firstTouch", "longShorts", "technique", "decisions"
		, "corner", "freekick", "penaltyTaking", "determination", "flair", "leadership", "offTheBall"
		, "teamwork", "acceleration", "agility", "balance", "jumping", "pace", "stamina"
		, "handling", "kicking", "rushingOut", "reflex", "oneOnOnes", "aerialAbility"
	],

	matchDays: [
		[[0, 1], [2, 3], [4, 5], [8, 9], [10, 11], /**/[6, 12], [7, 13]],
		[[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13, 0]],

		[[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11], /**/[12, 13]],
		[[8, 0], [9, 1], [10, 2], [11, 3], [12, 4], [13, 5], /**/[6, 7]],

		[[0, 4], [1, 5], [2, 6], [3, 7],/**/[8, 11], [9, 12], [10, 13]],
		[[4, 8], [5, 9], [6, 10], [7, 11], /**/[12, 1], [13, 2], [0, 3]],
		[[8, 12], [9, 13], [10, 0], [11, 1],/**/[2, 5], [3, 6], [4, 7]],
		[[12, 2], [13, 3], /**/[1, 4], [5, 8], [6, 9], [7, 10], [11, 0]],

		[[11, 2] /**/, [3, 5], [4, 6], [7, 9], [8, 10], [12, 0], [13, 1]],
		[[0, 2], [5, 7], [6, 8], [9, 11],/**/[10, 1], [12, 3], [13, 4]],

		[[0, 5], [1, 6], [2, 7], [3, 8], [4, 9], /**/[10, 12], [11, 13]],
		[[5, 10], [6, 11], [7, 12], [8, 13], [9, 0], /**/[1, 3], [2, 4]],

		[[0, 7], [1, 8], [2, 9], [3, 10], [4, 11], [5, 12], [6, 13]]
	],
	
	PositionName: [
		["gk"],
		["dl","dc","dc","dc","dr"],
		["dml","dmc","dmc","dmc","dmr"],
		["ml","mc","mc","mc","mr"],
		["aml","amc","amc","amc","amr"],
		["st","st","st"]
	]
};