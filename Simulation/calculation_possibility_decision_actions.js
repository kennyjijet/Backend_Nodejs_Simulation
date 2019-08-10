var soccer_field_gen = require('./soccer_field_generator.js');
var getComparison = require('./comparison.js');
//var fieldFootball = new Array(6);
//var fieldFootballHome = new Array([]);
//var fieldFootballAway = new Array([]);
//var fieldFootball = new Array([]);
var fieldFootballHome = [];
var fieldFootballAway = [];
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

var heightBonus = 0;
var diffOfHeight = 0;
var debug = true;
function decisionMoveBallDirection(ballPosition, actionType, ballPossessionHome) {

    var tactics = ballPossessionHome ? tacticsHome : tacticsAway;

    var moveBallLRChance = [
        [0.35, 0.65],
        [0.4, 0.6],
        [0.8, 0.9],
        [0.1, 0.9],
        [0.1, 0.9],
    ];

    var moveBallFBChance = [
        [0.1, 0.5],
        [0.1, 0.2],
        [0.1, 0.3],
        [0.3, 0.7],
        [0.7, 0.9],
        [0.9, 1.0],
        [1.0, 1.0]
    ];

    var lrChance = moveBallLRChance[tactics.focusPassing];
    var fbChance = moveBallFBChance[tactics.focusPassing];

    var randomChanceLCR = (Math.random() * (1));
    var randomChanceFSB = (Math.random() * (1));

    var zoneDistance = zoneDistanceFunction(actionType, tactics);
    if (randomChanceLCR < lrChance[0])
        ballPosition.y -= zoneDistance;
    else if (randomChanceLCR > lrChance[1])
        ballPosition.y += zoneDistance;

    if (randomChanceFSB < fbChance[0])
        ballPosition.x += zoneDistance;
    else if (randomChanceFSB > fbChance[1])
        ballPosition.x -= zoneDistance;
        
    return ballPosition;
}

function zoneDistanceFunction(actionType, tactics) {
    var counterWeight = 0.85;
    if (tactics.forceCounterattack && Math.random() >= counterWeight)
        return 3;

    switch (actionType) {
        case "dribble":
        case "pass_short":
            return 1;

        case "pass_long":
        case "pass_through":
        case "crossing_low":
        case "crossing_high":
            return 2;
    }
    return 0;
}

function decisionPassingByTactics(tactics) {
    var chanceStyles = [0.3, 0.5, 0.7];
    var chance = chanceStyles[tactics.passingStyle];
    return Math.random() < chance ? "pass_short" : "pass_long";
}

function decisionCrossingByTactics(tactics) {
    var chanceStyles = [0.3, 0.5, 0.7];
    var chance = chanceStyles[tactics.crossingStyle];
    return Math.random() < chance ? "crossing_low" : "crossing_high";
}

function decisionDribbleAndPassThrough() {
    var dribbleWeight = 0.5;
    return Math.random() < dribbleWeight ? "pass_through" : "dribble";
}

////// Axis
function distanceTotheGoal(ballPosition, ballPossessionHome) {
    var currentBallPosition = ballPosition;
    //Distance to the goal, Distance to the ball, Is the ball in the air.
    //var currentBallPosition = {"x" : 5, "y" : 4};
    var goalDistanceX, goalDistanceY;
    if (ballPossessionHome) {
        goalDistanceX = 6;
        goalDistanceY = 3;
    } else {
        goalDistanceX = 0;
        goalDistanceY = 3;
    }
    var distanceX = Math.pow(goalDistanceX - currentBallPosition.x, 2);
    var distanceY = Math.pow(goalDistanceY - currentBallPosition.y, 2);
    var distance = Math.sqrt(distanceX + distanceY);
    return distance / 10;
}

