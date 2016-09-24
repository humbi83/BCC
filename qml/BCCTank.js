.import "BCCDoodad.js" as Doodad
.import "BCCFrameSequencePainter.js" as FSPainter
.import "BCCVec.js" as Vec

var E_CELLS_PER_SECOND=10;
//u01/l23/d45/r67

var NV_E_TNK    = -1;
var E_TNK_UP    =  0;
var E_TNK_LEFT  =  2;
var E_TNK_DOWN  =  4;
var E_TNK_RIGHT =  6;

function newInstance(oLevel) {
    var ret = Doodad.BCCDoodad2o4i3b(
                FSPainter.newInstance(Vec.Vec2(0,0),Vec.Vec2(16, 16),Vec.Vec2(1,8)),
                oLevel,0,0,4, 4,true,false
                );

    ret.mSelectedFrame = Vec.Vec2();
    ret.mIsKeyPressed  = false;
    ret.mPrevTick      = 0;

    ret.currDir      = NV_E_TNK;
    ret.currDirFrame = 0;

    ret.calcUpdatedPos = ( function(eDir,vPos){
        switch(eDir){
            case E_TNK_UP    : vPos.mY--; break;
            case E_TNK_LEFT  : vPos.mX--; break;
            case E_TNK_DOWN  : vPos.mY++; break;
            case E_TNK_RIGHT : vPos.mX++; break;
            default: console.log("onKeyEvent unknown"); this.mSelectedFrame.x = 0; break;
        }

        return vPos;
    });

    ret.onMoveEvent = (function(eDir){

        if(this.currDir != eDir){
            this.currDir = eDir;
            this.currDirFrame = 0;
        }

        this.mSelectedFrame.mX = this.currDir + (this.currDirFrame++)%2;

        var newPos = this.calcUpdatedPos(eDir,Vec.cctor(this.mCellPos));

        if(this.mLevel.bIsInside2v(newPos,this.mCellDim)){

        var collidingCells = this.mLevel.collidesOn2v(newPos,this.mCellDim);

            if(collidingCells != null && collidingCells.length > 0){
            //for the moment, do not update
            }else
            {
                this.mCellPos = newPos;
            }
        }

    });

    //ret.update(function(){});

    return ret;
}

