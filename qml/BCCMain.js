//.import "BCCSimpleDoodadPainter.js" as BCCSimpleDoodadPainter
.import "BCCColorDoodadPainter.js" as ColorPainter
.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCVec.js" as Vec
.import "BCCDoodad.js" as Doodad
.import "BCCLevel.js" as Level
.import "BCCTank.js" as Tank
.import "BCCFrameSequencePainter.js" as FSPainter
.import "BCCGlobal.js" as Global

function BCCMain()
{
    var ret = new Object({

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

                             mTank : null,
                             mLevel: null,

                             init:(function(){
                                 Global.T_tick = 0;

                                 console.log("init called");
                                 this.mLevel = Level.BCCLevel();

                                 this.mLevel.addPixXYDoodad( 16, 16, Doodad.E_DOODAD_BRICK_WALL, 16,64);
                                 this.mLevel.addPixXYDoodad( 16, 80, Doodad.E_DOODAD_BRICK_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad( 48, 16, Doodad.E_DOODAD_BRICK_WALL, 16,64);
                                 this.mLevel.addPixXYDoodad( 48, 80, Doodad.E_DOODAD_BRICK_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad( 80, 16, Doodad.E_DOODAD_BRICK_WALL, 16,48);
                                 this.mLevel.addPixXYDoodad( 80, 64, Doodad.E_DOODAD_BRICK_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad( 96, 48, Doodad.E_DOODAD_STONE_WALL, 16,16);
                                 this.mLevel.addPixXYDoodad(112, 16, Doodad.E_DOODAD_BRICK_WALL, 16,48);
                                 this.mLevel.addPixXYDoodad(112, 64, Doodad.E_DOODAD_BRICK_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad(144, 16, Doodad.E_DOODAD_BRICK_WALL, 16,64);
                                 this.mLevel.addPixXYDoodad(144, 80, Doodad.E_DOODAD_BRICK_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad(176, 16, Doodad.E_DOODAD_BRICK_WALL, 16,64);
                                 this.mLevel.addPixXYDoodad(176, 80, Doodad.E_DOODAD_BRICK_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad( 80, 88, Doodad.E_DOODAD_BRICK_WALL, 16,16);
                                 this.mLevel.addPixXYDoodad(112, 88, Doodad.E_DOODAD_BRICK_WALL, 12,16);

                                 this.mLevel.addPixXYDoodad(  0,112, Doodad.E_DOODAD_STONE_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad( 32,104, Doodad.E_DOODAD_BRICK_WALL, 32,16);
                                 this.mLevel.addPixXYDoodad(144,104, Doodad.E_DOODAD_BRICK_WALL, 32,16);
                                 this.mLevel.addPixXYDoodad(191,112, Doodad.E_DOODAD_STONE_WALL, 16, 8);

                                 this.mLevel.addPixXYDoodad( 16, 136, Doodad.E_DOODAD_BRICK_WALL, 16,48);
                                 this.mLevel.addPixXYDoodad( 16, 184, Doodad.E_DOODAD_BRICK_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad( 48, 136, Doodad.E_DOODAD_BRICK_WALL, 16,48);
                                 this.mLevel.addPixXYDoodad( 48, 184, Doodad.E_DOODAD_BRICK_WALL, 16, 8);


                                 this.mLevel.addPixXYDoodad(144, 136, Doodad.E_DOODAD_BRICK_WALL, 16,48);
                                 this.mLevel.addPixXYDoodad(144, 184, Doodad.E_DOODAD_BRICK_WALL, 16, 8);

                                 this.mLevel.addPixXYDoodad( 80, 120, Doodad.E_DOODAD_BRICK_WALL, 16, 48);
                                 this.mLevel.addPixXYDoodad( 96, 128, Doodad.E_DOODAD_BRICK_WALL, 16, 16);
                                 this.mLevel.addPixXYDoodad(112, 120, Doodad.E_DOODAD_BRICK_WALL, 16, 48);


                                 this.mLevel.addPixXYDoodad(176, 136, Doodad.E_DOODAD_BRICK_WALL, 16,48);
                                 this.mLevel.addPixXYDoodad(176, 184, Doodad.E_DOODAD_BRICK_WALL, 16, 8);


                                 this.mLevel.addPixXYDoodad( 88, 184, Doodad.E_DOODAD_BRICK_WALL, 8, 48);
                                 this.mLevel.addPixXYDoodad( 96, 184, Doodad.E_DOODAD_BRICK_WALL, 16, 8);
                                 this.mLevel.addPixXYDoodad(112, 184, Doodad.E_DOODAD_BRICK_WALL, 8, 48);

                                 this.mLevel.addPixXYDoodad( 96, 192, Doodad.E_DOODAD_HQ_2F, 0, 0);//handle undefined

                                 this.mTank = Tank.newInstance(this.mLevel);
                                 //304,32 //ok
                                 //320,32 //lost
                             }),

                             update:(function(){

                                 Global.T_tick++;
                                 Global.cUpdatePaint(this.mLevel);
                                 Global.cUpdatePaint(this.mTank);
                             }),

                             onKeyEvent:(function(bDown , oEvent){

                                 console.log(bDown, oEvent.isAutoRepeat);

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
    return ret;
}

//function BCCMain(timeoutEvent) {
//    var currentTime = Date.now();
//
//    console.log(currentTime);
//    console.log(timeoutEvent);
//}
