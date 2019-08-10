var extend = require('util')._extend;
var generate_live_match = require('./generate_live_match.js');
var calculation_pda = require('./calculation_possibility_decision_actions.js');
var soccer_field_gen = require('./soccer_field_generator.js');
var simulation_penalty = require('./simulation_penalty.js');
var footballPlayersBothActionsStats = [];
var player = require('./player.js');
var player1 = extend({}, player.player);
var player2 = extend({}, player.player);
var mainPlayer;
var subPlayer;
var ballPosition = {
    "x": 3,
    "y": 3,
    "air": false,
    "velocity": 1
};

var previousBallPosition = {
    "x": 3,
    "y": 3,
    "air": false,
    "velocity": 1
};

var prioritizeShootAction = [
    "ball_to_gk_shoot",
    "ball_to_gk_head",
    "ball_to_gk_charge",
    "ball_to_gk_long_shoot",
    "ball_to_gk_one_on_one",
    "ball_to_gk_freekick",
    "ball_to_gk_penaltykick",
    "try_to_shoot",
    "try_to_shoot_head",
    "try_to_shoot_charge"
];

var statsObj = {
    "passing": 0,
    "shotsOnGoal": 0,
    "score": 0
};
var statsHome = extend({}, statsObj);
var statsAway = extend({}, statsObj);

var passActions = ["pass_short", "pass_long", "pass_through", "crossing_low", "crossing_high"];
var shootActions = ["ball_to_gk_shoot", "ball_to_gk_head", "ball_to_gk_charge", "ball_to_gk_long_shoot", "ball_to_gk_one_on_one", "ball_to_gk_freekick", "ball_to_gk_penaltykick"];

var MaxcurrentTime = 0, nextDelayTime = 0;
var ballPossessionHome = true, ballDie = false;
///// Main event generator.
var actionType = "", previousActionType = "";
var eventTimeStamp = 0;
var matchType = "league";

/////// stats both teams.
////// Possession calculate How long each team possess the ball. 
/////// stats -> pass ball who passes the ball.
////// result stats 
////// Stats. possession. 50% 50%

var eventTemp = [];
//unitTest_generateMatch();
///// penaltyKick.
/*
simulation_penalty.listAllFootballPlayersBothTeam();
var listPenalty = simulation_penalty.penaltyResultList();
var homeWinPenaltyKick = simulation_penalty.penaltyResult();
eventTemp = simulation_penalty.eventPenaltyGenerator(listPenalty, eventTimeStamp);
console.log("Result " + simulation_penalty.getScoreBothTeam(true));
console.log("Result " + simulation_penalty.getScoreBothTeam(false));
console.log(homeWinPenaltyKick);
console.log(eventTemp);
*/

