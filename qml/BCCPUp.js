.import "BCCDoodad.js" as Doodad
.import "BCCFrameSequencePainter.js" as FramePainter
.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global

//we consider 16ms / update

var FLASH_PER_TICK = 0.2;

var E_PU_HEAD    = 0;
var E_PU_CLOCK   = 1;
var E_PU_SHOVEL  = 2;
var E_PU_STAR    = 3;
var E_PU_GRENADE = 4;
var E_PU_TANK    = 5;
var E_PU_PISTOL  = 6;

function newInstance(oLevel, iX, iY, ePU) {


    var __ret = Doodad.BCCDoodad2o4i3b(
                Doodad.E_DOODAD_POWUP,
                FramePainter.newInstance(Vec.Vec2(255,112),Vec.Vec2(16,16),Vec.Vec2(7,1)),
                oLevel,
                iX ,iY,
                4    , 4   ,
                true , true
                );

    //update related
    __ret.mStartTick = 0;/*Global.T_tick*/
    __ret.mSelectedFrame = Vec.Vec2(ePU,0);
    __ret.onGfxDestroyed_BCCDoodad = __ret.onGfxDestroyed;
    __ret.onGfxDestroyed = (function(oPainter){
        this.mLevel.remDynObj(this);
    });

    __ret.update = (function(tick){

        //hmm .. globals .. not ok..
        if(this.mStartTick == 0){
            this.mStartTick = tick;
        }

        var dT = tick - this.mStartTick;

        var computedVal = Math.floor(dT * FLASH_PER_TICK ) ;

        this.mIsVisible = (computedVal % 2 == 0);

        //console.log(this.mIsVisible, tick, this.mStartTick, dT, computedVal );
        //will die on timeout or pickup by player
        //this.mLCState = Global.E_DOODAD_LC_STATE_DESTORY_REQ;

    });

    __ret.mLevel.addDynObj(__ret);
    return __ret;
}
