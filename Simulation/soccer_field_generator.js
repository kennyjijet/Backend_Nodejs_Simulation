/* global DL */
var extend = require('util')._extend;
var player = require('./player.js');
var config = require("../config");
var player1 = extend({}, player.player);
var player2 = extend({}, player.player);
var footballPlayersPositionArrayHome = [];
var footballPlayersPositionArrayAway = [];
var tacticsHome = {
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
};

var tacticsAway = {
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
};

var zoneObject = {
    "sumZoneDLAk": 20,
    "sumZoneDLDf": 20,
    "sumZoneDMLAk": 20,
    "sumZoneDMLDf": 20,
    "sumZoneMLAk": 20,
    "sumZoneMLDf": 20,
    "sumZoneAMLAk": 20,
    "sumZoneAMLDf": 20,
    "sumZoneDCAk": 20,
    "sumZoneDCDf": 20,
    "sumZoneDMCAk": 20,
    "sumZoneDMCDf": 20,
    "sumZoneMCAk": 20,
    "sumZoneMCDf": 20,
    "sumZoneAMCAk": 20,
    "sumZoneAMCDf": 20,
    "sumZoneDRAk": 20,
    "sumZoneDRDf": 20,
    "sumZoneDMRAk": 20,
    "sumZoneDMRDf": 20,
    "sumZoneMRAk": 20,
    "sumZoneMRDf": 20,
    "sumZoneAMRAk": 20,
    "sumZoneAMRDf": 20,
    "sumZoneSTAk": 20,
    "sumZoneSTDf": 20,
    "sumZoneFLAk": 20,
    "sumZoneFRAk": 20,
}
//// Home. 
var sumZoneHome = extend({}, zoneObject);
//// Away. 
var sumZoneAway = extend({}, zoneObject);

/// Grid 7x7 of ball.
var fieldBallMaxX = 6;
var fieldBallMinX = 0;
var fieldBallMaxY = 6;
var fieldBallMinY = 0;
var gridResolution = 1;

//// grid 14 x 14 of ball
/*
    var fieldBallMaxX = 13;
    var fieldBallMinX = 0;
    var fieldBallMaxY = 13;
    var fieldBallMinY = 0;
    var gridResolution = 2;
*/

//// Experiment Unused for now.
function footballFieldRealistic() {
    var widthX = 120;
    var heightY = 90;
    var footballLocation = {
        "x": Math.floor(widthX / 2),
        "y": Math.floor(heightY / 2)
    };
    console.log(footballLocation);
}

function footballRunningInField(isHome) {
    var fieldTemp;
    var move = 0;
    var tacticsTemp;
    if (isHome) {
        fieldTemp = footballPlayersPositionArrayHome;
        tacticsTemp = tacticsHome;
    } else {
        fieldTemp = footballPlayersPositionArrayAway;
        tacticsTemp = tacticsAway;
    }
    if (tacticsTemp.defensiveLine === 0) {
        move = Math.random() * (3 - 1) + 1;
    } else if (tacticsTemp.defensiveLine === 1) {
        move = Math.random() * (2 - 1) + 1;
    } else if (tacticsTemp.defensiveLine === 2) {
        move = Math.random();
    }
    for (var index = 1; index < 11; index++) {
        fieldTemp[index].x += move;
    }
}

function getFieldHome() {
    return footballPlayersPositionArrayHome;
}

function getFieldAway() {
    return footballPlayersPositionArrayAway;
}

function createfootballPlayersPosition() { 
    ///// Home.
    var footballPlayer;
    for (var index = 0; index < 11; index++) {
        footballPlayer = player1.squad.mySquad[index];
        footballPlayersPositionArrayHome.push(initializeFootballInField(footballPlayer, index, true));
    }
    ///// Away.
    for (var index = 0; index < 11; index++) {
        footballPlayer = player2.squad.mySquad[index];
        footballPlayersPositionArrayAway.push(initializeFootballInField(footballPlayer, index, false));
    }
}

function initializeFootballInField(footballPlayer, index, home) { 
    //// Mock up.
    var pos = [0, 3];

    switch (index) {
        case 1:
            pos[0] = 1;
            pos[1] = 1;
            break;
        case 2:
            pos[0] = 1;
            pos[1] = 2;
            break;
        case 3:
            pos[0] = 1;
            pos[1] = 3;
            break;
        case 4:
            pos[0] = 1;
            pos[1] = 4;
            break;
        case 5:
            pos[0] = 1;
            pos[1] = 5;
            break;
        case 6:
            pos[0] = 2;
            pos[1] = 1;
            break;
        case 7:
            pos[0] = 2;
            pos[1] = 2;
            break;
        case 8:
            pos[0] = 2;
            pos[1] = 3;
            break;
        case 9:
            pos[0] = 2;
            pos[1] = 4;
            break;
        case 10:
            pos[0] = 3;
            pos[1] = 3;
            break;
    }

    if (!home) {
        pos[0] = 6 - pos[0];
        pos[1] = 6 - pos[1];
    }

    return {
        "squadUid": footballPlayer.squadUid,
        "x": pos[0],
        "y": pos[1]
    };
}

