//.import "BCCSimpleDoodadPainter.js" as BCCSimpleDoodadPainter
.import "BCCColorDoodadPainter.js" as ColorPainter
.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCVec.js" as Vec
.import "BCCDoodad.js" as Doodad
.import "BCCLevel.js" as Level
.import "BCCTank.js" as Tank
.import "BCCFrameSequencePainter.js" as FSPainter
.import "BCCGlobal.js" as Global
.import "BCCPUp.js" as PU
.import "BCCGfx.js" as GFX
.import "BCCAtlasCPPPainter.js" as CAtlasPainter
.import "BCCFrameSequenceCPPPainter.js" as CFSPainter


function BCCMain()
{
    var ret = new Object({

                             nextId : 0,
                             getNextID: (function(){return this.nextId++;}),

                             NV_E_EVENT       : 0,
                             E_EVENT_INIT     : 1,
                             E_EVENT_TIMER    : 2,
                             E_EVENT_KEY_DOWN : 3,
                             E_EVENT_KEY_UP   : 4,
                             SZ_E_EVENT       : 5,

                             E_KC_UP   : 328,
                             E_KC_DOWN : 336,
                             E_KC_LEFT : 331,
                             E_KC_RIGHT: 333,
                             E_KC_FIRE : 57 ,

                             currentGameState: null,
                             pendingGameState: null,

                             mTank       : null,
                             mEnemyTanks : [],
                             mLevel      : null,

                             mAvailableEnemyTanks : 20,

                             onTankDied  : (function(oTank)
                             {
                                    //chek if we still have tanks
                             }),
                             init:(function(){
                                 //someTranz.someSignal();


                                 console.log("init called");
                                 this.mLevel = Level.BCCLevel();

                                 //It seems i have an OOB related problem on applyBrush, I might not check all
                                 //only on y, it seems that I loop on x & no crash
                                 //this.mCellsTmp = this.initLevel();

                                 //top
                                 mapView.applyBrush(4,0,368,0,16,16,13,1);
                                 //left
                                 mapView.applyBrush(0,0,368,0,16,16,1,15);
                                 //bottom
                                 mapView.applyBrush(4,56,368,0,16,16,13,1);
                                 //right
                                 mapView.applyBrush(56,0,368,0,32,240,1,1);

                                 //build basic font
                                //328x183, 40x16 // all chars0-9

                                 //pause /// 5x16 pos
                                 //288x176 40x8
                                 mapView.applyBrush(21 + 4,26 + 4,288,176,40,8,1,1);

                                 //stage__1
                                 mapView.applyBrush(54,0,328,176,40,8,1,1);

                                //game over // y0->26
                                mapView.applyBrush(26,26,288,184,32,16,1,1);


                                 //level spawns ->4 types of tanks
                                 //todo starting point
                                 //map 1 ->

                                //p1 376x136 16x16, 384x144 pos no lives
                                 mapView.applyBrush(58,34,376,136,16,16,1,1);

                                 //p2 376x160 16x16, 384x168 pos no lives
                                 mapView.applyBrush(58,40,376,160,16,16,1,1);

                                 //flag ( map no)
                                 //376x184 16 24
                                 mapView.applyBrush(58,46,376,184,16,24,1,1);



                                 //EnemyTanks
                                 mapView.applyBrush(58,6,320,192,8,8,2,10);

                                 //OK this is relative to the start pof the level
                                 this.mLevel.applyBrush( 16,  16, Level.E_BRUSH_BRICK_WALL, 16,64);
                                 this.mLevel.applyBrush( 16,  80, Level.E_BRUSH_BRICK_WALL, 16, 8);
                                 this.mLevel.applyBrush( 48,  16, Level.E_BRUSH_BRICK_WALL, 16,64);
                                 this.mLevel.applyBrush( 48,  80, Level.E_BRUSH_BRICK_WALL, 16, 8);
                                 this.mLevel.applyBrush( 80,  16, Level.E_BRUSH_BRICK_WALL, 16,48);
                                 this.mLevel.applyBrush( 80,  64, Level.E_BRUSH_BRICK_WALL, 16, 8);
                                 this.mLevel.applyBrush( 96,  48, Level.E_BRUSH_STONE_WALL, 16,16);
                                 this.mLevel.applyBrush(112,  16, Level.E_BRUSH_BRICK_WALL, 16,48);
                                 this.mLevel.applyBrush(112,  64, Level.E_BRUSH_BRICK_WALL, 16, 8);
                                 this.mLevel.applyBrush(144,  16, Level.E_BRUSH_BRICK_WALL, 16,64);
                                 this.mLevel.applyBrush(144,  80, Level.E_BRUSH_BRICK_WALL, 16, 8);
                                 this.mLevel.applyBrush(176,  16, Level.E_BRUSH_BRICK_WALL, 16,64);
                                 this.mLevel.applyBrush(176,  80, Level.E_BRUSH_BRICK_WALL, 16, 8);
                                 this.mLevel.applyBrush( 80,  88, Level.E_BRUSH_BRICK_WALL, 16,16);
                                 this.mLevel.applyBrush(112,  88, Level.E_BRUSH_BRICK_WALL, 16,16);// newl

                                 this.mLevel.applyBrush(  0, 104, Level.E_BRUSH_BRICK_WALL, 16, 8);
                                 this.mLevel.applyBrush(  0, 112, Level.E_BRUSH_STONE_WALL, 16, 8);

                                 this.mLevel.applyBrush( 32, 104, Level.E_BRUSH_BRICK_WALL, 32,16);
                                 this.mLevel.applyBrush(144, 104, Level.E_BRUSH_BRICK_WALL, 32,16);

                                 this.mLevel.applyBrush(191, 104, Level.E_BRUSH_BRICK_WALL, 16, 8);//newl
                                 this.mLevel.applyBrush(191, 112, Level.E_BRUSH_STONE_WALL, 16, 8);//newl

                                 this.mLevel.applyBrush( 16, 136, Level.E_BRUSH_BRICK_WALL, 16,48);
                                 this.mLevel.applyBrush( 16, 184, Level.E_BRUSH_BRICK_WALL, 16, 8);

                                 this.mLevel.applyBrush( 48, 136, Level.E_BRUSH_BRICK_WALL, 16,48);
                                 this.mLevel.applyBrush( 48, 184, Level.E_BRUSH_BRICK_WALL, 16, 8);//newl
                                 this.mLevel.applyBrush(144, 136, Level.E_BRUSH_BRICK_WALL, 16,48);
                                 this.mLevel.applyBrush(144, 184, Level.E_BRUSH_BRICK_WALL, 16, 8);//newl
                                 this.mLevel.applyBrush( 80, 120, Level.E_BRUSH_BRICK_WALL, 16,48);
                                 this.mLevel.applyBrush( 96, 128, Level.E_BRUSH_BRICK_WALL, 16,16);
                                 this.mLevel.applyBrush(112, 120, Level.E_BRUSH_BRICK_WALL, 16,48);//newl
                                 this.mLevel.applyBrush(176, 136, Level.E_BRUSH_BRICK_WALL, 16,48);
                                 this.mLevel.applyBrush(176, 184, Level.E_BRUSH_BRICK_WALL, 16, 8);//newl

                                 //this.mLevel.applyBrush( 88, 184, Level.E_BRUSH_BRICK_WALL,  8,48);//fails

                                 this.mLevel.applyBrush( 88, 184, Level.E_BRUSH_BRICK_WALL, 32, 8);
                                 this.mLevel.applyBrush( 88, 192, Level.E_BRUSH_BRICK_WALL, 32, 8);
                                 this.mLevel.applyBrush( 88, 200, Level.E_BRUSH_BRICK_WALL, 32, 8);

                                 //this.mLevel.applyBrush(112, 184, Level.E_BRUSH_BRICK_WALL,  8,48);//newl//fails

                                 this.mLevel.applyBrush( 96, 192, Level.E_BRUSH_HQ_ALIVE  , 16,16);//handle undefined

                                 //should be part of the map..
                                 this.mTank = Tank.newInstance(this.mLevel,0,0,false);

                                 //this.mEnemyTanks.push(
                                 //           Tank.newInstance(
                                 //             this.mLevel,
                                 //             12,8,
                                 //             true)
                                 //         );
                             }),

                             update:(function(){

                                 var tick = new Date().getTime();

                                 Global.cUpdatePaint(this.mLevel, tick );
                                 Global.cUpdatePaint(this.mTank , tick );

                                 for(var i = 0; i < this.mEnemyTanks.length ; i++ )
                                 {
                                    if(this.mEnemyTanks[i] != null)
                                    {
                                        Global.cUpdatePaint(this.mEnemyTanks[i] , tick );
                                    }
                                 }
                             }),

                             onKeyEvent:(function(bDown , oEvent){

                                 //console.log(bDown, oEvent.isAutoRepeat);
                                 console.log(bDown);
                                 if(bDown){
                                    switch(oEvent.nativeScanCode)
                                    {
                                        case this.E_KC_UP   : this.mTank.onMoveEvent(Global.E_DIR_UP    );break;
                                        case this.E_KC_DOWN : this.mTank.onMoveEvent(Global.E_DIR_DOWN  );break;
                                        case this.E_KC_LEFT : this.mTank.onMoveEvent(Global.E_DIR_LEFT  );break;
                                        case this.E_KC_RIGHT: this.mTank.onMoveEvent(Global.E_DIR_RIGHT );break;
                                        case this.E_KC_FIRE : this.mTank.onFire(); break;
                                        default:
                                            console.log(oEvent.nativeScanCode); break;
                                    }
                                 }
                                 else if(!bDown && !oEvent.isAutoRepeat)
                                 {

                                     switch(oEvent.nativeScanCode)
                                     {
                                         case this.E_KC_UP   :
                                         case this.E_KC_DOWN :
                                         case this.E_KC_LEFT :
                                         case this.E_KC_RIGHT:
                                         case this.E_KC_FIRE :
                                             this.mTank.onMoveEvent(Global.NV_E_DIR); break;
                                     }

                                 }
                             }),

                             notify:(function(iEventType,oEventPayload){
                                switch(iEventType){
                                case this.E_EVENT_INIT     : this.init      (             );break;
                                case this.E_EVENT_TIMER    : this.update    (             );break;
                                case this.E_EVENT_KEY_DOWN : this.onKeyEvent(true ,oEventPayload);break;//hmm I do not have the info pressed/rel
                                case this.E_EVENT_KEY_UP   : this.onKeyEvent(false,oEventPayload);break;
                                default: console.log("Unknown Event")                  ;break;
                                }
                             })
                         });
//=========================
    return ret;
}

//function BCCMain(timeoutEvent) {
//    var currentTime = Date.now();
//
//    console.log(currentTime);
//    console.log(timeoutEvent);
//}
