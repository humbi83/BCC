
var NV_E_SPAWN_TNK        = 0;
var E_SPAWN_TNK_PLAYER_1  = NV_E_SPAWN_TNK        + 1;
var E_SPAWN_TNK_PLAYER_2  = E_SPAWN_TNK_PLAYER_1  + 1;
var E_SPAWN_TNK_NRM_ENEMY = E_SPAWN_TNK_PLAYER_2  + 1;
var E_SPAWN_TNK_POW_ENEMY = E_SPAWN_TNK_NRM_ENEMY + 1;
var SZ_E_SPAWN_TNK        = E_SPAWN_TNK_POW_ENEMY + 1;

var NV_E_SPAWN_POW     = 0;
var E_SPAWN_POW_ARM_PL = NV_E_SPAWN_POW     + 1;
var E_SPAWN_POW_CLOCK  = E_SPAWN_POW_ARM_PL + 1;
var E_SPAWN_POW_ARM_HQ = E_SPAWN_POW_CLOCK  + 1;
var E_SPAWN_POW_STAR   = E_SPAWN_POW_ARM_HQ + 1;
var E_SPAWN_POW_GRND   = E_SPAWN_POW_STAR   + 1;
var E_SPAWN_POW_1UP    = E_SPAWN_POW_GRND   + 1;
var E_SPAWN_POW_GUN    = E_SPAWN_POW_1UP    + 1;
var SZ_E_SPAWN_POW     = E_SPAWN_POW_GUN    + 1;

function newInstance() {


    var __ret = new Object({
                               //these should be inited from the map, hmmm... I have no map... anyway
                               mNoPlayers         :  1,
                               mPlayer1Lives      :  3,
                               mPlayer2Lives      :  0, // based on noPlayers
                               mPlayerBases       :  1,
                               mSpawningTanks     : 20, // based on noPlayers
                               mMaxSpawendTanks   :  4, //+2 ?? for 2 players
                               mEnemyTanks        : [],
                               mPlayerTanks       : [],
                               mGameState         :  0,

                               paint:(function(){}),
                               update:(function(tick){}),
                               updateGameState:(function(){}),

                               killEnemies  :(function(){}),
                               freezeEnemies:(function(){}),
                               spawnTank:(function())
                           });

    return __ret;
}