function getSquadDataFromField(ballPosition, ballPossessionHome) {
    //var footballPlayersHome = [];
    //var footballPlayersAway = [];
    var possessingFootballPlayerUuid = distanceBetweenBallandfootballPlayers(ballPosition, ballPossessionHome);
    var playerTemp;
    if (ballPossessionHome) {
        playerTemp = player1;
    } else {
        playerTemp = player2;
    }
    for (var footballPlayerIndex in playerTemp.squad.mySquad) {
        if (playerTemp.squad.mySquad[footballPlayerIndex].squadUid === possessingFootballPlayerUuid) {
            //console.log("found footballPlayer");
            return playerTemp.squad.mySquad[footballPlayerIndex];
        }
    }
}

function GetByWeigth(weigth, rangeWeigths) {
    return rangeWeigths.find(function (rangeWeigth) { return weigth < rangeWeigth.weigth; });
}

function GetRandomRange(range) {
    return range.min + Math.floor(Math.random() * (range.max - range.min));
}

function attributeOffootballPlayerAk(positionOfFootabllPlayer) {
    return (positionOfFootabllPlayer["crossing"] + positionOfFootabllPlayer["dribbling"] +
        + positionOfFootabllPlayer["longShorts"] + positionOfFootabllPlayer["passing"] + positionOfFootabllPlayer["technique"]
        + positionOfFootabllPlayer["flair"] + positionOfFootabllPlayer["offTheBall"] + positionOfFootabllPlayer["teamwork"]
        + positionOfFootabllPlayer["firstTouch"] + positionOfFootabllPlayer["acceleration"] + positionOfFootabllPlayer["agility"]
        + positionOfFootabllPlayer["balance"] + positionOfFootabllPlayer["pace"] + positionOfFootabllPlayer["stamina"]
        + positionOfFootabllPlayer["strength"]) / 30000;
}

function attributeOffootballPlayerDf(positionOfFootabllPlayer) {
    return (positionOfFootabllPlayer["heading"] + positionOfFootabllPlayer["marking"]
        + positionOfFootabllPlayer["tackling"] + positionOfFootabllPlayer["technique"]
        + positionOfFootabllPlayer["decisions"] + positionOfFootabllPlayer["positioning"]
        + positionOfFootabllPlayer["teamwork"] + positionOfFootabllPlayer["acceleration"]
        + positionOfFootabllPlayer["balance"] + positionOfFootabllPlayer["pace"]
        + positionOfFootabllPlayer["jumping"] + positionOfFootabllPlayer["stamina"]
        + positionOfFootabllPlayer["strength"]) / 26000;
}

function convertPositionIndex(footballPlayerIndex) {
    var positionString = "";
    if (footballPlayerIndex > 0 && footballPlayerIndex <= 20) {
        //// X-Axis.
        switch (Math.floor(footballPlayerIndex / 5) + 1) {
            case 1:
                positionString = "D";
                break;
            case 2:
                positionString = "DM";
                break;
            case 3:
                positionString = "M";
                break;
            case 4:
                positionString = "AM";
                break;
        }
        //// Y-Axis.
        switch (footballPlayerIndex % 5) {
            case 1:
                positionString = positionString + "L";
                break;
            case 0:
                positionString = positionString + "R";
                break;
            default:
                positionString = positionString + "C";
                break
        }
    } else {
        positionString = "ST";
    }
    return positionString;
}

