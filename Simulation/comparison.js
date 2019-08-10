
function attackingCalculation(listSkillAttacker) {
    return 0.5;
}

function defendingCalculation(listSkillDefender) {
    return 0.5;
}
function attackingPassShortCalculation(listSkillAttacker) {

    var skillAttacker = ((listSkillAttacker["flair"] + listSkillAttacker["offTheBall"]) / 2)
        + (listSkillAttacker["passing"] * (1.5))
        + ((listSkillAttacker["technique"] + listSkillAttacker["teamwork"]) / 2);
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;
    
}

function defendingPassShortCalculation(listSkillDefender) {
    
    var skillDefender = (listSkillDefender["decision"]
        + listSkillDefender["positioning"]
        + listSkillDefender["passing"]
        + (listSkillDefender["marking"] * (0.5)));

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;      

}

function attackingPassLongCalculation(listSkillAttacker) {

    var skillAttacker = ((listSkillAttacker["flair"] + listSkillAttacker["offTheBall"]) / 2)
        + (listSkillAttacker["passing"] * (1.5))
        + ((listSkillAttacker["technique"] + listSkillAttacker["teamwork"]) / 2);

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;      
}

function defendingPassLongCalculation(listSkillDefender) {

    var skillDefender = listSkillDefender["decision"]
        + listSkillDefender["positioning"]
        + listSkillDefender["tackling"]
        + (listSkillDefender["marking"] * (0.5));
    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;   

}

function attackingPassThroughCalculation(listSkillAttacker) {
    
    var skillAttacker = listSkillAttacker["passing"]
        + listSkillAttacker["flair"]
        + listSkillAttacker["technique"] * 0.5
        + ((listSkillAttacker["offTheBall"]
            + listSkillAttacker["teamwork"]) / 2);

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;                

}

function defendingPassThroughCalculation(listSkillDefender) {
    
    var skillDefender = listSkillDefender["decision"]
        + listSkillDefender["positioning"]
        + listSkillDefender["passing"] * 0.5
        + listSkillDefender["marking"];
    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;   

}

function attackingCrossingLowCalculation(listSkillAttacker) {
  
    var skillAttacker = ((listSkillAttacker["acceleration"] + listSkillAttacker["pace"] + listSkillAttacker["agility"]) / 3)
        + ((listSkillAttacker["dribbling"] + listSkillAttacker["technique"] + listSkillAttacker["offTheBall"]) / 3)
        + ((listSkillAttacker["crossing"] + listSkillAttacker["passing"]) / 2)
        + ((listSkillAttacker["strenght"] + listSkillAttacker["balance"]) / 4);
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;       
      
}

function defendingCrossingLowCalculation(listSkillDefender) {

    var skillDefender = ((listSkillDefender["positioning"] + listSkillDefender["marking"]) / 2)
        + ((listSkillDefender["acceleration"] + listSkillDefender["pace"] + listSkillDefender["agility"]) / 3)
        + ((listSkillDefender["tackling"] + listSkillDefender["decision"]) / 2)
        + ((listSkillDefender["strenght"] + listSkillDefender["balance"]) / 4);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;   

}



function attackingCrossingHighCalculation(listSkillAttacker) {     
              
    var skillAttacker = ((listSkillAttacker["acceleration"] + listSkillAttacker["pace"] + listSkillAttacker["agility"]) / 3)
        + ((listSkillAttacker["dribbling"] + listSkillAttacker["technique"] + listSkillAttacker["offTheBall"]) / 3)
        + listSkillAttacker["crossing"]
        + ((listSkillAttacker["strenght"] + listSkillAttacker["balance"]) / 4);
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;      

}

function defendingCrossingHighCalculation(listSkillDefender) {     

    var skillDefender = ((listSkillDefender["positioning"] + listSkillDefender["marking"]) / 2)
        + ((listSkillDefender["acceleration"] + listSkillDefender["pace"] + listSkillDefender["agility"]) / 3)
        + ((listSkillDefender["tackling"] + listSkillDefender["decision"]) / 2)
        + ((listSkillDefender["strenght"] + listSkillDefender["balance"]) / 4);
    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;
}