function GKdefendingTheBall(ballPosition, previousBallPosition, ballPossessionHome, actionType, footballPlayerAttacker, footballPlayerDefender) {
    var listSkillAttacker;
    var listSkillDefender;
    var attacker = 0;
    var defender = 0;
    var comparedAttakerAndDefender;
    if (actionType === "ball_to_gk_shoot") {
        listSkillAttacker = {
            finishing: footballPlayerAttacker.finishing,
            dribbling: footballPlayerAttacker.dribbling,
            technique: footballPlayerAttacker.technique,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerAttacker.pace,
            strenght: footballPlayerAttacker.strenght
        };
        listSkillDefender = {
            handling: footballPlayerDefender.handling,
            reflex: footballPlayerDefender.reflex,
            positioning: footballPlayerDefender.positioning,
            jumping: footballPlayerDefender.jumping,
            decision: footballPlayerDefender.decision,
            oneOnOnes: footballPlayerDefender.oneOnOnes,
            rushingOut: footballPlayerDefender.rushingOut,
            aerialAbility: footballPlayerDefender.aerialAbility
        };
        ///// Calculate Attribute between Shooter vs GoalKeeper only.
        if (debug) {
            attacker = getComparison.attackingCalculation(listSkillAttacker);
            defender = getComparison.defendingCalculation(listSkillDefender);
        } else {
            attacker = getComparison.attackingBallToGkShootCalculation(listSkillAttacker);
            defender = getComparison.defendingBallToGkShootCalculation(listSkillDefender);
        }
        comparedAttakerAndDefender = attacker - defender;
        return getComparison.ballToGkShootSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    }

    else if (actionType === "ball_to_gk_head") {
        listSkillAttacker = {
            heading: footballPlayerAttacker.heading,
            technique: footballPlayerAttacker.technique,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.acceleration,
            jumping: footballPlayerDefender.jumping,
            balance: footballPlayerAttacker.balance,
            strenght: footballPlayerAttacker.strenght,
        };

        listSkillDefender = {
            handling: footballPlayerDefender.handling,
            reflex: footballPlayerDefender.reflex,
            positioning: footballPlayerDefender.positioning,
            jumping: footballPlayerDefender.jumping,
            decision: footballPlayerDefender.decision,
            oneOnOnes: footballPlayerDefender.oneOnOnes,
            rushingOut: footballPlayerDefender.rushingOut,
            aerialAbility: footballPlayerDefender.aerialAbility,
        };
            
        ///////////////// Height
        heightBonus = 0;
        diffOfHeight = footballPlayerAttacker.height - footballPlayerDefender.height;
        if (diffOfHeight > 15) { 
            //// Attacker height bonus.
            heightBonus = 0.15;
        } else if (diffOfHeight < -15) { 
            //// Defender height bonus.
            heightBonus = -0.15;
        } else {
            heightBonus = diffOfHeight / 100;
        }
         
        ///// Calculate Attribute between Shooter vs GoalKeeper only.
        if (debug) {
            attacker = getComparison.attackingCalculation(listSkillAttacker);
            defender = getComparison.defendingCalculation(listSkillDefender);
        } else {
            attacker = getComparison.attackingBallToGkHeadCalculation(listSkillAttacker);
            defender = getComparison.defendingBallToGkHeadCalculation(listSkillDefender);
        }
        comparedAttakerAndDefender = (attacker + heightBonus) - defender;
        return getComparison.ballToGkHeadSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    }

    else if (actionType === "ball_to_gk_charge") {
        listSkillAttacker = {
            finishing: footballPlayerAttacker.finishing,
            firstTouch: footballPlayerAttacker.firstTouch,
            heading: footballPlayerAttacker.heading,
            technique: footballPlayerAttacker.technique,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerDefender.agility,
            balance: footballPlayerAttacker.balance,
            strenght: footballPlayerAttacker.strenght,
        };

        listSkillDefender = {
            handling: footballPlayerDefender.handling,
            reflex: footballPlayerDefender.reflex,
            positioning: footballPlayerDefender.positioning,
            jumping: footballPlayerDefender.jumping,
            decision: footballPlayerDefender.decision,
            oneOnOnes: footballPlayerDefender.oneOnOnes,
            rushingOut: footballPlayerDefender.rushingOut,
            aerialAbility: footballPlayerDefender.aerialAbility,
        };
        
        ///////////////// Height
        heightBonus = 0;
        diffOfHeight = footballPlayerAttacker.height - footballPlayerDefender.height;
        if (diffOfHeight > 15) { 
            //// Attacker height bonus.
            heightBonus = 0.15;
        } else if (diffOfHeight < -15) { 
            //// Defender height bonus.
            heightBonus = 0.15;
        } else {
            heightBonus = diffOfHeight / 100;
        } 
        
        ///// Calculate Attribute between Shooter vs GoalKeeper only.
        if (debug) {
            attacker = getComparison.attackingCalculation(listSkillAttacker);
            defender = getComparison.defendingCalculation(listSkillDefender);
        } else {
            attacker = getComparison.attackingBallToGkChargeCalculation(listSkillAttacker);
            defender = getComparison.defendingBallToGkChargeCalculation(listSkillDefender);
        }
        comparedAttakerAndDefender = (attacker + heightBonus) - defender;
        return getComparison.ballToGkChargeSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    }

    else if (actionType === "ball_to_gk_long_shoot") {

        listSkillAttacker = {
            dribbling: footballPlayerAttacker.dribbling,
            longShorts: footballPlayerAttacker.longShorts,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.technique,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerDefender.pace,
            strenght: footballPlayerAttacker.strenght
        };

        listSkillDefender = {
            handling: footballPlayerDefender.handling,
            reflex: footballPlayerDefender.reflex,
            positioning: footballPlayerDefender.positioning,
            jumping: footballPlayerDefender.jumping,
            decision: footballPlayerDefender.decision,
            oneOnOnes: footballPlayerDefender.oneOnOnes,
            rushingOut: footballPlayerDefender.rushingOut,
            aerialAbility: footballPlayerDefender.aerialAbility
        };
        ///// Calculate Attribute between Shooter vs GoalKeeper only.
        if (debug) {
            attacker = getComparison.attackingCalculation(listSkillAttacker);
            defender = getComparison.defendingCalculation(listSkillDefender);
        } else {
            attacker = getComparison.attackingBallToGkLongShootCalculation(listSkillAttacker);
            defender = getComparison.defendingBallToGkLongShootCalculation(listSkillDefender);
        }
        comparedAttakerAndDefender = attacker - defender;
        return getComparison.ballToGkLongShootSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    }
    else if (actionType === "ball_to_gk_one_on_one") {
        listSkillAttacker = {
            finishing: footballPlayerAttacker.finishing,
            firstTouch: footballPlayerAttacker.firstTouch,
            dribbling: footballPlayerAttacker.dribbling,
            technique: footballPlayerAttacker.technique,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerDefender.agility,
            balance: footballPlayerAttacker.balance,
            strenght: footballPlayerAttacker.strenght
        };
        listSkillDefender = {
            handling: footballPlayerDefender.handling,
            reflex: footballPlayerDefender.reflex,
            positioning: footballPlayerDefender.positioning,
            oneOnOnes: footballPlayerDefender.oneOnOnes
        };
        ///// Calculate Attribute between Shooter vs GoalKeeper only.
        if (debug) {
            attacker = getComparison.attackingCalculation(listSkillAttacker);
            defender = getComparison.defendingCalculation(listSkillDefender);
        } else {
            attacker = getComparison.attackingBallToGkOneOnOneCalculation(listSkillAttacker);
            defender = getComparison.defendingBallToGkOneOnOneCalculation(listSkillDefender);
        }
        comparedAttakerAndDefender = attacker - defender;

        return getComparison.ballToGkoneOnOnesuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    }
    else if (actionType === "ball_to_gk_freekick") {

        listSkillAttacker = {
            freekick: footballPlayerAttacker.freekick,
            finishing: footballPlayerAttacker.finishing,
            longShorts: footballPlayerAttacker.longShorts,

        };

        listSkillDefender = {

            handling: footballPlayerDefender.handling,
            reflex: footballPlayerDefender.reflex,
            positioning: footballPlayerDefender.positioning,
            jumping: footballPlayerDefender.jumping,
            decision: footballPlayerDefender.decision,
            oneOnOnes: footballPlayerDefender.oneOnOnes,
            rushingOut: footballPlayerDefender.rushingOut,
            aerialAbility: footballPlayerDefender.aerialAbility
        };
        
        ///// Calculate Attribute between Shooter vs GoalKeeper only.
        if (debug) {
            attacker = getComparison.attackingCalculation(listSkillAttacker);
            defender = getComparison.defendingCalculation(listSkillDefender);
        } else {
            attacker = getComparison.attackingBallToGkFreeKickCalculation(listSkillAttacker);
            defender = getComparison.defendingBallToGkFreeKickCalculation(listSkillDefender);
        }
        comparedAttakerAndDefender = attacker - defender;
        return getComparison.ballToGkFreeKickSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    }

    else if (actionType === "ball_to_gk_penaltykick") {

        listSkillAttacker = {
            penaltyTaking: footballPlayerAttacker.penaltyTaking,
            finishing: footballPlayerAttacker.finishing,
            longShorts: footballPlayerAttacker.longShorts

        };

        listSkillDefender = {
            oneOnOnes: footballPlayerDefender.oneOnOnes,
            handling: footballPlayerDefender.handling,
            reflex: footballPlayerDefender.reflex,
            positioning: footballPlayerDefender.positioning
        };
            
        ///// Calculate Attribute between Shooter vs GoalKeeper only.
        if (debug) {
            attacker = getComparison.attackingCalculation(listSkillAttacker);
            defender = getComparison.defendingCalculation(listSkillDefender);
        } else {
            attacker = getComparison.attackingBallToGkPenaltyKickCalculation(listSkillAttacker);
            defender = getComparison.defendingBallToGkPenaltyKickCalculation(listSkillDefender);
        }
        comparedAttakerAndDefender = attacker - defender;
        return getComparison.ballToGkPenaltyKickSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);

    } else {
        ///////////// Problem with actionType. 
        return null;
    }
}