unitTest_generateMatch();
function unitTest_generateMatch() {
    soccer_field_gen.createfootballPlayersPosition();
    //createfootballPlayerStats();
    //soccer_field_gen.summarizedZone(true);
    //soccer_field_gen.summarizedZone(false);
    var sequencesData = {};
    var debug = false;
    var checkEnd = false;
    var seq = 0;
    var count = 0;
    while (count <= 20) {
        if (!debug)
            MaxcurrentTime += count === 10 ? 180 : 30;
        else MaxcurrentTime = [30, 60, -1][seq];
        while (eventTimeStamp < MaxcurrentTime) {
            //console.log(eventTimeStamp);
            //console.log(MaxcurrentTime);
            //eventTimeStamp++;
            //TimeForFootballPlayersInField(eventTimeStamp);
            //// footballplayers moving
            //soccer_field_gen.footballRunningInField(true);
            //soccer_field_gen.footballRunningInField(false);
            checkEnd = simulationSoccerGame();
            //console.log((checkEnd) ? "End game" : "ballposition no out of bound ");
            //eventTimeStamp++;
            //break;
        }
        console.log(eventTimeStamp);
        var seqString = "sequence" + (seq + 1);
        sequencesData["nextEventTimestamp_" + seqString] = MaxcurrentTime;
        sequencesData[seqString] = eventTemp;
        for (var index in eventTemp) {
            var eventTempIndex = eventTemp[index];
            var playerFootballAction = {
                "squadUid": eventTempIndex[8],
                "squadUidSub": eventTempIndex[9],
                "actionType": eventTempIndex[3],
                "isHome": eventTempIndex[5]
            };
            footballPlayersBothActionsStats.push(playerFootballAction);
        }
        eventTemp = [];
        seq++;
        count++;
    }
    console.log(footballPlayersBothActionsStats);
    console.log("Score Home " + statsHome.score);
    console.log("Score Away " + statsAway.score);
    if (matchType === "league") {
        ////// Score for league.
        ////// archive score for league;
        if (statsHome.score > statsAway.score) { 
            ///// Home +3
        } else if (statsHome.score < statsAway.score) {
            ///// Away +3
        } else { 
            ///// Home Away +1
        }
    } else if (matchType === "cup") {
        ////// archive score for cup;
    }
    else if (matchType === "champion_league") {
        /////// archive score for chapion league;
    }
    
    /*var teams = calculation_stats.matchResultCalculation(footballPlayersBothActionsStats);
    var manIndex = teams[0].manOfTheMatch.score >= teams[1].manOfTheMatch.score ? 0 : 1;
    teams[manIndex].manOfTheMatch.manOfTheMatch += 1;
    console.log((manIndex < 1) ? "Home" : "Away");*/
    //console.log(sequencesData);
    //var teams = calculation_stats.matchResultCalculation(footballPlayersBothActionsStats);
    //console.log(teams);
    // result.
    console.log((sequencesData.length < 21) ? "sequencesData.length < 21 Success" : "sequencesData.length < 21 Failed");
    //console.log((actionType !== undefined) ? "actionType === undefined None of undentified" : "actionType === undefined Failed");
    //console.log((ballPosition.x < soccer_field_gen.fieldBallMinX || ballPosition.x > soccer_field_gen.fieldBallMaxX || ballPosition.y < soccer_field_gen.fieldBallMinY || ballPosition.y > soccer_field_gen.fieldBallMaxY) ? "ballposition out of bound Failed" : "ballposition no out of bound ");
    //Context.succeed(sequencesData);
}

function eventGenerator(actionType, ballPossessionHome, usageTime) {
    eventTemp.push([
        Math.floor(ballPosition.x / soccer_field_gen.gridResolution), /// indexBallPositionX
        Math.floor(ballPosition.y / soccer_field_gen.gridResolution), /// indexBallPositionY
        eventTimeStamp, /// eventTimestamp
        actionType, //// eventAction
        1, /// inGameMinute
        ballPossessionHome, /// isHomeTeam
        mainPlayer ? mainPlayer.footballPlayer.shortName : "", /// mainPlayerName
        subPlayer ? subPlayer.footballPlayer.shortName : "",
        mainPlayer ? mainPlayer.squadUid : "", /// uuid
        subPlayer ? subPlayer.squadUid : "" ///sub uuid
    ]);

    var eventLog = {
        "indexBallPositionX": Math.floor(ballPosition.x / soccer_field_gen.gridResolution),
        "indexBallPositionY": Math.floor(ballPosition.y / soccer_field_gen.gridResolution),
        "eventTimestamp": eventTimeStamp,
        "actionType": actionType,
        "isHomeTeam": ballPossessionHome,
        "mainPlayer": mainPlayer ? mainPlayer.footballPlayer.shortName : "",
        "subPlayer": subPlayer ? subPlayer.footballPlayer.shortName : ""
    };
    console.log(eventLog);
    //console.log(eventTemp[eventTemp.length-1]);
    eventTimeStamp += usageTime;
}

function setBallpositionAfterShooting(goal, ballPosition, ballPossessionHome) {
    /// set goal.
    //if (!goal)
    //	return ballPosition;
    ballPosition.x = ballPossessionHome ? soccer_field_gen.fieldBallMaxX : soccer_field_gen.fieldBallMinX;
    ballPosition.y = Math.floor(soccer_field_gen.fieldBallMaxY / 2);
    return ballPosition;
}


