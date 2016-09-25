.import "BCCDoodad.js" as Doodad
//.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCFrameSequencePainter.js" as FramePainter
.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global

//we consider 16ms / update

var SPEED_CELLS_PER_TICK = 0.1;

function newInstance(oTank) {

    var vVel = Global.dirAndSpdToVec(oTank.currDir,1);
    var vPos = oTank.mCellPos.vPlus(Vec.Vec2(2,2)).plus(vVel.vMulC(3));

    var __ret = Doodad.BCCDoodad2o4i3b(
                FramePainter.newInstance(Vec.Vec2(320,100),Vec.Vec2(8,8),Vec.Vec2(4,1)),
                oTank.mLevel,
                vPos.mX,vPos.mY,
                2    , 2   ,
                true , true
                );

    __ret.mSelectedFrame = Vec.Vec2(oTank.currDir,0);
    __ret.mSpawningTank = oTank;
    __ret.mVel = vVel;
    __ret.mStartPos = vPos;
    __ret.mStartTick = Global.T_tick;
    __ret.update = (function(tick){

        //hmm .. globals .. not ok..
        if(this.mStartTick == 0){
            this.mStartTick = tick;
        }

        var dT = tick - this.mStartTick;
        //console.log(this.mStartTick, Global.T_tick , dT);
        this.mCellPos = this.mStartPos.vPlus(this.mVel.vMulC(dT*SPEED_CELLS_PER_TICK)).
        floor();

        if(!this.mLevel.bIsInside2v(this.mCellPos, this.mCellDim))
        {
           this.mLevel.remDynObj(this);
        }
    });

    __ret.mLevel.addDynObj(__ret);
    return __ret;
}
