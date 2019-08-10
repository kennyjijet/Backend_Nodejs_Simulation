var extend = require('util')._extend;
var player = require('./player.js');
var player1 = extend({}, player.player);
var player2 = extend({}, player.player);
var homeTeamlist = [];
var awayTeamlist = [];
var scorePenaltyHome = 0;
var scorePenaltyAway = 0;
var ballPositionClient = {
    "x": 5,
    "y": 3
};

/*
		Generate separately function for get_me, scout, youth.
		Penalty kick rules
		General kick 5 times first, after that kick only check one by one.
		-> get 5 first to win. 5 - 4, 5 - 3 5 - 2
		-> if get different score more than 3 to win. 3 - 0, 4 - 1.
		-> after 5 times of kicking, score is still equal, will kick extra one shot. who miss lose.
*/

function listAllFootballPlayersBothTeam() {
    for (var footBallPlayerHomeIndex in player1.squad.mySquad) {
        homeTeamlist.push(player1.squad.mySquad[footBallPlayerHomeIndex]);
    }
    for (var footBallPlayerAwayIndex in player2.squad.mySquad) {
        awayTeamlist.push(player2.squad.mySquad[footBallPlayerAwayIndex]);
    }
}

function eventPenaltyGenerator(penaltyResultList, eventTimeStamp) {
    var eventTemp = [];
    var secIndex = 0;
    while (penaltyResultList.length > secIndex) {
        eventTimeStamp += 1;
        eventTemp[secIndex] = [
            3, /// indexBallPositionX
            3, /// indexBallPositionY
            eventTimeStamp, /// eventTimestamp
            penaltyResultList[secIndex].actionType, //// eventAction
            1, /// inGameMinute
            penaltyResultList[secIndex].homeKick, /// isHomeTeam
            penaltyResultList[secIndex].shortName, /// mainPlayerName
            null, /// subPlayerName
        ];
        secIndex++;
    }
    return eventTemp;
}
/// get score to show to client. 
function getScoreBothTeam(isHome) {
    return isHome === true ? scorePenaltyHome : scorePenaltyAway;
}

function penaltyResultList() {
    var penaltylist = [];
    var scoreDiff = 0;
    var round = 1;
    var footballIndex = 10;
    while (footballIndex >= 1) {
        var penaltyDataHome = {
            "actionType": "",
            "shortName": "",
        };
        var penaltyDataAway = {
            "actionType": "",
            "shortName": "",
        };
        if (round <= 5) {
            scoreDiff = scorePenaltyHome - scorePenaltyAway;
            if (scoreDiff >= 3 || scoreDiff <= -3) {
                return penaltylist;
            }
        } else {
            if (scorePenaltyHome !== scorePenaltyAway) {
                return penaltylist;
            }
        }
        var goal;
        goal = comparePenaltySkill(homeTeamlist[footballIndex].footballPlayer, awayTeamlist[0].footballPlayer);
        if (goal) {
            penaltyDataHome.shortName = homeTeamlist[footballIndex].footballPlayer.shortName;
            penaltyDataHome.actionType = "goal";
            scorePenaltyHome++;
        } else {
            penaltyDataHome.shortName = awayTeamlist[0].footballPlayer.shortName;
            penaltyDataHome.actionType = "saves";
        }
        penaltyDataHome.homeKick = true;
        penaltylist.push(penaltyDataHome);
        
        /////// Away.
        goal = comparePenaltySkill(awayTeamlist[footballIndex].footballPlayer, homeTeamlist[0].footballPlayer);
        if (goal) {
            penaltyDataAway.shortName = awayTeamlist[footballIndex].footballPlayer.shortName;
            penaltyDataAway.actionType = "goal";
            scorePenaltyAway++;
        } else {
            penaltyDataAway.shortName = homeTeamlist[0].footballPlayer.shortName;
            penaltyDataAway.actionType = "saves";
        }
        penaltyDataAway.homeKick = false;
        penaltylist.push(penaltyDataAway);
        footballIndex--;
        round++;
    }
    ////// score still extra equal.
    var winHomeChance = 0.5;
    if (scorePenaltyHome === scorePenaltyAway) {
        var penaltyDataHomeEx = {
            "shortName": "",
            "actionType": "",
        };
        var penaltyDataAwayEx = {
            "shortName": "",
            "actionType": "",
        };

        if (winHomeChance >= Math.random()) {

            penaltyDataHomeEx.shortName = homeTeamlist[0].footballPlayer.shortName;
            penaltyDataHomeEx.actionType = "goal";
            penaltyDataHomeEx.homeKick = true;
            penaltylist.push(penaltyDataHomeEx);
            scorePenaltyHome++;

            penaltyDataAwayEx.shortName = awayTeamlist[0].footballPlayer.shortName;
            penaltyDataAwayEx.actionType = "saves";
            penaltyDataAwayEx.homeKick = false;
            penaltylist.push(penaltyDataAwayEx);

        } else {

            penaltyDataAwayEx.shortName = awayTeamlist[0].footballPlayer.shortName;
            penaltyDataAwayEx.actionType = "goal";
            penaltyDataAwayEx.homeKick = false;
            penaltylist.push(penaltyDataAwayEx);
            scorePenaltyAway++;

            penaltyDataHomeEx.shortName = homeTeamlist[0].footballPlayer.shortName;
            penaltyDataHomeEx.actionType = "saves";
            penaltyDataHomeEx.homeKick = true;
            penaltylist.push(penaltyDataHomeEx);
        }
    }
    return penaltylist;
}

function penaltyResult() {
    ////// return home true;
    if (scorePenaltyHome > scorePenaltyAway) {
        return true;
    } else if (scorePenaltyHome < scorePenaltyAway) {
        return false;
    }
}

function comparePenaltySkill(footballPlayerAttacker, footballPlayerDefender) {
    var chancePenalty = Math.random();
    var listSkillAttacker = {
        penaltyTaking: footballPlayerAttacker.penaltyTaking,
        finishing: footballPlayerAttacker.finishing,
        longShorts: footballPlayerAttacker.longShorts
    };

    var listSkillDefender = {
        oneOnOnes: footballPlayerDefender.oneOnOnes,
        handling: footballPlayerDefender.handling,
        reflex: footballPlayerDefender.reflex,
        positioning: footballPlayerDefender.positioning
    };

    var attacker = attackingBallToGkPenaltyKickCalculation(listSkillAttacker);
    var defender = defendingBallToGkPenaltyKickCalculation(listSkillDefender);

    var comparedAttakerAndDefender = attacker - defender;
    var chanceDef = (0.5 - (0.25 * comparedAttakerAndDefender / 10));
    return chancePenalty < chanceDef;
}

function attackingBallToGkPenaltyKickCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["penaltyTaking"] * (2))
        + ((listSkillAttacker["finishing"] + listSkillAttacker["longShorts"]) * (3 / 4));
    skillAttacker = (skillAttacker / 7000) * 100;
    return skillAttacker;
}

function defendingBallToGkPenaltyKickCalculation(listSkillDefender) {

    var skillDefender = (listSkillDefender["oneOnOnes"] * (2))
        + ((listSkillDefender["handling"] + listSkillDefender["reflex"] + listSkillDefender["positioning"]) * 0.5);
    skillDefender = (skillDefender / 7000) * 100;
    return skillDefender;

}

module.exports = {
    listAllFootballPlayersBothTeam: listAllFootballPlayersBothTeam,
    penaltyResultList: penaltyResultList,
    penaltyResult: penaltyResult,
    eventPenaltyGenerator: eventPenaltyGenerator,
    getScoreBothTeam: getScoreBothTeam
};