////// get footballPlayer before run actions.
function getFootballPlayer(actionType) {
    mainPlayer = "";
    subPlayer = "";
    //console.log(actionType);
    //console.log(ballPosition);
    switch (actionType) {
        case "start_game":
        case "half_break":
        case "end_game":
            mainPlayer = null;
            subPlayer = null;
            break;
        case "ball_to_gk_shoot":
        case "ball_to_gk_head":
        case "ball_to_gk_charge":
        case "ball_to_gk_long_shoot":
        case "ball_to_gk_one_on_one":
        case "ball_to_gk_freekick":
        case "penalty_kick":
            mainPlayer = soccer_field_gen.getSquadDataFromField(ballPosition, ballPossessionHome);
            subPlayer = soccer_field_gen.getSquadDataGoalKeeper(ballPossessionHome);
            break;

        case "intercept":
        case "heading":
            mainPlayer = soccer_field_gen.getSquadDataFromField(ballPosition, ballPossessionHome);
            subPlayer = soccer_field_gen.getSquadDataFromField(ballPosition, ballPossessionHome);
            ////// check Injury impact in def actions.
            //injuryChanceOfFootBallplayerImpact(ballPossessionHome, actionType, mainPlayer, subPlayer);
            break;

        case "pass_short":
        case "pass_long":
        case "pass_through":
        case "crossing_low":
        case "crossing_high":
        case "try_to_shoot":
        case "try_to_shoot_head":
        case "try_to_shoot_charge":
        //case "dribble":
            mainPlayer = soccer_field_gen.getSquadDataFromField(previousBallPosition, ballPossessionHome);
            subPlayer = soccer_field_gen.getSquadDataFromField(ballPosition, ballPossessionHome);
            break;
        case "goal":
        default:
            mainPlayer = soccer_field_gen.getSquadDataFromField(ballPosition, ballPossessionHome);
            subPlayer = null;
            break;
    }

    if (!mainPlayer)
        return;
}

function simulationSoccerGame() {

    if (eventTimeStamp < 1) {
        actionType = "start_game";
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 1);
        ballDie = false;
        passingBallEvent();
        return false;
    }

    if (eventTimeStamp >= 300 && eventTimeStamp < 480) {
        actionType = "half_break";
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 180);
        ballPossessionHome = !ballPossessionHome;
        /////////// HalfBreakEnd
        
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 1);
		
        ///// Reset. game
        actionType = "start_game"; // start game
        ballPosition.x = 3;
        ballPosition.y = 3;
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 1);
        ballDie = false;
        return false;
    }

    if (eventTimeStamp >= 780) {
        if (matchType === "league") {
            actionType = "end_game";
            eventGenerator(actionType, ballPossessionHome);
            return true;
        }
        /////Extra time.
        if (statsHome.score !== statsAway.score) {
            actionType = "end_game";
            eventGenerator("end_game", ballPossessionHome);
            return true;
        }
        /////Penalty kick.
        if (eventTimeStamp >= 900) {
            /// End game.
            ///// penaltyKick.
            simulation_penalty.listAllFootballPlayersBothTeam();
            //simulation_penalty.penaltyResultList();
            var listPenalty = simulation_penalty.penaltyResultList()
            var homeWinPenaltyKick = simulation_penalty.penaltyResult();
            eventTemp = simulation_penalty.eventPenaltyGenerator(listPenalty, eventTimeStamp);
            if (homeWinPenaltyKick)
                statsHome.score += 1;
            else statsAway.score += 1;
            return true;
        }
    }

    previousBallPosition = extend({}, ballPosition);
    passingBallEvent();
    if (ballPosition.x >= soccer_field_gen.fieldBallMaxX
        || ballPosition.x <= soccer_field_gen.fieldBallMinX
        || ballPosition.y >= soccer_field_gen.fieldBallMaxY
        || ballPosition.y <= soccer_field_gen.fieldBallMinY) {
        /// solve.
        actionType = "out_of_bounds";
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 1);
        ballDie = true;
        //return false;
    }

    if (ballDie) {
        ballDieEvent();
        return false;
    }

    goalIncident();
    if (ballDie) {
        ballDieEvent();
        return false;
    }
    ///// Def ball define actions while in the field.
    /////// Injury on stats everyone infield.
    //calculateInjuryConditionGeneral();
			
    ///// foul offSide...
    var foul = calculation_pda.offSidePositioning(ballPosition, actionType, ballPossessionHome);
    if (foul) {
        ///// offside
        actionType = "offside"; //// offSide
        ballDie = true;
        //return false;
    }

    if (ballDie) {
        ballDieEvent();
        return false;
    }

    if (ballPosition.y !== (soccer_field_gen.fieldBallMaxY / 2)
        && (ballPosition.x < soccer_field_gen.fieldBallMaxX) || (ballPosition.x > soccer_field_gen.fieldBallMinX)) {
        var actionDefense = calculation_pda.decisionOfdefense(actionType);
        getFootballPlayer(actionDefense);
        ///// "intercept"
        var defenseOnTheFieldComplete = calculation_pda.possibilityOfdefense(ballPosition, previousBallPosition
            , ballPossessionHome, actionType, actionDefense, mainPlayer, subPlayer);

        if (defenseOnTheFieldComplete) {
            actionType = actionDefense;
            ballPossessionHome = !ballPossessionHome;
            getFootballPlayer(actionDefense);
            eventGenerator(actionType, ballPossessionHome, 3);
            /// foul after def.
            foul = calculation_pda.possibilityOfFoul(ballPossessionHome);
            if (!foul)
                return false;
        }
    }

    if (foul) {
        var cardAction = [null, "yellow_card", "red_card"];
        actionType = "fouls"; ///// foul
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 1);

        var card = cardAction[calculation_pda.refereeDecision(ballPossessionHome)];
        if (!card)
            return false;
        actionType = card;
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 2);
        ballDie = true;
    }
    if (ballDie) {
        ballDieEvent();
        return false;
    }
    return false;
}

