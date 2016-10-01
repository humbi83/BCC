
//ALEX:Prob I need to define ifs to avoid the cycles ,stupid js

//.import "BCCTank.js" as Tank

.import "BCCDoodadFactory.js" as Fact
.import "BCCGlobal.js" as  Global
.import "BCCDoodad.js" as Doodad
.import "BCCVec.js" as Vec

var ENEMY_TANKS_MAX_ACTIVE     =    4;
var ENEMY_TANKS_TELE_TIMEOUT   = 3000;//check game for time & if it is from the last ene death
var ENEMY_TANKS_TELE_MAX_TRYZ  = 10;
var ENEMY_TANKS_TELE_TRYZ_WAIT = 1000;

var NV_E_GS          = 0;
var E_GS_IT_S_ON_BBY = 1;
var E_GS_PLAYER_STB  = 2;
var E_GS_AI_STB      = 3;
var SZ_E_GS          = 4;

var ENEMY_TANKS_SPAWNS = [[0,0],[48,0],[0,48],[48,48],[6*16,3*16]]

//should this guy also do painting of the ui ?? prob yes
function newInstance(oLevel)
{
    var newInstance_ret = new Object
            ({

                 mLevel  : oLevel,
                 mPrevTick : 0,
                 //No 2nd player, need to see if qt supports multiple active keys
                 //first try was negative
                 mGLEnemyTanksStationed     :    20,
                 mGLEnemyTanksActive        :     0,
                 mGLEnemyTankTeleSince      :     0,
                 mGLPlayerActive            :     0,
                 mGLPlayerLives             :     3,
                 mGLPlayerStars             :     0,
                 mGLPUPShovelActiveSince    :     0,
                 mGLPUPClockActiveSince     :     0,
                 //I will spin test for this in sm, maybe there is a better way

                 //can we have a draw ???
                 mGLGameState               :E_GS_IT_S_ON_BBY, // make enum, with major game states

                 onBaseKilled : (function(){
                    this.mGLGameState = E_GS_PLAYER_STB;
                 }),

                 onDoodadAdded  :(function(oDoodad){
                 }),

                 onDoodadRemoved:(function(oDoodad){
                     if(oDoodad.mDoodadType == Doodad.E_DOODAD_TANK)
                     {
                        if(oDoodad.mPlayerType == Global.E_PLAYER_AI_X)
                        {
                            if(this.mGLEnemyTanksActive > 0)
                            {
                                this.mGLEnemyTanksActive--;
                            }else
                            {
                                //should not happen
                                console.log("Level::remDynObj::1");
                            }
                        }else
                        {
                            this.mGLPlayerActive = 0;
                        }
                     }
                 }),

                 update: (function(tick){
                     this.mPrevTick = tick;

                     try{

                     if(this.mGLGameState == E_GS_IT_S_ON_BBY){
                         if(this.mGLPlayerActive < 1){
                            if(this.mGLPlayerLives > 0){
                                //I should prob check to not tele on top of another tank .. anyway
                                //define spawn pos for p1&2
                                this.mLevel.addDynObj(Fact.Tank(this.mLevel,16,48,Global.E_PLAYER_1 ));
                                this.mGLPlayerLives--;
                                this.mGLPlayerActive = 1;
                            }else{
                                this.mGLGameState = E_GS_PLAYER_STB;
                            }
                        }

                         if(this.mGLEnemyTanksActive + this.mGLEnemyTanksStationed > 0){

                             if(this.mGLEnemyTanksStationed > 0 &&
                                this.mGLEnemyTanksActive < ENEMY_TANKS_MAX_ACTIVE &&
                                // should I have this from the last death of an enemy???, TODO:check game
                                tick - this.mGLEnemyTankTeleSince >= ENEMY_TANKS_TELE_TIMEOUT)
                             {
                                 //make this random or pick up randomly from a spawning pos
                                 //define spawn pos for ene
                                 var idxSpawn = 0;
                                 var tankDim = Vec.Vec2(4,4);
                                 var spawnFound = false;

                                 for(var i = 0; i< ENEMY_TANKS_TELE_MAX_TRYZ && !spawnFound; i++)
                                 {
                                     idxSpawn   = Global.getRandomInt(0,ENEMY_TANKS_SPAWNS.length);
                                     spawnFound = this.mLevel.isSpaceAvailable(Vec.Vec2(ENEMY_TANKS_SPAWNS[idxSpawn][0],ENEMY_TANKS_SPAWNS[idxSpawn][1]),tankDim);
                                 }

                                 if(spawnFound){
                                   this.mLevel.addDynObj(Fact.Tank(this.mLevel, ENEMY_TANKS_SPAWNS[idxSpawn][0],ENEMY_TANKS_SPAWNS[idxSpawn][1],Global.E_PLAYER_AI_X));
                                   this.mGLEnemyTankTeleSince = tick;
                                   this.mGLEnemyTanksActive++;
                                   this.mGLEnemyTanksStationed--;
                                 }else{
                                    this.mGLEnemyTankTeleSince = tick + ENEMY_TANKS_TELE_TRYZ_WAIT;
                                 }
                             }
                         }else{
                             this.mGLGameState = E_GS_AI_STB;
                         }

                     }

                     if(bccSM.mGameState != this.mGLGameState)
                     {
                        bccSM.mGameState = this.mGLGameState;
                     }

                    }catch(err){
                         console.log(err.message);
                     }
                 }),

                 paint:(function(){

                 })
             });
    return newInstance_ret;

}
//
//var NV_E_SPAWN_TNK        = 0;
//var E_SPAWN_TNK_PLAYER_1  = NV_E_SPAWN_TNK        + 1;
//var E_SPAWN_TNK_PLAYER_2  = E_SPAWN_TNK_PLAYER_1  + 1;
//var E_SPAWN_TNK_NRM_ENEMY = E_SPAWN_TNK_PLAYER_2  + 1;
//var E_SPAWN_TNK_POW_ENEMY = E_SPAWN_TNK_NRM_ENEMY + 1;
//var SZ_E_SPAWN_TNK        = E_SPAWN_TNK_POW_ENEMY + 1;
//
//var NV_E_SPAWN_POW     = 0;
//var E_SPAWN_POW_ARM_PL = NV_E_SPAWN_POW     + 1;
//var E_SPAWN_POW_CLOCK  = E_SPAWN_POW_ARM_PL + 1;
//var E_SPAWN_POW_ARM_HQ = E_SPAWN_POW_CLOCK  + 1;
//var E_SPAWN_POW_STAR   = E_SPAWN_POW_ARM_HQ + 1;
//var E_SPAWN_POW_GRND   = E_SPAWN_POW_STAR   + 1;
//var E_SPAWN_POW_1UP    = E_SPAWN_POW_GRND   + 1;
//var E_SPAWN_POW_GUN    = E_SPAWN_POW_1UP    + 1;
//var SZ_E_SPAWN_POW     = E_SPAWN_POW_GUN    + 1;
//
//function newInstance() {
//
//
//    var __ret = new Object({
//                               //these should be inited from the map, hmmm... I have no map... anyway
//                               mNoPlayers         :  1,
//                               mPlayer1Lives      :  3,
//                               mPlayer2Lives      :  0, // based on noPlayers
//                               mPlayerBases       :  1,
//                               mSpawningTanks     : 20, // based on noPlayers
//                               mMaxSpawendTanks   :  4, //+2 ?? for 2 players
//                               mEnemyTanks        : [],
//                               mPlayerTanks       : [],
//                               mGameState         :  0,
//
//                               paint:(function(){}),
//                               update:(function(tick){}),
//                               updateGameState:(function(){}),
//
//                               killEnemies  :(function(){}),
//                               freezeEnemies:(function(){}),
//                               spawnTank:(function())
//                           });
//
//    return __ret;
//}
