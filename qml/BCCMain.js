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
                                 Global.T_tick = 0;

                                 console.log("init called");
                                 this.mLevel = Level.BCCLevel();

                                 //this.mCellsTmp = this.initLevel();

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

                                 this.mTank = Tank.newInstance(this.mLevel,0,0,false);

                                 //this.mEnemyTanks.push(
                                 //           Tank.newInstance(
                                 //             this.mLevel,
                                 //             8,4,
                                 //             true)
                                 //         );
                             }),

                             update:(function(){

                                 Global.T_tick = Global.T_tick+1;

                                 Global.cUpdatePaint(this.mLevel, Global.T_tick );
                                 Global.cUpdatePaint(this.mTank , Global.T_tick );

                                 for(var i = 0; i < this.mEnemyTanks.length ; i++ )
                                 {
                                    if(this.mEnemyTanks[i] != null)
                                    {
                                        Global.cUpdatePaint(this.mEnemyTanks[i] , Global.T_tick );
                                    }
                                 }
                             }),

                             onKeyEvent:(function(bDown , oEvent){

                                 //console.log(bDown, oEvent.isAutoRepeat);

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
