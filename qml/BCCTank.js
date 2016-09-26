.import "BCCDoodad.js" as Doodad
.import "BCCFrameSequencePainter.js" as FSPainter
.import "BCCVec.js" as Vec
.import "BCCBullet.js" as Bullet
.import "BCCGlobal.js" as Global
.import "BCCGfx.js" as GFX

var E_CELLS_PER_SECOND=10;
var TNK_FRAMES_PER_DIR= 2;
//u01/l23/d45/r67



var DT_TANK_TELEPORT  = 2000 / 16;
var DT_TANK_SHIELDED  = 3000 / 16;


var E_STATE_TELEPORTING   = 0;//2 sec
var E_STATE_SHIELDED      = 1;////3 sec
var E_STATE_NORMAL        = 2;
var E_STATE_POWUP         = 3;//flashes red, I need 2 painters
var E_STATE_EXPLODING     = 4;
var E_STATE_EXPLODED      = 5;


//I will need 2 paintes

function newInstance(oLevel, iX, iY, bEnemy) {

    var pX = iX != undefined ? iX : 0;
    var pY = iY != undefined ? iY : 0;
    var pEnemy = bEnemy != undefined ? bEnemy : true;

    var ret = Doodad.BCCDoodad2o4i3b(
                Doodad.E_DOODAD_TANK,
                FSPainter.newInstance(
                    Vec.Vec2( 0,  0),
                    Vec.Vec2(16, 16),
                    Vec.Vec2( 1,  8)
                    ),
                oLevel,
                pX,pY,
                4, 4,
                true,false
                );

    //see what I should do regarding interfaces !!!
    //explode, canExplode
    ret.explode = (function(){
        var ret = false;

        if(this.canExplode()){
            this.mCurrentState = E_STATE_EXPLODING;
            this.mCurrentGfx   = GFX.newInstance(
                     this.mLevel,
                     this.mCellPos.mX, this.mCellPos.mY,
                     1, this);
            this.mIsVisible    = false;
            ret = true;
        }
        return ret;
    });

    ret.canExplode = (function(){
        return (
            this.mCurrentState ==  E_STATE_NORMAL ||
            this.mCurrentState ==  E_STATE_POWUP );
    });

    ret.onAnimSeqFinished = (function (oAnimSeq){
        switch(this.mCurrentState)
        {
        case E_STATE_TELEPORTING : {

            if(!this.mIsEnemy){
            this.mCurrentState = E_STATE_SHIELDED;
            this.mIsVisible = true;
            this.mCurrentGfx = GFX.newInstance(
                        this.mLevel     ,
                        this.mCellPos.mX,
                        this.mCellPos.mY,
                        GFX.E_GFX_SHILED,
                        Math.floor(DT_TANK_SHIELDED / GFX.ANIM_FRAME_LEN[GFX.E_GFX_SHILED]),
                        this
                        );
            }else
            {
                this.mCurrentState = E_STATE_NORMAL;
                this.mIsVisible = true;
            }
        } break;
        case E_STATE_SHIELDED    : {
            this.mCurrentState = E_STATE_NORMAL;
            this.mCurrentGfx = null;
            //if(something) { this}

        } break;
        case E_STATE_EXPLODING:
        {
            //do things
            if(this.isEnemy){
            }else
            {
            }

            this.mLCState = Global.E_DOODAD_LC_STATE_DESTROY_REQ;
            console.log("BCCTank::onAnumSeqFinished::E_STATE_EXPLODING");
        } break;

        default                  : console.log("BCCTank::onAnimSeqFinished::default");break;
        }
    });
    ret.mCurrentGfx = GFX.newInstance(oLevel,pX,pY,GFX.E_GFX_TELEPORT,0,ret);

    ret.mIsEnemy = pEnemy;

    ret.mCurrentState = E_STATE_TELEPORTING;

    ret.mIsVisible    = false;

    //needed by FSPainter ... I need some clear interfaces !!!
    ret.mSelectedFrame = Vec.Vec2();


    ret.mIsKeyPressed  = false;

//todo mCurrDir
    ret.currDir      = Global.NV_E_DIR;
    ret.currDirFrame = 0;

    ret.calcUpdatedPos = ( function(eDir,vPos){

        if(this.canMove()){
            switch(eDir){
                case Global.E_DIR_UP    : vPos.mY--; break;
                case Global.E_DIR_LEFT  : vPos.mX--; break;
                case Global.E_DIR_DOWN  : vPos.mY++; break;
                case Global.E_DIR_RIGHT : vPos.mX++; break;
                default: console.log("onKeyEvent unknown"); this.mSelectedFrame.x = 0; break;
            }
        }

        return vPos;
    });


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

            var collidingCells = this.mLevel.collidesWithStatic2v(newPos,this.mCellDim);

                if(collidingCells != null && collidingCells.length > 0){
                //for the moment, do not update
                }else
                {
                    this.mCellPos = newPos;
                }
            }
        }
    });

    ret.canMove = (function(){
        return(
        this.mCurrentState == E_STATE_SHIELDED ||
        this.mCurrentState == E_STATE_NORMAL   ||
        this.mCurrentState == E_STATE_POWUP
                    );
    });

    ret.update = (function(tick){
        //hmm .. globals .. not ok..
        if(this.mStartTick == 0){
            this.mStartTick = tick;
        }

        var dT = tick - this.mStartTick;

        switch(this.mCurrentState){
            case E_STATE_SHIELDED   :{
                if(this.mCurrentGfx != null){
                    this.mCurrentGfx.mCellPos.setV(this.mCellPos);
                }
            }break;
            case E_STATE_NORMAL     :{}break;
            case E_STATE_POWUP      :{}break;
            case E_STATE_EXPLODING  :{

            }break;
            default: console.log("BBCTank::update::default!");
        }

    });

    ret.mLevel.addDynObj(ret);

    return ret;
}

