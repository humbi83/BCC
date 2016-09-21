.import "BCCSimpleDoodadPainter.js" as BCCSimpleDoodadPainter

function BCCMain()
{
    var ret = new Object({

                             //TODO:ALEX: Move this from here
                             bla: null,

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
                             init:(function(){
                                 console.log("init called");
                                 this.bla = BCCSimpleDoodadPainter.BCCSimpleDooodadPainter(null);

                             }),

                             update:(function(){
                                this.bla.paint();
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
                                            console.log(event.nativeScanCode); break;
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