function attackingDribblingCalculation(listSkillAttacker) {
           
    var skillAttacker = listSkillAttacker["dribbling"] + (listSkillAttacker["technique"] / 2)
        + ((listSkillAttacker["acceleration"] + listSkillAttacker["pace"] + listSkillAttacker["agility"]) / 2)
        + ((listSkillAttacker["strenght"] + listSkillAttacker["balance"]) / 4);

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;
}

function defendingDribblingCalculation(listSkillDefender) {

    var skillDefender = ((listSkillDefender["decision"] + listSkillDefender["marking"]) / 2)
        + ((listSkillDefender["tackling"] + listSkillDefender["acceleration"]) / 2)
        + ((listSkillDefender["strenght"] + listSkillDefender["balance"]) / 4);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;
}



function attackingTryToShootCalculation(listSkillAttacker) {

    var skillAttacker = ((listSkillAttacker["dribbling"] + listSkillAttacker["offTheBall"]) / 2)
        + ((listSkillAttacker["acceleration"] + listSkillAttacker["pace"] + listSkillAttacker["agility"]) / 3)
        + ((listSkillAttacker["strenght"] + listSkillAttacker["balance"] + listSkillAttacker["technique"]) / 3);

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;
}

function defendingTryToShootCalculation(listSkillDefender) {

    var skillDefender = ((listSkillDefender["positioning"] + listSkillDefender["marking"]) / 2)
        + ((listSkillDefender["tackling"] + listSkillDefender["decision"]) / 2)
        + ((listSkillDefender["strenght"] + listSkillDefender["balance"]) / 2);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;

}

function attackingTryToShootHeadCalculation(listSkillAttacker) {

    var skillAttacker = listSkillAttacker["jumping"] + listSkillAttacker["firstTouch"]
        + ((listSkillAttacker["offTheBall"] + listSkillAttacker["heading"]) / 2)
        + ((listSkillAttacker["strenght"] + listSkillAttacker["balance"] + listSkillAttacker["technique"]) / 2);
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;   

}

function defendingTryToShootHeadCalculation(listSkillDefender) {

    var skillDefender = listSkillDefender["jumping"]
        + ((listSkillDefender["marking"] + listSkillDefender["heading"]))
        + ((listSkillDefender["strenght"] + listSkillDefender["balance"] + listSkillDefender["positioning"]) / 2);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;     
}

function attackingTryToShootChargeCalculation(listSkillAttacker) {
        
    var skillAttacker = listSkillAttacker["offTheBall"] + listSkillAttacker["firstTouch"]
        + ((listSkillAttacker["acceleration"] + listSkillAttacker["pace"] + listSkillAttacker["agility"]) / 2)
        + ((listSkillAttacker["strenght"] + listSkillAttacker["balance"] + listSkillAttacker["technique"]) / 3);


    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;   

}

function defendingTryToShootChargeCalculation(listSkillDefender) {

    var skillDefender = listSkillDefender["marking"]
        + ((listSkillDefender["positioning"] + listSkillDefender["tackling"]))
        + ((listSkillDefender["strenght"] + listSkillDefender["balance"]) / 2)
        + (listSkillDefender["acceleration"] / 2);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;  
}

function attackingBallToGkShootCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["finishing"] * (1.5))
        + ((listSkillAttacker["dribbling"] + (listSkillAttacker["offTheBall"] / 2)
            + ((listSkillAttacker["acceleration"] + listSkillAttacker["pace"] + listSkillAttacker["agility"]) / 3)
            + ((listSkillAttacker["strenght"] + listSkillAttacker["balance"] + listSkillAttacker["technique"]) / 3)) * (4 / 7));
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;

}

function defendingBallToGkShootCalculation(listSkillDefender) {
    
    var skillDefender = ((listSkillDefender["handling"] + listSkillDefender["reflex"]) * (3 / 4))
        + ((listSkillDefender["positioning"] + listSkillDefender["jumping"] + listSkillDefender["decision"]) / 3)
        + ((listSkillDefender["oneOnOnes"] + listSkillDefender["runshingOut"] + listSkillDefender["aerialAbility"]) / 3);
    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;

}

function attackingBallToGkHeadCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["heading"])
        + (listSkillAttacker["technique"] * (0.5))
        + ((listSkillAttacker["jumping"] + ((listSkillAttacker["offTheBall"]
            + listSkillAttacker["heading"]) / 2)
            + ((listSkillAttacker["strenght"]
                + listSkillAttacker["balance"]
                + listSkillAttacker["technique"]) / 2)) * (4 / 7));


    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;                   
}