function passingBallEvent() {
    var usageTime = 1;
    actionType = calculation_pda.decisionOfMoveBallAction(ballPosition, ballPossessionHome);
    ballPosition = calculation_pda.decisionMoveBallDirection(ballPosition, actionType, ballPossessionHome);
    ///// set hard code. 
    if (ballPosition.x >= soccer_field_gen.fieldBallMaxX) {
        ballPosition.x = soccer_field_gen.fieldBallMaxX;
    }
    if (ballPosition.x <= soccer_field_gen.fieldBallMinX) {
        ballPosition.x = soccer_field_gen.fieldBallMinX;
    }
    if (ballPosition.y >= soccer_field_gen.fieldBallMaxY) {
        ballPosition.y = soccer_field_gen.fieldBallMaxY;
    }
    if (ballPosition.y <= soccer_field_gen.fieldBallMinY) {
        ballPosition.y = soccer_field_gen.fieldBallMinY;
    }
    // Home Attacking....
    if (actionType === "pass_short") {
        usageTime = 1;
        //shortPassHomeStat += 1;

    } else if (actionType === "pass_long") {
        usageTime = 2;
        //longPassHomeStat += 1;

    } else if (actionType === "pass_through") {
        usageTime = 1;
        //shortPassHomeStat += 1;

    } else if (actionType === "crossing_low") {
        usageTime = 1;
        //longPassHomeStat += 1;
    }
    else if (actionType === "crossing_high") {
        usageTime = 1;
    }
    else if (actionType === "dribble") {
        usageTime = 3;
    }
    //// Pass Event or defense.
    // eventGenerator(ballPosition, eventTimeStamp, actionType, previousBallPosition, ballPosition);
    //eventGenerator(ballPosition, eventTimeStamp, actionType, previousBallPosition, ballPosition, ballPossessionHome, teamPossessing);
    getFootballPlayer(actionType);
    eventGenerator(actionType, ballPossessionHome, usageTime);
}

function freeKickIncident(ballPossessionHome) {
    /////// free kick...
    actionType = "free_kick"; 	///// free kick
    //ballPosition.x = 3;
    //ballPosition.y = 3;
    getFootballPlayer(actionType);
    eventGenerator(actionType, ballPossessionHome, 1);
    var actionShoot = "ball_to_gk_freekick";
    if (ballPossessionHome &&
        ballPosition.x >= (soccer_field_gen.fieldBallMaxX - (2 * soccer_field_gen.gridResolution))) {
        //// free_kick_to shoot
        goalResult(actionShoot);
    }

    else if (!ballPossessionHome &&
        ballPosition.x <= (soccer_field_gen.fieldBallMinX + (2 * soccer_field_gen.gridResolution))) {
        //// free_kick_to shoot
        goalResult(actionShoot);
    } else { 
        ///// free_kick_to pass.
        passingBallEvent();
    }
}

function goalIncident() {
    //if(actionType !== "penalty_kick" || actionType !== "free_kick"){
    ///// Check opportunity to shoot.
    /// possibility problem.
    if (!calculation_pda.decisionOfOpportunityToShoot(ballPosition, ballPossessionHome))
        return;

    previousActionType = actionType; ///// passing or dribble.
    actionType = calculation_pda.decisionOfTryToshooting(ballPosition, ballPossessionHome, prioritizeShootAction);
    getFootballPlayer(actionType);
    eventGenerator(actionType, ballPossessionHome, 1);
    //// Def before shooting. 
    var actionDefense = calculation_pda.decisionOfdefense(actionType);
    var defTryToShootComplete = calculation_pda.possibilityOfdefense(ballPosition, previousBallPosition,
        ballPossessionHome, actionType, actionDefense, mainPlayer, subPlayer);

    if (defTryToShootComplete) {
        ballPossessionHome = !ballPossessionHome;
        eventGenerator(actionDefense, ballPossessionHome, 1);
    }
    else {
        actionType = calculation_pda.decisionOfshooting(ballPosition, ballPossessionHome, previousActionType);
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 1);
        goalResult(actionType);
    }
}