function summarizedZone(IsHome) {
    var DL;
    var DML;
    var ML;
    var AML;
    var DR;
    var DMR;
    var MR;
    var AMR;
    var DC;
    var DMC;
    var MC;
    var AMC;
    var ST;
    var FL;
    var FR;
    var objTemp;
    var playerTemp;
    var my_calculateCA;
    if (IsHome) {
        objTemp = sumZoneHome;
        playerTemp = player1;
    } else {
        objTemp = sumZoneAway;
        playerTemp = player2;
    }
    var positionString = "";
    var footballPlayerPositionIndex;
    var footballPlayer;
    //////Loop. Everyone in teams 11 players.
    for (var indexfootballPlayer in playerTemp.squad.mySquad) {
        footballPlayer = playerTemp.squad.mySquad[indexfootballPlayer];
        footballPlayerPositionIndex = footballPlayer.positionIndex;
        /// playerTemp.squad.mySquad[indexfootballPlayer] -> user.
        my_calculateCA = playerTemp.squad.mySquad[indexfootballPlayer].status.roles[footballPlayerPositionIndex];
        //my_calculateCA = 100;
        positionString = convertPositionIndex(footballPlayerPositionIndex);
        switch (positionString) {
            ///// 20/100 percentage.
            /// case from tatic that set from client case 1 2 3 4.., use positionIndex;
            case "DL": // DL.
                DL = 0.2;
                DML = 0.1;
                ML = 0.05;
                AML = 0.03;
                DC = 0.1;
                DR = 0.03;
                DMR = 0.01;
                MR = 0.01;
                AMR = 0.01;
                DMC = 0.03;
                MC = 0.01;
                AMC = 0.01;
                ST = 0.01;
                FL = 0.01;
                FR = 0.01;
                break;

            case "DML": // DML
                DML = 0.2;
                DL = 0.1;
                DMC = 0.1;
                ML = 0.1;
                AML = 0.05
                MC = 0.03;
                DC = 0.03;
                AMC = 0.01;
                ST = 0.01;
                DR = 0.01;
                DMR = 0.03;
                MR = 0.01;
                AMR = 0.01;
                FL = 0.03;
                FR = 0.01;
                break;

            case "ML": // ML
                ML = 0.2;
                AML = 0.1;
                DML = 0.1;
                DL = 0.05;
                DC = 0.01;
                MC = 0.1;
                DMC = 0.03;
                AMC = 0.03;
                ST = 0.01;
                DR = 0.01;
                DMR = 0.01;
                MR = 0.03;
                AMR = 0.01;
                FL = 0.05;
                FR = 0.01;
                break;

            case "AML": // AML
                AML = 0.2;
                MC = 0.03;
                AMC = 0.1;
                ST = 0.03;
                ML = 0.1;
                DML = 0.05;
                DL = 0.03;
                DC = 0.01;
                DMC = 0.01;
                DR = 0.01;
                DMR = 0.01;
                MR = 0.01;
                AMR = 0.03;
                FL = 0.1;
                FR = 0.01;
                break;

            case "DR": // DR
                DR = 0.2;
                DMR = 0.1;
                MR = 0.05;
                AMR = 0.03;
                DC = 0.1;
                DMC = 0.03;
                MC = 0.01;
                AMC = 0.01;
                ST = 0.01;
                DL = 0.03;
                DML = 0.01;
                ML = 0.01;
                AML = 0.01;
                FL = 0.01;
                FR = 0.01;
                break;

            case "DMR": // DMR
                DMR = 0.2;
                DR = 0.1;
                MR = 0.1;
                AMR = 0.05
                DMC = 0.1;
                DC = 0.03;
                MC = 0.03;
                AMC = 0.1;
                DL = 0.01;
                DML = 0.03;
                ML = 0.01;
                AML = 0.01;
                ST = 0.01;
                FL = 0.01;
                FR = 0.03;
                break;

            case "MR": // MR
                MR = 0.2;
                DMR = 0.1;
                DR = 0.05;
                AMR = 0.1;
                MC = 0.1;
                DMC = 0.03;
                AMC = 0.03;
                DC = 0.01;
                ST = 0.01;
                DL = 0.01;
                DML = 0.01;
                ML = 0.03;
                AML = 0.01;
                FL = 0.01;
                FR = 0.05;
                break;

            case "AMR": // AMR
                AMR = 0.2;
                ST = 0.03;
                MC = 0.03;
                AMC = 0.1;
                MR = 0.1;
                DMR = 0.05;
                DR = 0.03;
                DMC = 0.01;
                DC = 0.01;
                DL = 0.01;
                DML = 0.01;
                ML = 0.01;
                AML = 0.03;
                FL = 0.01;
                FR = 0.1;
                break;

            case "DC": // DC
                DC = 0.2;
                DL = 0.1;
                DR = 0.1;
                DML = 0.03;
                DMR = 0.03;
                ML = 0.01;
                DMC = 0.1;
                MC = 0.05;
                AMC = 0.03;
                ST = 0.01;
                AML = 0.01;
                MR = 0.01;
                AMR = 0.01;
                FL = 0.01;
                FR = 0.01;
                break;

            case "DMC": // DMC
                DMC = 0.2;
                DML = 0.1;
                DMR = 0.1;
                DC = 0.1;
                MC = 0.1;
                DL = 0.03;
                DR = 0.03;
                ML = 0.03;
                MR = 0.03;
                AMC = 0.05;
                ST = 0.03;
                AML = 0.01;
                AMR = 0.01;
                FL = 0.01;
                FR = 0.01;
                break;

            case "MC": // MC
                MC = 0.2;
                ML = 0.1;
                MR = 0.1;
                DMC = 0.1;
                AMC = 0.1;
                DML = 0.03;
                AML = 0.03;
                DMR = 0.03;
                AMR = 0.03;
                ST = 0.05;
                DL = 0.01;
                DR = 0.01;
                DC = 0.05;
                FL = 0.01;
                FR = 0.01;
                break;

            case "AMC": // AMC
                AMC = 0.2;
                ST = 0.1;
                AML = 0.1;
                AMR = 0.1;
                MC = 0.1;
                ML = 0.03;
                MR = 0.03;
                DMC = 0.05;
                DL = 0.01;
                DR = 0.01;
                DC = 0.03;
                DML = 0.01;
                DMR = 0.01;
                FL = 0.03;
                FR = 0.03;
                break;

            case "ST": // ST
                ST = 0.2;
                AMC = 0.1;
                AML = 0.03;
                AMR = 0.03;
                MC = 0.05;
                DMC = 0.03;
                DC = 0.01;
                MR = 0.01;
                DMR = 0.01;
                DR = 0.01;
                DL = 0.01;
                DML = 0.01;
                ML = 0.01;
                FL = 0.1;
                FR = 0.1;
                break;
        }
        
        ////// solve 28 but now we have 30.
        /////// Left zone.
        objTemp.sumZoneDLAk += DL * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneDLDf += DL * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneDMLAk += DL * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneDMLDf += DML * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneMLAk += DML * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneMLDf += ML * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneAMLAk += ML * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneAMLDf += AML * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneFLAk += AML * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        ///// Right zone.
        objTemp.sumZoneDRAk += DR * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneDRDf += DR * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneDMRAk += DR * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneDMRDf += DMR * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneMRAk += DMR * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneMRDf += MR * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneAMRAk += MR * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneAMRDf += AMR * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneFRAk += AMR * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
    
        //////// Center zone.
        objTemp.sumZoneDCAk += DC * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneDCDf += DC * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneDMCAk += DMC * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneDMCDf += DMC * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneMCAk += MC * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneMCDf += MC * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneAMCAk += AMC * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneAMCDf += AMC * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);

        objTemp.sumZoneSTAk += ST * (my_calculateCA / 2 + attributeOffootballPlayerAk(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
        objTemp.sumZoneSTDf += ST * (my_calculateCA / 2 + attributeOffootballPlayerDf(footballPlayer) / 2) * myCalculateEvn(footballPlayer);
    }
}

function myCalculateEvn(footballPlayer) {
    /////// adapt -> relationships.
    /////// morale -> relationships.
    var sum_ev_point = 0;
    var relationBonuses = [
        { weigth: 300 / 1000, min: 1, max: 5 },
        { weigth: 500 / 1000, min: 3, max: 7 },
        { weigth: 750 / 1000, min: 6, max: 9 },
        { weigth: 1000 / 1000, min: 10, max: 10 }
    ];

    var relation = footballPlayer["relationship"] / 2000;
    var relation_point_rand = GetRandomRange(GetByWeigth(relation, relationBonuses));

    var moraleBonuses = [
        { weigth: 30 / 100, min: 1, max: 3 },
        { weigth: 50 / 100, min: 3, max: 5 },
        { weigth: 65 / 100, min: 5, max: 7 },
        { weigth: 80 / 100, min: 9, max: 9 },
        { weigth: 100 / 100, min: 10, max: 10 }
    ];

    var morale = footballPlayer["morale"] / 2000;
    var rating_bonus_rand = GetRandomRange(GetByWeigth(morale, moraleBonuses));

    var expPoints = [
        { weigth: 1500 / 10000, min: 1, max: 10 },
        { weigth: 2100 / 10000, min: 4, max: 10 },
        { weigth: 2800 / 10000, min: 6, max: 11 },
        { weigth: 3500 / 10000, min: 7, max: 13 },
        { weigth: 4200 / 10000, min: 8, max: 14 },
        { weigth: 4800 / 10000, min: 9, max: 15 },
        { weigth: 5400 / 10000, min: 10, max: 16 },
        { weigth: 6000 / 10000, min: 11, max: 17 },
        { weigth: 6600 / 10000, min: 12, max: 18 },
        { weigth: 7200 / 10000, min: 13, max: 19 },
        { weigth: 7800 / 10000, min: 15, max: 20 },
        { weigth: 8400 / 10000, min: 17, max: 20 },
        { weigth: 9000 / 10000, min: 18, max: 20 },
        { weigth: 9500 / 10000, min: 19, max: 20 },
        { weigth: 10000 / 10000, min: 20, max: 20 }
    ];

    var exp = footballPlayer["exp"] / 2000;
    var exp_point_rand = GetRandomRange(GetByWeigth(exp, expPoints));
    var condition, sum_ee;
    if (footballPlayer.condition > 50) {
        condition = footballPlayer.condition / 100;
    } else {
        condition = 0.5;
    }

    if (footballPlayer.condition > 93) {
        condition = 1;
    }

    if (footballPlayer.condition > 93) {
        condition = 1;
        sum_ev_point = relation_point_rand + rating_bonus_rand + exp_point_rand;
        sum_ee = (footballPlayer.determination + footballPlayer.teamwork) / 200;
        if (sum_ee > 16) {
            if (sum_ev_point < 35) {
                sum_ev_point = 35;
            }
        }
    }
    var return_rate_of_env;
    sum_ev_point = (sum_ev_point / 100) + 0.6;
    return_rate_of_env = sum_ev_point * condition;
    if (sum_ev_point < 0.3) {
        return_rate_of_env = 0.3;
    }
    return return_rate_of_env;
}

function getResultOfSummarizedZone(ballPosition, isHome, isAttack) {
    var ballPosition_Local = ballPosition;
    var zoneTemp = sumZoneHome;
    var zoneX1 = (fieldBallMinX + (1 * gridResolution));
    var zoneX2 = (fieldBallMinX + (2 * gridResolution));
    var zoneX3 = (Math.floor(fieldBallMaxX / 2));
    var zoneX4 = (fieldBallMaxX - (2 * gridResolution));
    var zoneX5 = (fieldBallMaxX - (1 * gridResolution));
    var zoneYL = 1, zoneYR = 5;

    if (!isHome) {
        zoneX1 = 6 - zoneX1;
        zoneX2 = 6 - zoneX2;
        zoneX3 = 6 - zoneX3;
        zoneX4 = 6 - zoneX4;
        zoneX5 = 6 - zoneX5;
        zoneYL = 6 - zoneYL;
        zoneYR = 6 - zoneYR;
        zoneTemp = sumZoneAway;
    }
    
    if (ballPosition_Local.x === zoneX1) {
        if (ballPosition_Local.y === zoneYL) {
            if (isAttack) {
                return zoneTemp.sumZoneDLAk;
            } else {
                return zoneTemp.sumZoneDLDf;
            }
        } else if (ballPosition_Local.y === zoneYR) {
            if (isAttack) {
                return zoneTemp.sumZoneDRAk;
            } else {
                return zoneTemp.sumZoneDRDf;
            }
        } else {
            if (isAttack) {
                return zoneTemp.sumZoneDCAk;
            } else {
                return zoneTemp.sumZoneDCDf;
            }
        }
    }
    else if (ballPosition_Local.x === zoneX2) {
        if (ballPosition_Local.y === zoneYL) {
            if (isAttack) {
                return zoneTemp.sumZoneDMLAk;
            } else {
                return zoneTemp.sumZoneDMLDf;
            }
        } else if (ballPosition_Local.y === zoneYR) {
            if (isAttack) {
                return zoneTemp.sumZoneDMRAk;
            } else {
                return zoneTemp.sumZoneDMRDf;
            }
        } else {
            if (isAttack) {
                return zoneTemp.sumZoneDMCAk;
            } else {
                return zoneTemp.sumZoneDMCDf;
            }
        }
    }
    else if (ballPosition_Local.x === zoneX3) {
        if (ballPosition_Local.y === zoneYL) {
            if (isAttack) {
                return zoneTemp.sumZoneMLAk;
            } else {
                return zoneTemp.sumZoneMLDf;
            }
        } else if (ballPosition_Local.y === zoneYR) {
            if (isAttack) {
                return zoneTemp.sumZoneMRAk;
            } else {
                return zoneTemp.sumZoneMRDf;
            }
        } else {
            if (isAttack) {
                return zoneTemp.sumZoneMCAk;
            } else {
                return zoneTemp.sumZoneMCDf;
            }
        }
    }
    else if (ballPosition_Local.x === zoneX4) {
        if (ballPosition_Local.y === zoneYL) {
            if (isAttack) {
                return zoneTemp.sumZoneAMLAk;
            } else {
                return zoneTemp.sumZoneAMLDf;
            }
        } else if (ballPosition_Local.y === zoneYR) {
            if (isAttack) {
                return zoneTemp.sumZoneAMRAk;
            } else {
                return zoneTemp.sumZoneAMRDf;
            }
        } else {
            if (isAttack) {
                return zoneTemp.sumZoneAMCAk;
            } else {
                return zoneTemp.sumZoneAMCDf;
            }
        }
    }
    else if (ballPosition_Local.x === zoneX5) {
        if (ballPosition_Local.y === zoneYL) {
            if (isAttack) {
                return zoneTemp.sumZoneFLAk;
            } else {
                return zoneTemp.sumZoneSTDf;
            }
        } else if (ballPosition_Local.y === zoneYR) {
            if (isAttack) {
                return zoneTemp.sumZoneFRAk;
            } else {
                return zoneTemp.sumZoneSTDf;
            }
        } else {
            if (isAttack) {
                return zoneTemp.sumZoneSTAk;
            } else {
                return zoneTemp.sumZoneSTDf;
            }
        }
    }
}

function resultOfHomeOverAllZone() {
    //return sumZoneHome;
    return 0.5;
}

function resultOfAwayOverAllZone() {
    //return sumZoneAway;
    return 0.5;
}

function getSquadDataGoalKeeper(ballPossessionHome) {
    var goalKeeperUuid;
    var playerTemp;
    if (ballPossessionHome) {
        playerTemp = player1;
        goalKeeperUuid = footballPlayersPositionArrayHome[0].squadUid;
    } else {
        playerTemp = player2;
        goalKeeperUuid = footballPlayersPositionArrayAway[0].squadUid;
    }
    for (var footballPlayerIndex in playerTemp.squad.mySquad) {
        if (playerTemp.squad.mySquad[footballPlayerIndex].squadUid === goalKeeperUuid) {
            return playerTemp.squad.mySquad[footballPlayerIndex];
        }
    }
}

function distanceBetweenBallandfootballPlayers(ballPosition, ballPossessionHome) {
    var min = 999;
    var footballPlayerPossessing = 0;
    var distance = 0;
    var sum = 0;
    var powedX = 0;
    var powedY = 0;
    var fieldTemp = [];
    if (ballPossessionHome) {
        fieldTemp = footballPlayersPositionArrayHome;
    } else {
        fieldTemp = footballPlayersPositionArrayAway;
    }

    for (var index = 0; index < 11; index++) {
        powedX = Math.pow((ballPosition.x - fieldTemp[index].x), 2);
        powedY = Math.pow((ballPosition.y - fieldTemp[index].y), 2);
        sum = powedX + powedY;
        distance = Math.sqrt(sum);
        if (min > distance) {
            footballPlayerPossessing = fieldTemp[index].squadUid;
            min = distance;
        }
    }
    return footballPlayerPossessing;
}

/* P`Ko calculateCA reference.
function calculateCA(footballPlayer, footballPlayerPosition) {
    var positionOfFootabllPlayer = footballPlayerPosition;
    var corner = footballPlayer["corner"];
    var freeKick = footballPlayer["freekick"];
    var penaltyTaking = footballPlayer["penaltyTaking"];
    var crossing = footballPlayer["crossing"];
    var dribbling = footballPlayer["dribbling"];
    var finishing = footballPlayer["finishing"];
    var longShorts = footballPlayer["longShorts"];
    var marking = footballPlayer["marking"];
    var tackling = footballPlayer["tackling"];
    var heading = footballPlayer["heading"];
    var technique = footballPlayer["technique"];
    var aggression = footballPlayer["aggression"];
    var flair = footballPlayer["flair"];
    var decisions = footballPlayer["decisions"];
    var determination = footballPlayer["determination"];
    var positioning = footballPlayer["positioning"];
    var offTheBall = footballPlayer["offTheBall"];
    var teamwork = footballPlayer["teamwork"];
    var acceleration = footballPlayer["acceleration"];
    var agility = footballPlayer["agility"];
    var balance = footballPlayer["balance"];
    var jumping = footballPlayer["jumping"];
    var pace = footballPlayer["pace"];
    var stamina = footballPlayer["stamina"];
    var strenght = footballPlayer["strenght"];
    var handling = footballPlayer["handling"];
    var reflex = footballPlayer["reflex"];
    var rushingOut = footballPlayer["rushingOut"];
    var kicking = footballPlayer["kicking"];
    var oneOnOnes = footballPlayer["oneOnOnes"];
    var aerialAbility = footballPlayer["aerialAbility"];
    var passing = footballPlayer["passing"];
    var firstTouch = footballPlayer["firstTouch"];
    var footballPlayerPositionCA = 0;
    var percentage_ca;
    var sum_ta;
    var sum_tb;
    var sum_tc;

    if (positionOfFootabllPlayer.x === 0 && positionOfFootabllPlayer.y === 3) {
        sum_ta = handling + rushingOut; ///base of all attribute 4000
        sum_tb = kicking + oneOnOnes + aerialAbility + positioning + jumping + decisions + teamwork; ///base of all attribute 14000
        percentage_ca = (((sum_ta * 5) + (sum_tb * 2)) / 48000) * 100;
        footballPlayerPositionCA = percentage_ca;
    }
    /////////$pos_skill==41||$pos_skill==42||$pos_skill==43
    else if (positionOfFootabllPlayer.x === 1 && positionOfFootabllPlayer.y === 2 ||
        positionOfFootabllPlayer.x === 1 && positionOfFootabllPlayer.y === 3 ||
        positionOfFootabllPlayer.x === 1 && positionOfFootabllPlayer.y === 4) {
        sum_ta = heading + marking + strenght; ////// base of all attribute 2000 + 2000 + 2000 = 6000
        sum_tb = positioning + decisions + passing + teamwork + acceleration + balance + jumping + pace + stamina + technique; /////// base of all attribute 20000.
        sum_tc = corner + freeKick + penaltyTaking + crossing + dribbling + finishing + longShorts + flair + offTheBall + agility; /////// base of all attribute 20000.
        percentage_ca = (((tackling * 6) + (sum_ta * 4) + (sum_tb * 2) + sum_tc) / 96000) * 100;
        footballPlayerPositionCA = percentage_ca;
    }
    //////////// $pos_skill==40||$pos_skill==44||$pos_skill==30||$pos_skill==34
    else if (positionOfFootabllPlayer.x === 1 && positionOfFootabllPlayer.y === 1 ||
        positionOfFootabllPlayer.x === 1 && positionOfFootabllPlayer.y === 5 ||
        positionOfFootabllPlayer.x === 2 && positionOfFootabllPlayer.y === 1 ||
        positionOfFootabllPlayer.x === 2 && positionOfFootabllPlayer.y === 5) {
        sum_ta = pace + marking + strenght; ////// base of all attribute 2000 + 2000 + 2000 = 6000
        sum_tb = dribbling + crossing + passing + positioning + teamwork + acceleration + balance + stamina + agility + technique; /////// base of all attribute 20000.
        sum_tc = corner + freeKick + penaltyTaking + finishing + longShorts + heading + flair + decisions + offTheBall + jumping; /////// base of all attribute 20000.
        percentage_ca = (((tackling * 6) + (sum_ta * 4) + (sum_tb * 2) + sum_tc) / 96000) * 100;
        footballPlayerPositionCA = percentage_ca;
    }
    ////// ($pos_skill==31||$pos_skill==32||$pos_skill==33)
    else if (positionOfFootabllPlayer.x === 2 && positionOfFootabllPlayer.y === 2 ||
        positionOfFootabllPlayer.x === 2 && positionOfFootabllPlayer.y === 3 ||
        positionOfFootabllPlayer.x === 2 && positionOfFootabllPlayer.y === 4) {
        sum_ta = tackling + decisions + marking + strenght; ////// base of all attribute 8000
        sum_tb = positioning + passing + heading + acceleration + agility + balance + pace + stamina + technique + teamwork; ////// base of all attribute 20000.
        sum_tc = corner + freeKick + penaltyTaking + crossing + dribbling + finishing + longShorts + determination + flair + offTheBall + aggression + jumping; ////// base of all attribute 24000.
        percentage_ca = (((sum_ta * 4) + (sum_tb * 2) + sum_tc) / 96000) * 100; 
        footballPlayerPositionCA = percentage_ca;

    }
    /////// ($pos_skill==21||$pos_skill==22||$pos_skill==23)
    else if (positionOfFootabllPlayer.x === 3 && positionOfFootabllPlayer.y === 2 ||
        positionOfFootabllPlayer.x === 3 && positionOfFootabllPlayer.y === 3 ||
        positionOfFootabllPlayer.x === 3 && positionOfFootabllPlayer.y === 4) {
        sum_ta = tackling + technique + positioning; ///// base of all attribute 6000
        sum_tb = longShorts + dribbling + decisions + heading + flair + strenght + balance + agility + acceleration + stamina; ///// base of all attribute 20000
        sum_tc = corner + freeKick + penaltyTaking + crossing + finishing + marking + offTheBall + teamwork + jumping + pace; ///// base of all attribute 20000
        percentage_ca = (((passing * 6) + (sum_ta * 4) + (sum_tb * 2) + sum_tc) / 96000) * 100;
        footballPlayerPositionCA = percentage_ca;

    }
    ////// else if($pos_skill==11||$pos_skill==12||$pos_skill==13)
    else if (positionOfFootabllPlayer.x === 4 && positionOfFootabllPlayer.y === 2 ||
        positionOfFootabllPlayer.x === 4 && positionOfFootabllPlayer.y === 3 ||
        positionOfFootabllPlayer.x === 4 && positionOfFootabllPlayer.y === 4) {
        sum_ta = flair + technique + dribbling; ///// base of all attribute 6000
        sum_tb = offTheBall + longShorts + finishing + crossing + acceleration + balance + agility + pace + stamina + strenght; ///// base of all attribute 20000
        sum_tc = corner + freeKick + penaltyTaking + marking + tackling + heading + decisions + positioning + teamwork + jumping; ///// base of all attribute 20000
        percentage_ca = (((passing * 6) + (sum_ta * 4) + (sum_tb * 2) + sum_tc) / 96000) * 100;
        footballPlayerPositionCA = percentage_ca;
    }
    ////// $pos_skill==20||$pos_skill==24||$pos_skill==10||$pos_skill==14||$pos_skill==0||$pos_skill==4)
    else if (positionOfFootabllPlayer.x === 3 && positionOfFootabllPlayer.y === 1 ||
        positionOfFootabllPlayer.x === 3 && positionOfFootabllPlayer.y === 5 ||
        positionOfFootabllPlayer.x === 4 && positionOfFootabllPlayer.y === 1 ||
        positionOfFootabllPlayer.x === 4 && positionOfFootabllPlayer.y === 5) {
        sum_ta = dribbling + crossing + passing + reflex + technique + acceleration; ///// base of all attribute 12000
        sum_tb = positioning + longShorts + offTheBall + agility + balance + stamina + strenght + flair; ///// base of all attribute 16000
        sum_tc = corner + freeKick + penaltyTaking + finishing + marking + tackling + heading + decisions + teamwork + jumping; ///// base of all attribute 20000
        percentage_ca = (((sum_ta * 4) + (sum_tb * 2) + sum_tc) / 100000) * 100;
        footballPlayerPositionCA = percentage_ca;
    }
    /////// $pos_skill==1||$pos_skill==2||$pos_skill==3
    else if (positionOfFootabllPlayer.x === 5 && positionOfFootabllPlayer.y === 2 ||
        positionOfFootabllPlayer.x === 5 && positionOfFootabllPlayer.y === 3 ||
        positionOfFootabllPlayer.x === 5 && positionOfFootabllPlayer.y === 4) {
        sum_ta = heading + dribbling + firstTouch;
        sum_tb = acceleration + agility + balance + strenght + offTheBall + technique + passing + jumping + stamina + longShorts;
        sum_tc = corner + freeKick + penaltyTaking + crossing + marking + tackling + flair + decisions + positioning + teamwork;
        percentage_ca = (((finishing * 6) + (sum_ta * 4) + (sum_tb * 2) + sum_tc) / 96000) * 100;
        footballPlayerPositionCA = percentage_ca;
    }
    return footballPlayerPositionCA;
}
*/

module.exports = {
    createfootballPlayersPosition: createfootballPlayersPosition,
    getFieldHome: getFieldHome,
    getFieldAway: getFieldAway,
    resultOfHomeOverAllZone: resultOfHomeOverAllZone,
    resultOfAwayOverAllZone: resultOfAwayOverAllZone,
    distanceBetweenBallandfootballPlayers: distanceBetweenBallandfootballPlayers,
    getSquadDataFromField: getSquadDataFromField,
    getSquadDataGoalKeeper: getSquadDataGoalKeeper,
    fieldBallMaxX: fieldBallMaxX,
    fieldBallMinX: fieldBallMinX,
    fieldBallMaxY: fieldBallMaxY,
    fieldBallMinY: fieldBallMinY,
    gridResolution: gridResolution,
    footballRunningInField: footballRunningInField,
    summarizedZone: summarizedZone,
    getResultOfSummarizedZone: getResultOfSummarizedZone
};