function defendingBallToGkHeadCalculation(listSkillDefender) {

    var skillDefender = ((listSkillDefender["handling"] + listSkillDefender["reflex"]) * (3 / 4))
        + ((listSkillDefender["positioning"] + listSkillDefender["jumping"] + listSkillDefender["decision"]) / 3)
        + ((listSkillDefender["oneOnOnes"] + listSkillDefender["runshingOut"] + listSkillDefender["aerialAbility"]) / 3);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;    

}


function attackingBallToGkChargeCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["finishing"] * (0.5)) + listSkillAttacker["firstTouch"]
        + ((listSkillAttacker["offTheBall"] +
            + ((listSkillAttacker["acceleration"] + listSkillAttacker["pace"]
                + listSkillAttacker["agility"]) / 2)
            + ((listSkillAttacker["strenght"]
                + listSkillAttacker["balance"]
                + listSkillAttacker["technique"]) / 3)) * (4 / 7));
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;    

}

function defendingBallToGkChargeCalculation(listSkillDefender) {

    var skillDefender = ((listSkillDefender["handling"] + listSkillDefender["reflex"]) * (3 / 4))
        + ((listSkillDefender["positioning"] + listSkillDefender["jumping"] + listSkillDefender["decision"]) / 3)
        + ((listSkillDefender["oneOnOnes"] + listSkillDefender["runshingOut"] + listSkillDefender["aerialAbility"]) / 3);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;   

}

function attackingBallToGkLongShootCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["longShorts"] * (0.5)) + listSkillAttacker["firstTouch"]
        + ((listSkillAttacker["dribbling"]
            + (listSkillAttacker["offTheBall"] / 2)
            + ((listSkillAttacker["acceleration"] + listSkillAttacker["pace"] + listSkillAttacker["agility"]) / 3)
            + ((listSkillAttacker["strenght"]
                + listSkillAttacker["balance"]
                + listSkillAttacker["technique"]) / 3)) * (4 / 7));

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;  

}

function defendingBallToGkLongShootCalculation(listSkillDefender) {

    var skillDefender = ((listSkillDefender["handling"] + listSkillDefender["reflex"]) * (3 / 4))
        + ((listSkillDefender["positioning"] + listSkillDefender["jumping"] + listSkillDefender["decision"]) / 3)
        + ((listSkillDefender["oneOnOnes"] + listSkillDefender["runshingOut"] + listSkillDefender["aerialAbility"]) / 3);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;   
    
}

function attackingBallToGkOneOnOneCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["finishing"]) + (listSkillAttacker["firstTouch"])
        + listSkillAttacker["offTheBall"]
        + ((listSkillAttacker["dribbling"]) + listSkillAttacker["technique"] / 2);

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;    
}

function defendingBallToGkOneOnOneCalculation(listSkillDefender) {

    var skillDefender = (listSkillDefender["oneOnOnes"] * (2))
        + ((listSkillDefender["handling"] + listSkillDefender["reflex"] + listSkillDefender["positioning"]) / 2);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;   
}
function attackingBallToGkFreeKickCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["freekick"] * (2))
        + ((listSkillAttacker["finishing"] + listSkillAttacker["longShorts"]) * (3 / 4));
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;
}

function defendingBallToGkFreeKickCalculation(listSkillDefender) {

    var skillDefender = ((listSkillDefender["handling"] + listSkillDefender["reflex"]) * (3 / 4))
        + ((listSkillDefender["positioning"] + listSkillDefender["jumping"] + listSkillDefender["decision"]) / 3)
        + ((listSkillDefender["oneOnOnes"] + listSkillDefender["runshingOut"] + listSkillDefender["aerialAbility"]) / 3);
    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;
}

function attackingBallToGkPenaltyKickCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["penaltyTaking"] * (2))
        + ((listSkillAttacker["finishing"] + listSkillAttacker["longShorts"]) * (3 / 4));

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;
}

function defendingBallToGkPenaltyKickCalculation(listSkillDefender) {

    var skillDefender = (listSkillDefender["oneOnOnes"] * (2))
        + ((listSkillDefender["handling"] + listSkillDefender["reflex"] + listSkillDefender["positioning"]) / 2);

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;

}