function defendingTheBall(ballPosition, previousBallPosition, ballPossessionHome, actionType, footballPlayerAttacker, footballPlayerDefender) {
    var listSkillAttacker;
    var listSkillDefender;
    var attacker;
    var defender;
    var comparedAttakerAndDefender;
    if (actionType === "pass_short") {
        listSkillAttacker = {
            passing: footballPlayerAttacker.passing,
            technique: footballPlayerAttacker.technique,
            flair: footballPlayerAttacker.flair,
            offTheBall: footballPlayerAttacker.offTheBall,
            teamwork: footballPlayerAttacker.teamwork,
        };

        listSkillDefender = {
            marking: footballPlayerDefender.marking,
            positioning: footballPlayerDefender.positioning,
            decisions: footballPlayerDefender.decisions,
            passing: footballPlayerDefender.passing
        };
        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingPassShortCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingPassShortCalculation(listSkillDefender);
            }
        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingPassShortCalculation(listSkillAttacker)
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, false) + getComparison.defendingPassShortCalculation(listSkillDefender);
            }
        }
        comparedAttakerAndDefender = attacker - defender;
        //console.log("comparedAttakerAndDefender" + comparedAttakerAndDefender);
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        //console.log("success" + getComparison.passShortSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender));
        return getComparison.passShortSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    } else if (actionType === "pass_long") {
        listSkillAttacker = {
            flair: footballPlayerAttacker.flair,
            offTheBall: footballPlayerAttacker.offTheBall,
            dribbling: footballPlayerAttacker.dribbling,
            teamwork: footballPlayerAttacker.teamwork,
            technique: footballPlayerAttacker.technique,
            crossing: footballPlayerAttacker.crossing,
        };

        listSkillDefender = {
            positioning: footballPlayerDefender.positioning,
            markling: footballPlayerDefender.markling,
            passing: footballPlayerDefender.passing,
            tackling: footballPlayerDefender.tackling,
            decision: footballPlayerDefender.decision,
        };
            
        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingPassLongCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingPassLongCalculation(listSkillDefender);
            }

        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingPassLongCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingPassLongCalculation(listSkillDefender);
            }

        }
        comparedAttakerAndDefender = attacker - defender;
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        return getComparison.passLongSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    } else if (actionType === "pass_through") {
        listSkillAttacker = {
            passing: footballPlayerAttacker.passing,
            technique: footballPlayerAttacker.technique,
            flair: footballPlayerAttacker.flair,
            teamwork: footballPlayerAttacker.teamwork,
            offTheBall: footballPlayerAttacker.offTheBall
        };

        listSkillDefender = {
            marking: footballPlayerDefender.marking,
            tackling: footballPlayerDefender.tackling,
            decisions: footballPlayerDefender.decisions,
            positioning: footballPlayerDefender.positioning
        };
        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingPassThroughCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingPassThroughCalculation(listSkillDefender);
            }
        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingPassThroughCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingPassThroughCalculation(listSkillDefender);
            }
        }
        comparedAttakerAndDefender = attacker - defender;
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        return getComparison.passThroughSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    } else if (actionType === "crossing_low") {
        listSkillAttacker = {

            crossing: footballPlayerAttacker.crossing,
            dribbling: footballPlayerAttacker.dribbling,
            passing: footballPlayerAttacker.passing,
            technique: footballPlayerAttacker.technique,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerAttacker.pace,
            strenght: footballPlayerAttacker.strenght
        };

        listSkillDefender = {
            marking: footballPlayerDefender.marking,
            tackling: footballPlayerDefender.tackling,
            decision: footballPlayerDefender.decisions,
            positioning: footballPlayerDefender.positioning,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerAttacker.pace,
            strenght: footballPlayerAttacker.strenght
        };
        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingCrossingLowCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingCrossingLowCalculation(listSkillDefender);
            }

        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingCrossingLowCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingCrossingLowCalculation(listSkillDefender);
            }
        }
        comparedAttakerAndDefender = attacker - defender;
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        return getComparison.crossingLowSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    }
    else if (actionType === "crossing_high") {
        listSkillAttacker = {
            crossing: footballPlayerAttacker.crossing,
            dribbling: footballPlayerAttacker.dribbling,
            technique: footballPlayerAttacker.technique,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerAttacker.pace,
            strenght: footballPlayerAttacker.strenght
        };

        listSkillDefender = {
            marking: footballPlayerDefender.marking,
            tackling: footballPlayerDefender.tackling,
            decision: footballPlayerDefender.decisions,
            positioning: footballPlayerDefender.positioning,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerAttacker.pace,
            strenght: footballPlayerAttacker.strenght
        };

        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingCrossingHighCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingCrossingHighCalculation(listSkillDefender);
            }

        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingCrossingHighCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingCrossingHighCalculation(listSkillDefender);
            }
        }
        comparedAttakerAndDefender = attacker - defender;
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        return getComparison.crossingHighSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);

    } else if (actionType === "dribble") {
        listSkillAttacker = {
            dribbling: footballPlayerAttacker.dribbling,
            technique: footballPlayerAttacker.technique,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerAttacker.pace,
            strenght: footballPlayerAttacker.strenght
        };

        listSkillDefender = {
            marking: footballPlayerDefender.marking,
            tackling: footballPlayerDefender.tackling,
            decision: footballPlayerDefender.decisions,
            acceleration: footballPlayerDefender.acceleration,
            balance: footballPlayerDefender.balance,
            strenght: footballPlayerDefender.strength
        };
        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingDribblingCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingDribblingCalculation(listSkillDefender);
            }

        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingDribblingCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingDribblingCalculation(listSkillDefender);
            }
        }
        comparedAttakerAndDefender = attacker - defender;
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        return getComparison.dribbleSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    } else if (actionType === "try_to_shoot") {

        listSkillAttacker = {
            dribbling: footballPlayerAttacker.dribbling,
            technique: footballPlayerAttacker.technique,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerAttacker.pace,
            strenght: footballPlayerAttacker.strenght
        };

        listSkillDefender = {
            marking: footballPlayerDefender.marking,
            tackling: footballPlayerDefender.tackling,
            decision: footballPlayerDefender.decisions,
            positioning: footballPlayerDefender.positioning,
            balance: footballPlayerDefender.balance,
            strength: footballPlayerDefender.strength
        };

        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingTryToShootCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingTryToShootCalculation(listSkillDefender);
            }

        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingTryToShootCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingTryToShootCalculation(listSkillDefender);
            }
        }
        comparedAttakerAndDefender = attacker - defender;
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        return getComparison.tryToshootSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);

    } else if (actionType === "try_to_shoot_head") {

        listSkillAttacker = {
            firstTouch: footballPlayerAttacker.firstTouch,
            heading: footballPlayerAttacker.heading,
            technique: footballPlayerAttacker.technique,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            jumping: footballPlayerAttacker.jumping,
            strenght: footballPlayerAttacker.strenght,
        };

        listSkillDefender = {
            marking: footballPlayerDefender.marking,
            heading: footballPlayerDefender.heading,
            positioning: footballPlayerDefender.positioning,
            balance: footballPlayerDefender.balance,
            jumping: footballPlayerDefender.jumping,
            strength: footballPlayerDefender.strength,
        };
        
        ///////////////// Height
        heightBonus = 0;
        diffOfHeight = footballPlayerAttacker.height - footballPlayerDefender.height;
        if (diffOfHeight > 15) { 
            //// Attacker height bonus.
            heightBonus = 0.15;
        } else if (diffOfHeight < -15) { 
            //// Defender height bonus.
            heightBonus = 0.15;
        } else {
            heightBonus = diffOfHeight / 100;
        } 
        
        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingTryToShootHeadCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingTryToShootHeadCalculation(listSkillDefender);
            }

        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingTryToShootHeadCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingTryToShootHeadCalculation(listSkillDefender);
            }
        }
        comparedAttakerAndDefender = (attacker + heightBonus) - defender;
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        return getComparison.tryToShootHeadSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);

    } else if (actionType === "try_to_shoot_charge") {
        listSkillAttacker = {
            firstTouch: footballPlayerAttacker.firstTouch,
            technique: footballPlayerAttacker.technique,
            offTheBall: footballPlayerAttacker.offTheBall,
            acceleration: footballPlayerAttacker.acceleration,
            agility: footballPlayerAttacker.agility,
            balance: footballPlayerAttacker.balance,
            pace: footballPlayerAttacker.pace,
            strenght: footballPlayerAttacker.strenght
        };
        listSkillDefender = {
            marking: footballPlayerDefender.marking,
            tackling: footballPlayerDefender.tackling,
            positioning: footballPlayerDefender.positioning,
            acceleration: footballPlayerDefender.acceleration,
            balance: footballPlayerDefender.balance,
            strength: footballPlayerDefender.strength
        };
        ////// First 50%
        ////// second 50%
        if (ballPossessionHome) {
            //////attacker Home first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Away first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, true, true) + getComparison.attackingTryToShootChargeCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingTryToShootChargeCalculation(listSkillDefender);
            }

        } else {
            //////attacker Away first 50% + getComparison.attackingPassShortCalculation(listSkillAttacker) second 50%;
            //////defender Home first 50% + getComparison.defendingPassShortCalculation(listSkillDefender) second 50%;
            if (debug) {
                attacker = soccer_field_gen.resultOfHomeOverAllZone() + getComparison.attackingCalculation(listSkillAttacker);
                defender = soccer_field_gen.resultOfAwayOverAllZone() + getComparison.defendingCalculation(listSkillDefender);
            } else {
                //// getResultOfSummarizedZone(ballPosition, isHome, isAttack);
                attacker = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, true) + getComparison.attackingTryToShootChargeCalculation(listSkillAttacker);
                defender = soccer_field_gen.getResultOfSummarizedZone(ballPosition, false, false) + getComparison.defendingTryToShootChargeCalculation(listSkillDefender);
            }
        }
        comparedAttakerAndDefender = attacker - defender;
        /*
              diffBetweenTwoPlayer = (Home first 50% +  second 50%) - (Away 50% + second 50%);
        */
        return getComparison.tryToShootChargeSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender);
    }
    else { 
        ///////////// Problem with actionType. 
        return null;
    }
}

