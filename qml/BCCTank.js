.import "BCCDoodad.js" as Doodad
.import "BCCFrameSequencePainter.js" as FSPainter
.import "BCCVec.js" as Vec
.import "BCCBullet.js" as Bullet
.import "BCCGlobal.js" as Global

var E_CELLS_PER_SECOND=10;
var TNK_FRAMES_PER_DIR= 2;
//u01/l23/d45/r67

function newInstance(oLevel) {
    var ret = Doodad.BCCDoodad2o4i3b(
                FSPainter.newInstance(Vec.Vec2(0,0),Vec.Vec2(16, 16),Vec.Vec2(1,8)),
                oLevel,0,0, 4, 4,true,false
                );

    //needed by FSPainter ... I need some clear interfaces !!!
    ret.mSelectedFrame = Vec.Vec2();


    ret.mIsKeyPressed  = false;
    ret.mPrevTick      = 0;
//todo mCurrDir
    ret.currDir      = Global.NV_E_DIR;
    ret.currDirFrame = 0;

    ret.calcUpdatedPos = ( function(eDir,vPos){
        switch(eDir){
            case Global.E_DIR_UP    : vPos.mY--; break;
            case Global.E_DIR_LEFT  : vPos.mX--; break;
            case Global.E_DIR_DOWN  : vPos.mY++; break;
            case Global.E_DIR_RIGHT : vPos.mX++; break;
            default: console.log("onKeyEvent unknown"); this.mSelectedFrame.x = 0; break;
        }

        return vPos;
    });

    //dead    // something something
    //revived // something something
    //canFire // something something
    //powTaken// something something

    //only on audio ch
    //music top prio
    // pow sfx
    // tras + motor player -- same lvl
    //motor enemy
    ret.onFire = (function()
    {
        //just spawn a bullet
        Bullet.newInstance(this);

    });

    ret.onMoveEvent = (function(eDir){

        if(eDir == Global.NV_E_DIR){
           // channel1.stop();
        }else
        {
            channel1.source = "../res/tank1.wav"
            //channel1.play();


            if(this.currDir != eDir){
                this.currDir = eDir;
                this.currDirFrame = 0;
            }

            this.mSelectedFrame.mX = this.currDir * TNK_FRAMES_PER_DIR + (this.currDirFrame++)%TNK_FRAMES_PER_DIR;

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
        }
    });

    //ret.update(function(){});

    return ret;
}

