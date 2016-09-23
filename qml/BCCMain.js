//.import "BCCSimpleDoodadPainter.js" as BCCSimpleDoodadPainter
.import "BCCColorDoodadPainter.js" as ColorPainter
.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCVec.js" as Vec
.import "BCCDoodad.js" as Doodad
.import "BCCLevel.js" as Level
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

                             mLevel: null,
                             init:(function(){
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

                                 //304,32 //ok
                                 //320,32 //lost
                             }),

                             update:(function(){
                                this.mLevel.update();
                                this.mLevel.paint ();
                             }),

                             onKeyEvent:(function(bDown , oEvent){

                                 if(bDown){
                                    switch(oEvent.nativeScanCode)
                                    {
                                        case this.E_KC_UP   : this.bla.mPos.mY--;break;
                                        case this.E_KC_DOWN : this.bla.mPos.mY++;break;
                                        case this.E_KC_LEFT : this.bla.mPos.mX--;break;
                                        case this.E_KC_RIGHT: this.bla.mPos.mX++;break;
                                        case this.E_KC_FIRE : break;
                                        default:
                                            console.log(oEvent.nativeScanCode); break;
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