function defendWithOffSideTrap(ballPosition, ballPossessionHome, actionType, footballPlayerAttacker, footballPlayerDefender) {

    var skillCompare = 0;
    var listSkillAttacker;
    var listSkillDefender;
    if (actionType === "break_offside_trap") {
        listSkillAttacker = {
            offTheBall: footballPlayerAttacker.offTheBall,
            teamwork: footballPlayerAttacker.teamwork,
            acceleration: footballPlayerAttacker.acceleration,
            pace: footballPlayerAttacker.pace
        };
        listSkillDefender = {
            decision: footballPlayerDefender.decision,
            positioning: footballPlayerDefender.positioning,
            teamwork: footballPlayerDefender.teamwork,
            acceleration: footballPlayerDefender.acceleration
        };
            
        /*
              "playOffsideTrap":false, ////// Make trap for offside....
                    - Yes
                    - No
        */
        /////tacticsHome.playOffsideTrap...
        /////Add Bonus offSideTrap..... 
        ///// on first 50%...
        skillCompare = getComparison.defendingCalculation(listSkillAttacker, listSkillDefender);
        return getComparison.offSideTrapSuccessChance(ballPosition, ballPossessionHome, skillCompare);
    }
}

function refereeDecision(ballPossessionHome) {
    var tactics;
    if (ballPossessionHome) {
        tactics = tacticsHome;
    } else {
        tactics = tacticsAway;
    }
    var refereeDecidedWeight = [0.9, 0.95, 0.98];
    if (Math.random() < refereeDecidedWeight[tactics.tacklingStyle])
        return 0;

    var cardDecidedWeight = 0.9;
    return Math.random() < cardDecidedWeight ? 1 : 2;
}