function goalResult(actionShoot) {
    var goal = calculation_pda.possibilityOfshootingAndDefending(ballPosition, previousBallPosition
        , ballPossessionHome, actionShoot, mainPlayer, subPlayer);
    if (goal === "goal") {
        getFootballPlayer(actionType);
        ballPosition = setBallpositionAfterShooting(goal, ballPosition, ballPossessionHome);
        actionType = "goal"; /// goal
        if (ballPosition.x === (soccer_field_gen.fieldBallMinX)
            && ballPosition.y === Math.floor(soccer_field_gen.fieldBallMaxY / 2)) {
            // Goal away
            statsAway.score += 1;
            eventGenerator(actionType, ballPossessionHome, 1);
            ballDie = true;
        } else if (ballPosition.x === (soccer_field_gen.fieldBallMaxX)
            && ballPosition.y === Math.floor(soccer_field_gen.fieldBallMaxY / 2)) {
            // Goal home
            statsHome.score += 1;
            eventGenerator(actionType, ballPossessionHome, 5);
            ballDie = true;
        }
    } else if (goal === "saves") {
        ballPosition = setBallpositionAfterShooting(goal, ballPosition, ballPossessionHome);
        ballPossessionHome = !ballPossessionHome;
        actionType = "saves"; /// saves 
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 4);
        ballDie = true;

    } else if (goal === "failed") {
        ballPosition = setBallpositionAfterShooting(goal, ballPosition, ballPossessionHome);
        actionType = "failed"; //// failed.
        getFootballPlayer(actionType);
        eventGenerator(actionType, ballPossessionHome, 2);
        ballDie = true;
        ballPossessionHome = !ballPossessionHome;
    }
}

function ballDieEvent() { 
    //Set up ball......
    //currentFootbalPlayerPossessingTheball.squadUid = calculation_pda.checkCurrentFootballPlayerPossessingTheBall(ballPosition, ballPossessionHome, false);
    //// switch case..... 1 2.....
	
    switch (actionType) {
        case "goal":
            ballPossessionHome = !ballPossessionHome;
            actionType = "start_game"; // start game
            ballPosition.x = (soccer_field_gen.fieldBallMaxX / 2);
            ballPosition.y = (soccer_field_gen.fieldBallMaxY / 2);
            getFootballPlayer(actionType);
            eventGenerator(actionType, ballPossessionHome, 1);
            break;

        case "failed":
        case "saves":
            actionType = "goal_kick"; ///// goal kick.
            ballPosition.x = (soccer_field_gen.fieldBallMaxX / 2);
            ballPosition.y = (soccer_field_gen.fieldBallMaxY / 2);
            getFootballPlayer(actionType);
            eventGenerator(actionType, ballPossessionHome, 1);
            break;

        case "offside":
            getFootballPlayer(actionType);
            eventGenerator(actionType, ballPossessionHome, 2);
            ballPossessionHome = !ballPossessionHome;
            freeKickIncident(ballPossessionHome);
            break;
        case "fouls":
        case "yellow_card":
        case "red_card":
            //foulEvent();
            ballPossessionHome = !ballPossessionHome;
            if (ballPosition.x === (soccer_field_gen.fieldBallMinX + (1 * soccer_field_gen.gridResolution))
                || ballPosition.x === (soccer_field_gen.fieldBallMaxX - (1 * soccer_field_gen.gridResolution))) {
                actionType = "penalty_kick"; 	///// penalized kick
                getFootballPlayer(actionType);
                eventGenerator(actionType, ballPossessionHome, 1);
                goalResult(actionType);
            }
            else freeKickIncident(ballPossessionHome);
            break;
        case "out_of_bounds":
            /// Corner kick. 
            if (ballPosition.x <= soccer_field_gen.fieldBallMinX && ballPossessionHome
                || ballPosition.x >= soccer_field_gen.fieldBallMaxX && !ballPossessionHome) {
                actionType = "corner_kick";
                if (ballPossessionHome)
                    ballPosition.x = soccer_field_gen.fieldBallMinX + (1 * soccer_field_gen.gridResolution);
                else ballPosition.x = soccer_field_gen.fieldBallMaxX - (1 * soccer_field_gen.gridResolution);
            } else if (ballPosition.y <= soccer_field_gen.fieldBallMinY || ballPosition.y >= soccer_field_gen.fieldBallMaxY) {
                actionType = "thrown_in";
                ballPosition.x = soccer_field_gen.fieldBallMaxX / 2;
            } else {
                actionType = "goal_kick";
                ballPosition.x = soccer_field_gen.fieldBallMaxX / 2;
            }
            if (ballPosition.y < Math.floor(soccer_field_gen.fieldBallMaxY / 2))
                ballPosition.y = soccer_field_gen.fieldBallMinY + (3 * soccer_field_gen.gridResolution);
            else ballPosition.y = soccer_field_gen.fieldBallMaxY - (3 * soccer_field_gen.gridResolution);
            ballPossessionHome = !ballPossessionHome;
            getFootballPlayer(actionType);
            eventGenerator(actionType, ballPossessionHome, 1);
            break;

        default:
            throw new Error("actionType " + actionType + " should not let ball die");
    }
    ballDie = false;
}
///////// Stats function.

