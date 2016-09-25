.import "BCCDoodad.js" as Doodad
//.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCFrameSequencePainter.js" as FramePainter
.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global

//we consider 16ms / update

var SPEED_CELLS_PER_TICK = 0.2;

function newInstance(oTank) {

    var vVel = Global.dirAndSpdToVec(oTank.currDir,1);

    var vPos = oTank.mCellPos.vPlus(Vec.Vec2(1,1)).plus(vVel.vMulC(2));

    var __ret = Doodad.BCCDoodad2o4i3b(
                FramePainter.newInstance(Vec.Vec2(320,100),Vec.Vec2(8,8),Vec.Vec2(4,1)),
                oTank.mLevel,
                vPos.mX ,vPos.mY,
                2    , 2   ,
                true , true
                );

    __ret.mSelectedFrame = Vec.Vec2(oTank.currDir,0);
    __ret.mSpawningTank = oTank;
    __ret.mVel = vVel;
    __ret.mStartPos = vPos;
    // this doesn;t work I'll have some object passed arround for Global state
    __ret.mStartTick = 0;/*Global.T_tick*/
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
        //console.log(this.mStartTick, Global.T_tick , dT);
        this.mCellPos = this.mStartPos.vPlus(this.mVel.vMulC(dT*SPEED_CELLS_PER_TICK)).
        floor();

        if(!this.mLevel.bIsInside2v(this.mCellPos, this.mCellDim) && this.mLCState == Global.E_DOODAD_LC_STATE_ALIVE)
        {
            //die
           console.log("should die")
           this.mLCState = Global.E_DOODAD_LC_STATE_DESTORY_REQ;

          //this.mLevel.remDynObj(this); on destroy I should do it
            //so at least for the moment in painter
        }
    });

    __ret.mLevel.addDynObj(__ret);
    return __ret;
}