function offSidePositioning(ballPosition, actionType, ballPossessionHome) { 
    //////// this happen when pass the ball over def position to own team st...    
    ////// Break offside trap, (Avg All def) def Offside trap...
    /////tacticsHome.playOffsideTrap
    ////// Bonus playOffsideTrap.
    ////// Compare ST with all defender.
    var offSideWeight = 0.98;
    var offSideChance = (Math.random() * (1));
    if (ballPossessionHome && ballPosition.x >= (soccer_field_gen.fieldBallMaxX - (1 * soccer_field_gen.gridResolution))) {
        if (offSideChance >= offSideWeight) {
            return true;
        }
    } else if (!ballPossessionHome && ballPosition.x <= (soccer_field_gen.fieldBallMinX + (1 * soccer_field_gen.gridResolution))) {
        if (offSideChance >= offSideWeight) {
            return true;
        }
    }
    return false;
}

///// foul
function possibilityOfFoul(ballPossessionHome) {
    /// IsYelloweCard - >(mainPlayer) -> foul Weight = 0.99;
    ///aggressiveRespond -> add Bonus wieght?? 
    var tactics;
    if (ballPossessionHome) {
        tactics = tacticsHome;
    } else {
        tactics = tacticsAway;
    }
    var foulWeight = [0.90, 0.95, 0.98];
    return Math.random() >= foulWeight[tactics.tacklingStyle];
}

