.import "BCCDoodad.js" as Doodad
.import "BCCFrameSequencePainter" as FSPainter
.import "BCCVec.js" as Vec

var E_CELLS_PER_SECOND=10;
//u01/l23/d45/r67

var E_TNK_UP    = 0;
var E_TNK_LEFT  = 2;
var E_TNK_DOWN  = 4;
var E_TNK_RIGHT = 6;

function newInstance(oLevel) {
    var ret = return Doodad.BCCDoodad2o4i3b(
                FSPainter.newInstance(Vec.Vec2(0,0),Vec.Vec2(16, 16),Vec.Vec2(1,8)),
                oLevel,0,0,4, 4,true,false
                );

    ret.mSelectedFrame = Vec.Vec2();
    ret.mIsKeyPressed  = false;
    ret.mPrevTick      = 0;
    ret.onKeyEvent= (function(bKeyDown, eDir){
        this.mSelectedFrame.x = eDir;
        switch(eDir){
            case E_TNK_UP    : this.mCellPos.mY--; break;
            case E_TNK_LEFT  : this.mCellPos.mX--; break;
            case E_TNK_DOWN  : this.mCellPos.mY++; break;
            case E_TNK_RIGHT : this.mCellPos.mX++; break;
            default: console.log("onKeyEvent unknown"); this.mSelectedFrame.x = 0; break;
        }
    });

    //ret.update(function(){});

    return ret;
}
