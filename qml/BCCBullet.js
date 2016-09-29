.import "BCCDoodad.js" as Doodad
.import "BCCMultiFrameDoodad.js" as MFDoodad
.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global
.import "BCCGfx.js" as GFX
.import "BCCLevel.js" as Level;

//we consider 16ms / update

var SPEED_CELLS_PER_TICK = 0.2;

var E_STATE_ALIVE     = 0;
var E_STATE_EXPLODING = 1;
var E_STATE_EXPLODED  = 2;

function newInstance(oTank) {

    var vVel = Global.dirAndSpdToVec(oTank.currDir,1);

    var vPos = oTank.mCellPos.vPlus(Vec.Vec2(1,1)).plus(vVel.vMulC(2));

    var __ret = MFDoodad.newInstance(
                Doodad.E_DOODAD_BULLET,
                Vec.Vec2(320,100),Vec.Vec2(8,8),Vec.Vec2(4,1),
                oTank.mLevel,
                vPos.mX ,vPos.mY,
                true , true
                );

    __ret.mCurrentState  = E_STATE_ALIVE;

    __ret.mListener = __ret.mLevel;

    __ret.setCurrentFrame(Vec.Vec2(oTank.currDir,0));

    __ret.mSpawningTank  = oTank;
    __ret.mVel = vVel;
    __ret.mStartPos = vPos;
    // this doesn;t work I'll have some object passed arround for Global state
    __ret.mStartTick = 0;/*Global.T_tick*/

    __ret.explode    = (function(){

        if(this.canExplode()){
            this.setVisible(false);
            this.mCurrentState = E_STATE_EXPLODING; //basically dead

            //spaw explosion && add it to the level for book keeping
            var vExpPos = this.mCellPos.vPlus(Vec.Vec2(-1,-1)).plus(this.mVel.vMulC(2));
            this.mLevel.addDynObj(GFX.newInstance(this.mLevel, vExpPos.mX,vExpPos.mY, GFX.E_GFX_SMALL_EXP));
        }
    });

    __ret.canExplode =(function(){
        return this.mCurrentState == E_STATE_ALIVE;
    });

    __ret.update = (function(tick){

        //hmm .. globals .. not ok..
        if(this.mStartTick == 0){
            this.mStartTick = tick;
        }

        var dT = tick - this.mStartTick;

        switch(this.mCurrentState) {
            case E_STATE_ALIVE:{

                    var pixPos = this.mStartPos.vPlus(this.mVel.vMulC(dT*SPEED_CELLS_PER_TICK)).mulC(4);
                    this.setPixXY(pixPos.mX,pixPos.mY);

                    var cellDim = this.getCellDim();

                    var collidingDoodads = this.mLevel.collidesWithStatic2v(this.mCellPos , cellDim);
                    collidingDoodads.concat(this.mLevel.collidesWithDynamic2v(this));

                    if(collidingDoodads.length > 0)
                    {
                        for(var i = 0; i<collidingDoodads.length ; i++)
                        {
                            var dynObj = collidingDoodads[i];

                            switch(dynObj.mDoodadType){

                            case Doodad.E_DOODAD_BULLET:{
                                if(dynObj.mSpawningTank != this.mSpawningTank)
                                {
                                    dynObj.explode();
                                }
                            }break;

                            case Doodad.E_DOODAD_BRICK_WALL :{
                                var pixPos = dynObj.getPixPos();
                                var celPos = dynObj.mCellPos;
                                var cell = this.mLevel.mCells[celPos.mY][celPos.mX];
                                var dStationed = cell.mStationedDoodad;
                                cell.mStationedDoodad = null;
                                this.mLevel.applyBrush( pixPos.mX, pixPos.mY, Level.E_BRUSH_EMPTY, 4,4);
                            }break;

                            case Doodad.E_DOODAD_TANK       :{
                                if(dynObj != this.mSpawningTank){
                                    dynObj.explode();                                    
                                }
                            }break;

                            case Doodad.E_DOODAD_HQ_ALIVE    :{
                                this.mLevel.applyBrush( 96, 192, Level.E_BRUSH_HQ_DEAD, 16,16);
                            }break;
                                default: //do nothing
                                     console.log("stuff");
                                    break;
                            }
                        }
                    }

                    if( collidingDoodads.length > 0 || !this.mLevel.bIsInside2v(this.mCellPos, cellDim))
                    {
                        this.explode();
                    }

            }
            break;

            case E_STATE_EXPLODING:{
                if(this.mListener != null){
                    this.mListener.onAnimSeqFinished(this);
                    this.mCurrentState = E_STATE_EXPLODED;
                }
            }
                break;
            case E_STATE_EXPLODED:
                //do nothing
                break;
        }

    });

    return __ret;
}