///////// Action.... 
function decisionOfOpportunityToShoot(ballPosition, ballPossessionHome) {
    if (ballPosition.y < (soccer_field_gen.fieldBallMinY + (2 * soccer_field_gen.gridResolution))
        || ballPosition.y > (soccer_field_gen.fieldBallMaxY - (2 * soccer_field_gen.gridResolution)))
        return false;

    if (ballPossessionHome && ballPosition.x < (soccer_field_gen.fieldBallMaxX - (2 * soccer_field_gen.gridResolution)))
        return false;

    if (!ballPossessionHome && ballPosition.x > (soccer_field_gen.fieldBallMinX + (2 * soccer_field_gen.gridResolution)))
        return false;

    var longShortsWeight = [0.98, 0.9, 0.85];

    var tactics;
    if (ballPossessionHome) {
        tactics = tacticsHome;
    } else {
        tactics = tacticsAway;
    }
    var opportunityToshootWeight = 0.85;
    if (tactics.longShorts < longShortsWeight.length)
        opportunityToshootWeight = longShortsWeight[tactics.longShorts];

    if (ballPossessionHome && ballPosition.x >= (soccer_field_gen.fieldBallMaxX - (2 * soccer_field_gen.gridResolution))) {
        if (ballPosition.x >= (soccer_field_gen.fieldBallMaxX - (1 * soccer_field_gen.gridResolution)))
            return true;

        if (Math.random() >= opportunityToshootWeight)
            return true;

        return false;
    }

    if (ballPossessionHome || ballPosition.x > (soccer_field_gen.fieldBallMinX + (2 * soccer_field_gen.gridResolution)))
        return false;

    if (ballPosition.x <= (soccer_field_gen.fieldBallMinX + (1 * soccer_field_gen.gridResolution)))
        return true;

    return Math.random() >= opportunityToshootWeight;
}