var teams = [
    {
        field: [[]],
        stats: [{}],
        tactic: {
            "strategy": 3,
            "defensiveLine": 2,
            "focusPassing": 2,
            "longShorts": 0,
            "forceCounterattack": false,
            "playOffsideTrap": false,
            "passingStyle": 1,
            "closingDownStyle": 1,
            "tacklingStyle": 1,
            "markingStyle": 1,
            "crossingStyle": 1,
            "roamingStyle": 1,
        }
    },
    {
        field: [[]],
        stats: [{}],
        tactic: {
            "strategy": 3,
            "defensiveLine": 2,
            "focusPassing": 2,
            "longShorts": 0,
            "forceCounterattack": false,
            "playOffsideTrap": false,
            "passingStyle": 1,
            "closingDownStyle": 1,
            "tacklingStyle": 1,
            "markingStyle": 1,
            "crossingStyle": 1,
            "roamingStyle": 1,
        }
    }
];

function createfootballPlayerStats(user0, user1) {

    [user0, user1].forEach(function (user, index) {
        teams[index] = user;
        teams[index].field = index < 1 ? soccer_field_gen.getFieldHome() : soccer_field_gen.getFieldAway();
        teams[index].stats = user.squad;
    });
}

var actionScores = {
    pass_short: {
        score: 0.1,
        condition: 0.1
    },
    pass_long: {
        score: 0.2,
        condition: 0.2
    },
    pass_through: {
        score: 0.5,
        condition: 0.5
    },
    crossing_low: {
        score: 0.2,
        condition: 0.2
    },
    crossing_high: {
        score: 0.2,
        condition: 0.2
    },
    fouls: {
        score: -2,
        condition: 2,
        fouls: 1
    },
    goal: {
        score: 5,
        condition: 5,
        goal: 1
    },
    saves: {
        score: 5,
        condition: 5,
        saves: 1
    },
    yellow_card: {
        score: -5,
        condition: 5,
        yellowCard: 1
    },
    red_card: {
        score: -10,
        condition: 10,
        redCard: 1
    },
    saves_penalty: {
        score: 10,
        condition: 10,
        savesPenalty: 1
    },
    out_of_bounds: {
        score: -1,
        condition: 1,
        outOfBound: 1
    },
    failed: {
        score: -0.1,
        condition: 0.1,
        failed: 1
    },
    offside: {
        score: -0.1,
        condition: 0.1,
        offside: 1
    },
    intercept: {
        score: 1,
        condition: 1,
        intercept: 1
    },
    heading_defense: {
        score: 1,
        condition: 1,
        headingDefense: 1
    },
    defense: {
        score: 0.5,
        condition: 0.5,
        defense: 1
    },
};
//// RelationShips.
function updateRelationShips(listFootballPlayers, footballPlayerStatsArray) {                           
    ///footballPlayer.humanRelation.
    /* 
        human relation = 2000/20=100.
    */ 
    //// relationShips will be archive after pass success or get the goal. 
    var playerRelationFirst;
    var playerRelationSecond;
    for (var index in listFootballPlayers) {
        playerRelationFirst = footballPlayerStatsArray.find(function (squad) { return squad.squadUid === listFootballPlayers[index].squadUid; });
        playerRelationSecond = footballPlayerStatsArray.find(function (squad) { return squad.squadUid === listFootballPlayers[index].squadUidSub; });
        if (passActions.indexOf(listFootballPlayers[index].actionType) >= 0) {
            if (playerRelationFirst.humanRelation[listFootballPlayers[index].squadUidSub] === undefined &&
                playerRelationSecond.humanRelation[listFootballPlayers[index].squadUid] === undefined) {
                playerRelationFirst.humanRelation[listFootballPlayers[index].squadUidSub] = 0;
                playerRelationSecond.humanRelation[listFootballPlayers[index].squadUid] = 0;
            } else {
                playerRelationFirst.humanRelation[listFootballPlayers[index].squadUidSub] += 0.1;
                playerRelationSecond.humanRelation[listFootballPlayers[index].squadUid] += 0.1;
            }
        } else if (listFootballPlayers[index].actionType === "goal") { 
            //// Goal. 
            var prevActions = index - 5;
            var indexPrev = index;
            while (indexPrev < prevActions) {
                indexPrev--;
                var prevAction = listFootballPlayers[index];
                if (passActions.indexOf(prevAction.actionType) < 0)
                    continue;
                playerRelationFirst = footballPlayerStatsArray.find(function (squad) { return squad.squadUid === listFootballPlayers[index].squadUid; });
                playerRelationSecond = footballPlayerStatsArray.find(function (squad) { return squad.squadUid === listFootballPlayers[indexPrev].squadUid; });
                playerRelationFirst.humanRelation[listFootballPlayers[indexPrev].squadUidSub] += 0.5;
                playerRelationSecond.humanRelation[listFootballPlayers[index].squadUid] += 0.5;
                if (playerRelationFirst.humanRelation[listFootballPlayers[indexPrev].squadUidSub] === undefined &&
                    playerRelationSecond.humanRelation[listFootballPlayers[index].squadUid] === undefined) {
                    playerRelationFirst.humanRelation[listFootballPlayers[index].squadUidSub] = 0.5;
                    playerRelationSecond.humanRelation[listFootballPlayers[index].squadUid] = 0.5;
                } else {
                    playerRelationFirst.humanRelation[listFootballPlayers[index].squadUidSub] += 0.5;
                    playerRelationSecond.humanRelation[listFootballPlayers[index].squadUid] += 0.5;
                }
            }
        }
    }
}