function attackingCornerKickPassCalculation(listSkillAttacker) {
    var skillAttacker = (listSkillAttacker["corner"] * (2))
        + listSkillAttacker["crossing"];

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;
}

function attackingFreeKickOntargetPassingCalculation(listSkillAttacker) {
    ///// pass by freekick
    var skillAttacker = (listSkillAttacker["freekick"] * (1.5))
        + listSkillAttacker["finishing"]
        + listSkillAttacker["longShorts"];
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;
}

function attackingCounterLongPoint(listSkillAttacker) {
    ////// counter attack
    var skillAttacker = (listSkillAttacker["offTheBall"] + (listSkillAttacker["acceleration"] + listSkillAttacker["pace"]) / 2);
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;

}

function defendingCounterLongPoint(listSkillDefender) {
    /////// counter attack
    var skillDefender = (listSkillDefender["positioning"]) + (listSkillDefender["tackling"]) + (listSkillDefender["marking"]) + ((listSkillDefender["acceleration"] + listSkillDefender["pace"]) / 2);
    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;
}

function attackingCounterShortPoint(listSkillAttacker) {
    ////// counter attack
    var skillAttacker = (listSkillAttacker["offTheBall"] + (listSkillAttacker["acceleration"] + listSkillAttacker["pace"]) / 2);
    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;

}

function defendingCounterShortPoint(listSkillDefender) {
    ////// counter attack
     var skillDefender = (listSkillDefender["positioning"]) + (listSkillDefender["tackling"]) + (listSkillDefender["marking"]) + ((listSkillDefender["acceleration"] + listSkillDefender["pace"]) / 2);
    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;
}

function attackingOffSideCalculation(listSkillAttacker) {

    var skillAttacker = (listSkillAttacker["offTheBall"] * (2))
        + (listSkillAttacker["acceleration"] + (listSkillAttacker["pace"]));

    skillAttacker = (skillAttacker / 7000) * 50;
    return skillAttacker;

}
function defendingOffSideCalculation(listSkillDefender) {

    var skillDefender = ((listSkillDefender["positioning"] * (2))
        + listSkillDefender["acceleration"] + ((listSkillDefender["decision"] + listSkillDefender["teamwork"]) / 2));

    skillDefender = (skillDefender / 7000) * 50;
    return skillDefender;
}

//// Check ball position and previousballposition for zone chance. 
function passShortSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {
      
    var defChanceZoneX = 0, defChanceZoneY = 0;
    var zoneDistanceX = ballPosition.x - previousBallPosition.x;
    var zoneDistanceY = ballPosition.y - previousBallPosition.y;
    if (zoneDistanceX > 0) {
        defChanceZoneX = (0.5 * zoneDistanceX);
    } else if (zoneDistanceX < 0) {
        defChanceZoneX = (-0.5 * zoneDistanceX);
    }
    if (zoneDistanceY > 0) {
        defChanceZoneY = (0.5 * zoneDistanceY);
    } else if (zoneDistanceY < 0) {
        defChanceZoneY = (-0.5 * zoneDistanceY);
    }
    return (0.5 - ((0.25 * comparedAttakerAndDefender / 30))) + (defChanceZoneX + defChanceZoneY);
}

function passLongSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {
    var defChanceZoneX = 0, defChanceZoneY = 0;
    var zoneDistanceX = ballPosition.x - previousBallPosition.x;
    var zoneDistanceY = ballPosition.y - previousBallPosition.y;
    if (zoneDistanceX > 0) {
        defChanceZoneX = (0.5 * zoneDistanceX);
    } else if (zoneDistanceX < 0) {
        defChanceZoneX = (-0.5 * zoneDistanceX);
    }
    if (zoneDistanceY > 0) {
        defChanceZoneY = (0.5 * zoneDistanceY);
    } else if (zoneDistanceY < 0) {
        defChanceZoneY = (-0.5 * zoneDistanceY);
    }
    return (0.5 - ((0.25 * comparedAttakerAndDefender / 30))) + (defChanceZoneX + defChanceZoneY);
}

function passThroughSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {
    var defChanceZoneX = 0, defChanceZoneY = 0;
    var zoneDistanceX = ballPosition.x - previousBallPosition.x;
    var zoneDistanceY = ballPosition.y - previousBallPosition.y;
    if (zoneDistanceX > 0) {
        defChanceZoneX = (0.5 * zoneDistanceX);
    } else if (zoneDistanceX < 0) {
        defChanceZoneX = (-0.5 * zoneDistanceX);
    }
    if (zoneDistanceY > 0) {
        defChanceZoneY = (0.5 * zoneDistanceY);
    } else if (zoneDistanceY < 0) {
        defChanceZoneY = (-0.5 * zoneDistanceY);
    }
    return (0.5 - ((0.25 * comparedAttakerAndDefender / 30))) + (defChanceZoneX + defChanceZoneY);
}

function crossingLowSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {
    var defChanceZoneX = 0, defChanceZoneY = 0;
    var zoneDistanceX = ballPosition.x - previousBallPosition.x;
    var zoneDistanceY = ballPosition.y - previousBallPosition.y;
    if (zoneDistanceX > 0) {
        defChanceZoneX = (0.5 * zoneDistanceX);
    } else if (zoneDistanceX < 0) {
        defChanceZoneX = (-0.5 * zoneDistanceX);
    }
    
    if (zoneDistanceY > 0) {
        defChanceZoneY = (0.5 * zoneDistanceY);
    } else if (zoneDistanceY < 0) {
        defChanceZoneY = (-0.5 * zoneDistanceY);
    }
    return (0.5 - ((0.25 * comparedAttakerAndDefender / 30))) + (defChanceZoneX + defChanceZoneY);
}

function crossingHighSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {
    var defChanceZoneX = 0, defChanceZoneY = 0;
    var zoneDistanceX = ballPosition.x - previousBallPosition.x;
    var zoneDistanceY = ballPosition.y - previousBallPosition.y;
    if (zoneDistanceX > 0) {
        defChanceZoneX = (0.5 * zoneDistanceX);
    } else if (zoneDistanceX < 0) {
        defChanceZoneX = (-0.5 * zoneDistanceX);
    }
    if (zoneDistanceY > 0) {
        defChanceZoneY = (0.5 * zoneDistanceY);
    } else if (zoneDistanceY < 0) {
        defChanceZoneY = (-0.5 * zoneDistanceY);
    }
    return (0.5 - ((0.25 * comparedAttakerAndDefender / 30))) + (defChanceZoneX + defChanceZoneY);
}

function dribbleSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {
    var defChanceZoneX = 0, defChanceZoneY = 0;
    var zoneDistanceX = ballPosition.x - previousBallPosition.x;
    var zoneDistanceY = ballPosition.y - previousBallPosition.y;
    if (zoneDistanceX > 0) {
        defChanceZoneX = (0.5 * zoneDistanceX);
    } else if (zoneDistanceX < 0) {
        defChanceZoneX = (-0.5 * zoneDistanceX);
    }
    if (zoneDistanceY > 0) {
        defChanceZoneY = (0.5 * zoneDistanceY);
    } else if (zoneDistanceY < 0) {
        defChanceZoneY = (-0.5 * zoneDistanceY);
    }
    return (0.5 - ((0.25 * comparedAttakerAndDefender / 30))) + (defChanceZoneX + defChanceZoneY);
}

function tryToshootSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function tryToShootHeadSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function tryToShootChargeSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function ballToGkShootSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function ballToGkHeadSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function ballToGkChargeSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function ballToGkLongShootSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function ballToGkoneOnOnesuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function ballToGkFreeKickSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function ballToGkPenaltyKickSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

function offSideTrapSuccessChance(ballPosition, previousBallPosition, ballPossessionHome, comparedAttakerAndDefender) {

    return (0.5 - (0.25 * comparedAttakerAndDefender / 30));
}