function decisionOfTryToshooting(ballPosition, ballPossessionHome, prioritizeShootAction) {
    var randomChanceAction = Math.floor(Math.random() * (1));
    if (ballPosition.air) {
        return "try_to_shoot_head";
    } else {
        if (randomChanceAction >= 0.5) {
            return "try_to_shoot_charge";
        } else {
            return "try_to_shoot";
        }
    }
}

function decisionOfshooting(ballPosition, ballPossessionHome, previousActionType) {
    var tactics;
    if (ballPossessionHome) {
        tactics = tacticsHome;
    } else {
        tactics = tacticsAway;
    }
    if (ballPosition.air) //// pass long, crossing high
    {
        return "ball_to_gk_head";
    } else {
        if (ballPosition.x >= (soccer_field_gen.fieldBallMaxX - (2 * soccer_field_gen.gridResolution))
            || ballPosition.x <= soccer_field_gen.fieldBallMinX + (2 * soccer_field_gen.gridResolution)) {
            var longShortsRandomChance = (Math.random() * (1));
            var longShortsWeight = [0.7, 0.5, 0.3];
            if (longShortsRandomChance >= longShortsWeight[tactics.longShorts]) {
                return "ball_to_gk_long_shoot";
            } else {
                return "ball_to_gk_charge";
            }
        } else if (previousActionType === "pass_short" || previousActionType === "crossing_low") {
            return "ball_to_gk_shoot";

        } else if (previousActionType === "dribble") {
            return "ball_to_gk_one_on_one";
        }
    }
    return "idle";
}

////////Try to Shoot with the ball, Def Try to shoot with the ball
function possibilityOfshootingAndDefending(ballPosition, previousBallPosition, ballPossessionHome, actionType, mainPlayer, subPlayer) {
    var footballPlayerAttacker = mainPlayer.footballPlayer;
    var footballPlayerDefender = subPlayer.footballPlayer;
    //// Use distance to calculate shootChance
    //var distance = 0.1 * distanceTotheGoal(ballPosition, ballPossessionHome);
    var shootChance = (Math.random() * (1));
    if (shootChance < 0.5)
        return "failed";

    var skillCompareShooterAndGoal = GKdefendingTheBall(ballPosition, previousBallPosition, ballPossessionHome, actionType, footballPlayerAttacker, footballPlayerDefender);

    var defResult = 0.5 - (0.25 * skillCompareShooterAndGoal / 10);
    defResult = Math.min(Math.max(this, 0.25), 0.75);

    /// more chance to get goal.
    return Math.random() < defResult ? "goal" : "saves";
}

function decisionOfdefense(actionType) { 
      
    /// What is defenses need to be handled? 
    /////// Tactics....
    switch (actionType) {
        case "pass_short":
        case "pass_through":
        case "crossing_low":
        case "dribble":
        case "try_to_shoot":
        case "try_to_shoot_head":
        case "try_to_shoot_charge":
            return "intercept";

        case "pass_long":
        case "crossing_high":
            return "heading";

        default:
            return "idle";
    }
}

function possibilityOfdefense(ballPosition, previousBallPosition, ballPossessionHome, actionType, actionTypeDef, mainPlayer, subPlayer) {

    var tactics;
    if (ballPossessionHome) {
        tactics = tacticsHome;
    } else {
        tactics = tacticsAway;
    }
    ////// actionTypeDef -> add extra bonus ??? unused now.
    /////// action 
    ///Def Short Pass
    ///Def Long Pass
    ///Def Dribble
    ///Def Pass througt
    
    var footballPlayerAttacker = mainPlayer.footballPlayer;
    var footballPlayerDefender = subPlayer.footballPlayer;
    
    ////// tactics bonus of tactics. 
    ////// closingDownStyle.
    ////// markingStyle.
    ////// roamingStyle.
    /// Tatics bonus unused for now.
    var defClosingDownRate = [0.008, 0.005, -0.008];
    var defMarkingRate = [-0.005, 0.005, 0.009];
    var defRoamingRate = [-0.005, 0.005, 0.010];
    defClosingDownRate[tactics.closingDownStyle];
    defMarkingRate[tactics.markingStyle];
    defRoamingRate[tactics.roamingStyle];
    ///////// + chance.
    var defResult = defendingTheBall(ballPosition, previousBallPosition, ballPossessionHome, actionType, footballPlayerAttacker, footballPlayerDefender);
    return (Math.random()) < defResult;
}