///// overall stats of both teams.
function calculateOverallStatsTeams(actionType, isHome) {
    if (passActions.indexOf(actionType) >= 0) {
        if (isHome) {
            statsHome.passing += 1;
        } else {
            statsAway.passing += 1;
        }
    } else if (shootActions.indexOf(actionType) >= 0) {
        if (isHome) {
            statsHome.shotsOnGoal += 1;
        } else {
            statsAway.shotsOnGoal += 1;
        }
    } else if (actionType === "goal") {
        if (isHome) {
            statsHome.score += 1;
        } else {
            statsAway.score += 1;
        }
    }
}

///// Assist.
function calculateAssist(index, footballPlayersActionsStats, footballPlayerStatsArray) {
    var prevAssist = index - 5;
    while (index < prevAssist) {
        index--;
        var prevAction = footballPlayersActionsStats[index];
        if (passActions.indexOf(prevAction.actionType) < 0)
            continue;

        var player = footballPlayerStatsArray.find(function (squad) { return squad.squadUid === prevAction.squadUid; });
        player.assists += 1;
        player.score += 20;
        return;
    }
}

function matchResultCalculation(footballPlayersBothActionsStats) {
    var manOfTheMatchs = teams.forEach(function (team, index) {
        var actionStats = footballPlayersBothActionsStats;
        updateRelationShips(actionStats, team.stats);
        //var actionStats = index < 1 ? footballPlayersHomeActionsStats : footballPlayersAwayActionsStats;
        actionStats.forEach(function (action, index) {
            if (!action)
                return;

            if (action.actionType == "goal")
                calculateAssist(index, actionStats, team.stats);

            var stat = team.stats.find(function (squad) { return squad.squadUid === action.squadUid; });
            if (!stat)
                return;

            if (passActions.indexOf(action.actionType) >= 0) {
                updateRelationShips(index, actionStats, team.stats);
                var nextAction = actionStats[index + 1];
                if (nextAction && nextAction.actionType != "intercept")
                    stat.passSuccess += 1;
                else stat.passFailed += 1;
            }
            var scores = actionScores[action.actionType];
            if (scores) {
                for (var key in scores)
                    stat[key] += scores[key];
            }
        });
        return team.stats.reduce(function (prev, current) { return prev.score > current.score ? prev : current; });
    });
    console.log("man of the matchs" + manOfTheMatchs);
    ///// find over team stats.
    ///// calculate overall team stats.
    ///// footballPlayersBothActionsStats.
    
    
    return [
        {
            stats: teams[0].stats,
            manOfTheMatch: manOfTheMatchs[0]
        }, {
            stats: teams[1].stats,
            manOfTheMatch: manOfTheMatchs[1]
        }
    ];
}