module.exports = {
    attackingCalculation: attackingCalculation,
    defendingCalculation: defendingCalculation,
    attackingPassShortCalculation: attackingPassShortCalculation,
    defendingPassShortCalculation: defendingPassShortCalculation,
    attackingPassLongCalculation: attackingPassLongCalculation,
    defendingPassLongCalculation: defendingPassLongCalculation,
    attackingPassThroughCalculation: attackingPassThroughCalculation,
    defendingPassThroughCalculation: defendingPassThroughCalculation,
    attackingCrossingLowCalculation: attackingCrossingLowCalculation,
    defendingCrossingLowCalculation: defendingCrossingLowCalculation,
    attackingCrossingHighCalculation: attackingCrossingHighCalculation,
    defendingCrossingHighCalculation: defendingCrossingHighCalculation,
    attackingDribblingCalculation: attackingDribblingCalculation,
    defendingDribblingCalculation: defendingDribblingCalculation,
    attackingTryToShootCalculation: attackingTryToShootCalculation,
    defendingTryToShootCalculation: defendingTryToShootCalculation,
    attackingTryToShootHeadCalculation: attackingTryToShootHeadCalculation,
    defendingTryToShootHeadCalculation: defendingTryToShootHeadCalculation,
    attackingTryToShootChargeCalculation: attackingTryToShootChargeCalculation,
    defendingTryToShootChargeCalculation: defendingTryToShootChargeCalculation,
    attackingBallToGkShootCalculation: attackingBallToGkShootCalculation,
    defendingBallToGkShootCalculation: defendingBallToGkShootCalculation,
    attackingBallToGkHeadCalculation: attackingBallToGkHeadCalculation,
    defendingBallToGkHeadCalculation: defendingBallToGkHeadCalculation,
    attackingBallToGkChargeCalculation: attackingBallToGkChargeCalculation,
    defendingBallToGkChargeCalculation: defendingBallToGkChargeCalculation,
    attackingBallToGkLongShootCalculation: attackingBallToGkLongShootCalculation,
    defendingBallToGkLongShootCalculation: defendingBallToGkLongShootCalculation,
    attackingBallToGkOneOnOneCalculation: attackingBallToGkOneOnOneCalculation,
    defendingBallToGkOneOnOneCalculation: defendingBallToGkOneOnOneCalculation,
    attackingBallToGkFreeKickCalculation: attackingBallToGkFreeKickCalculation,
    defendingBallToGkFreeKickCalculation: defendingBallToGkFreeKickCalculation,
    attackingBallToGkPenaltyKickCalculation: attackingBallToGkPenaltyKickCalculation,
    defendingBallToGkPenaltyKickCalculation: defendingBallToGkPenaltyKickCalculation,
    attackingCornerKickPassCalculation: attackingCornerKickPassCalculation,
    attackingFreeKickOntargetPassingCalculation: attackingFreeKickOntargetPassingCalculation,
    attackingCounterLongPoint: attackingCounterLongPoint,
    defendingCounterLongPoint: defendingCounterLongPoint,
    attackingCounterShortPoint: attackingCounterShortPoint,
    defendingCounterShortPoint: defendingCounterShortPoint,
    attackingOffSideCalculation: attackingOffSideCalculation,
    defendingOffSideCalculation: defendingOffSideCalculation,
    passShortSuccessChance: passShortSuccessChance,
    passLongSuccessChance: passLongSuccessChance,
    passThroughSuccessChance: passThroughSuccessChance,
    crossingLowSuccessChance: crossingLowSuccessChance,
    crossingHighSuccessChance: crossingHighSuccessChance,
    dribbleSuccessChance: dribbleSuccessChance,
    tryToshootSuccessChance: tryToshootSuccessChance,
    tryToShootHeadSuccessChance: tryToShootHeadSuccessChance,
    tryToShootChargeSuccessChance: tryToShootChargeSuccessChance,
    ballToGkShootSuccessChance: ballToGkShootSuccessChance,
    ballToGkHeadSuccessChance: ballToGkHeadSuccessChance,
    ballToGkChargeSuccessChance: ballToGkChargeSuccessChance,
    ballToGkLongShootSuccessChance: ballToGkLongShootSuccessChance,
    ballToGkoneOnOnesuccessChance: ballToGkoneOnOnesuccessChance,
    ballToGkFreeKickSuccessChance: ballToGkFreeKickSuccessChance,
    ballToGkPenaltyKickSuccessChance: ballToGkPenaltyKickSuccessChance,
    offSideTrapSuccessChance: offSideTrapSuccessChance
};


///// Unit Test. 
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

console.log(passShortSuccessChance(ballPosition, previousBallPosition, true, 0));