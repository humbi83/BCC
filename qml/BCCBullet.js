.import "BCCDoodad.js" as Doodad
//.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCFrameSequencePainter.js" as FramePainter
.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global
.import "BCCGfx.js" as GFX

//we consider 16ms / update

var SPEED_CELLS_PER_TICK = 0.2;

var E_STATE_ALIVE    = 0;
var E_STATE_EXPLODES = 1;
var E_STATE_EXPLODED = 2;

function newInstance(oTank) {

    var vVel = Global.dirAndSpdToVec(oTank.currDir,1);

    var vPos = oTank.mCellPos.vPlus(Vec.Vec2(1,1)).plus(vVel.vMulC(2));

    var __ret = Doodad.BCCDoodad2o4i3b(
                Doodad.E_DOODAD_BULLET,
                FramePainter.newInstance(Vec.Vec2(320,100),Vec.Vec2(8,8),Vec.Vec2(4,1)),
                oTank.mLevel,
                vPos.mX ,vPos.mY,
                2    , 2   ,
                true , true
                );

    __ret.mKilledBy      = null;
    __ret.mCurrentState  = E_STATE_ALIVE;
    __ret.mSelectedFrame = Vec.Vec2(oTank.currDir,0);
    __ret.mSpawningTank  = oTank;
    __ret.mVel = vVel;
    __ret.mStartPos = vPos;
    // this doesn;t work I'll have some object passed arround for Global state
    __ret.mStartTick = 0;/*Global.T_tick*/
    __ret.onGfxDestroyed_BCCDoodad = __ret.onGfxDestroyed;
    __ret.onGfxDestroyed = (function(oPainter){
        this.mLevel.remDynObj(this);
    });
    __ret.onAnimSeqFinished = (function(oAnimSeq){
        this.mCurrentState = E_STATE_EXPLODED;
    });

    __ret.explode    = (function(){
        this.mIsVisible = false;
        this.mCurrentState = E_STATE_EXPLODES;

        var vExpPos = this.mCellPos.vPlus(Vec.Vec2(-1,-1)).plus(this.mVel.vMulC(2));
        GFX.newInstance(this.mLevel, vExpPos.mX,vExpPos.mY, GFX.E_GFX_SMALL_EXP, 0, this);
    });

    __ret.canExplode =(function(){
        return(
                this.mCurrentState = E_STATE_ALIVE &&
                this.mLCState == Global.E_DOODAD_LC_STATE_ALIVE);
    });

    __ret.update = (function(tick){

        //hmm .. globals .. not ok..
        if(this.mStartTick == 0){
            this.mStartTick = tick;
        }

        var dT = tick - this.mStartTick;

        switch(this.mCurrentState) {
            case E_STATE_ALIVE:{
                //for the moment
                    this.mCellPos = this.mStartPos.vPlus(this.mVel.vMulC(dT*SPEED_CELLS_PER_TICK)).
                    floor();

                    //var collCells = this.mLevel.collidesOn2v(this.mCellPos, this.mCellDim);
                    var collCells = this.mLevel.collidesWithStatic2v(this.mCellPos , this.mCellDim);
                    var collDyn   = this.mLevel.collidesWithDynamic2v(this);

                    if(collDyn.length > 0)
                    {
                        //kill / suck life out of it
                        for(var i = 0; i<collDyn.length ; i++)
                        {
                            var dynObj = collDyn[i];

                            switch(dynObj.mDoodadType){

                            case Doodad.E_DOODAD_BULLET:{
                                dynObj.explode();
                                this.explode();
                            }break;
                            case Doodad.E_DOODAD_BRICK_WALL :{}break;
                            case Doodad.E_DOODAD_TANK       :{
                                if(dynObj != this.mSpawningTank){
                                    dynObj.explode();
                                    this.explode();
                                }

                            }break;
                            default: //do nothing break;
                            }
                        }
                    }

                    var cExp = this.canExplode();
                    var b2 = this.mKilledBy == null;

                    //console.log("bul", cExp, b2 );

                    if(
                            //this.canExplode() &&
                            //this.mKilledBy == null &&
                            (
                                collCells.length > 0 ||
                                !this.mLevel.bIsInside2v(this.mCellPos, this.mCellDim)
                             )
                       )
                       {
                           this.explode();
                       }

            }
            break;

            case E_STATE_EXPLODED:
            {
                this.mLCState = Global.E_DOODAD_LC_STATE_DESTORY_REQ;
            }
            break;
        }

    });

    __ret.mLevel.addDynObj(__ret);
    return __ret;
}