function calculateInjuryConditionGeneral() {
    var injuryWeights = [0.8, 0.95, 0.99];
    var conditionDelines = [0.001, 0.002, 0.005];

    teams.forEach(function (team) {

        var injuryWeight = injuryWeights[team.tactic.tacklingStyle];
        var conditionDeline = conditionDelines[team.tactic.markingStyle] + conditionDelines[team.tactic.roamingStyle];

        team.field.forEach(function (uid) {
            if (!uid)
                return;

            var player = team.stats.find(function (item) { return uid == item.squadUid; });
            if (!player)
                return;

            player.condition = conditionDeline;

            var injuryChance = Math.random();
            if (injuryChance > injuryWeight)
                player.injury += 0.5;
        });
    });
}

function injuryLevelChance(levelTackling) {

    var injuryChances = [
        [0, 0, 0.5, 0.25, 0.13, 0.07, 0.05],
        [0, 0.5, 0.25, 0.13, 0.07, 0.05],
        [0.5, 0.3, 0.15, 0.05],
    ];

    var injuryLevelChance = Math.random();
    //console.log(levelTackling);
    var injuryChance = injuryChances[levelTackling];
    var i = injuryChance.length;
    //console.log(injuryLevelChance);
    //console.log(injuryChance);
    while (i > 0) {
        i--;
        if (injuryLevelChance < injuryChance[i])
            return i;
    }
    return -1;
}

function injuryChanceOfFootBallplayerImpact(ballPossessionHome, actionType, mainPlayer, subPlayer) {

    var defInjuryRate = {
        "pass_short": 0.3,
        "pass_long": 0.2,
        "pass_through": 0.3,
        "crossing_low": 0.4,
        "crossing_high": 0.4,
        "dribble": 0.4,
        "try_to_shoot": 0.5,
        "try_to_shoot_head": 0.4,
        "try_to_shoot_charge": 0.7,
    };

    var injuryEffects = [
        { condition: 10, min: 9, max: 12 },
        { condition: 15, min: 20, max: 25 },
        { condition: 20, min: 30, max: 35 },
        { condition: 30, min: 45, max: 55 },
        { condition: 40, min: 60, max: 65 },
        { condition: 50, min: 65, max: 75 },
        { condition: 60, min: 80, max: 90 },
    ];

    //// [ [ [attackerRate,defenderRate] ] ]
    var injuryRates = [
        [[0.25, 0.25], [0.15, 0.20], [0.10, 0.15]],
        [[0.20, 0.15], [0.12, 0.12], [0.08, 0.10]],
        [[0.15, 0.10], [0.10, 0.08], [0.06, 0.06]],
    ];

    var attackTactics = ballPossessionHome ? teams[0].tactic : teams[1].tactic;
    var defendTactics = ballPossessionHome ? teams[1].tactic : teams[0].tactic;
    var rate = injuryRates[attackTactics.tacklingStyle][defendTactics.tacklingStyle];

    var attackRate = rate[0];
    var defendRate = rate[1] + defInjuryRate[actionType];

    [attackRate, defendRate].forEach(function (rate, index) {

        if (Math.random() >= rate)
            return;

        var tactic = index < 1 ? attackTactics : defendTactics;
        var injuryLevel = injuryLevelChance(tactic.tacklingStyle);
        //console.log(injuryLevel);
        if (injuryLevel >= 0) {
            var effect = injuryEffects[injuryLevel];
            var player = index < 1 ? mainPlayer : subPlayer;
            player.condition += effect.condition;
            player.injury += effect.min + (Math.random() * (effect.max - effect.min));
        }
    });
}

function updateTimeForFootballPlayersInField(eventTimeStamp) {

    teams.forEach(function (team) {

        team.field.forEach(function (uid) {
            if (!uid)
                return;

            var player = team.stats.find(function (item) { return uid == item.squadUid; });
            if (!player)
                return;

            player.playedTime = eventTimeStamp;
        });
    });
}