function decisionOfMoveBallAction(ballPosition, ballPossessionHome) {
    var actionChance = (Math.random() * (1));
    var tactics;
    if (ballPossessionHome) {
        tactics = tacticsHome;
    } else {
        tactics = tacticsAway;
    }

    if (ballPosition.air) {
        return "pass_head";
    }

    if (ballPosition.x === (soccer_field_gen.fieldBallMaxX - (1 * soccer_field_gen.gridResolution))) {
        if (ballPossessionHome) {
            return decisionDribbleAndPassThrough();
        }
        else {
            if (actionChance >= 0.7) {
                return decisionPassingByTactics(tactics);
            } else if (actionChance >= 0.4) {
                return decisionCrossingByTactics(tactics);
            } else {
                return decisionDribbleAndPassThrough();
            }
        }
    }
    else if (ballPosition.x === (soccer_field_gen.fieldBallMaxX - (2 * soccer_field_gen.gridResolution))) {
        if (ballPossessionHome) {
            if (actionChance >= 0.7) {
                return decisionPassingByTactics(tactics);
            } else if (actionChance >= 0.4) {
                return decisionCrossingByTactics(tactics);
            } else {
                return decisionDribbleAndPassThrough();
            }
        }
        else {
            if (actionChance >= 0.7) {
                return decisionPassingByTactics(tactics);
            } else if (actionChance >= 0.4) {
                return decisionCrossingByTactics(tactics);
            } else {
                return decisionDribbleAndPassThrough();
            }
        }
    }
    else if (ballPosition.x === (Math.floor(soccer_field_gen.fieldBallMaxX / 2))) {
        if (ballPossessionHome) {
            if (actionChance >= 0.7) {
                return decisionPassingByTactics(tactics);
            } else if (actionChance >= 0.4) {
                return decisionCrossingByTactics(tactics);
            } else {
                return decisionDribbleAndPassThrough();
            }
        }
        else {
            if (actionChance >= 0.7) {
                return decisionPassingByTactics(tactics);
            } else if (actionChance >= 0.4) {
                return decisionCrossingByTactics(tactics);
            } else {
                return decisionDribbleAndPassThrough();
            }
        }
    }
    else if (ballPosition.x === (soccer_field_gen.fieldBallMinX + (2 * soccer_field_gen.gridResolution))) {
        if (ballPossessionHome) {
            if (actionChance >= 0.7) {
                return decisionPassingByTactics(tactics);
            } else if (actionChance >= 0.4) {
                return decisionCrossingByTactics(tactics);
            } else {
                return decisionDribbleAndPassThrough();
            }
        }
        else {
            if (actionChance >= 0.7) {
                return decisionPassingByTactics(tactics);
            } else if (actionChance >= 0.4) {
                return decisionCrossingByTactics(tactics);
            } else {
                return decisionDribbleAndPassThrough();
            }
        }
    }
    else if (ballPosition.x === (soccer_field_gen.fieldBallMinX + (1 * soccer_field_gen.gridResolution))) {
        if (ballPossessionHome) {
            if (actionChance >= 0.7) {
                return decisionPassingByTactics(tactics);
            } else if (actionChance >= 0.4) {
                return decisionCrossingByTactics(tactics);
            } else {
                return decisionDribbleAndPassThrough();
            }
        }
        else {
            return decisionDribbleAndPassThrough();
        }
    }
}

var priorityDefenseAction = [
    "intercept",
    "defense",
    "saves",
    "heading"
];

var ballPosition = {
    "x": 3,
    "y": 5,
    "air": false,
    "velocity": 1
};

module.exports = {
    refereeDecision: refereeDecision,
    possibilityOfFoul: possibilityOfFoul,
    offSidePositioning: offSidePositioning,
    decisionOfOpportunityToShoot: decisionOfOpportunityToShoot,
    decisionOfshooting: decisionOfshooting,
    decisionOfTryToshooting: decisionOfTryToshooting,
    possibilityOfshootingAndDefending: possibilityOfshootingAndDefending,
    decisionOfMoveBallAction: decisionOfMoveBallAction,
    decisionMoveBallDirection: decisionMoveBallDirection,
    decisionOfdefense: decisionOfdefense,
    possibilityOfdefense: possibilityOfdefense
};

