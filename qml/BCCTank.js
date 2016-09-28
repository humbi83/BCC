.import "BCCDoodad.js" as Doodad
.import "BCCFrameSequencePainter.js" as FSPainter
.import "BCCMultiFrameDoodad.js" as MFDoodad
.import "BCCVec.js" as Vec
.import "BCCBullet.js" as Bullet
.import "BCCGlobal.js" as Global
.import "BCCGfx.js" as GFX
.import "BCCTankAI.js" as AI

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

    var pX     = iX     != undefined ? iX     : 0;
    var pY     = iY     != undefined ? iY     : 0;
    var pEnemy = bEnemy != undefined ? bEnemy : true;

    var ret = MFDoodad.newInstance(
                Doodad.E_DOODAD_TANK,
                Vec.Vec2( 0,  0),
                Vec.Vec2(16, 16),
                Vec.Vec2( 1,  8),
                oLevel,
                pX,pY,                
                true,false
                );

    //see what I should do regarding interfaces !!!
    //explode, canExplode
    ret.mAI = pEnemy ? AI.newInstance(ret) : null;
    ret.explode = (function(){
        var ret = false;

        if(this.canExplode()){
            this.mCurrentState = E_STATE_EXPLODING;
            this.mCurrentGfx   = GFX.newInstance(
                     this.mLevel,
                     this.mCellPos.mX, this.mCellPos.mY,
                     1, this);
            this.setVisible(false);
            ret = true;
        }
        return ret;
    });

    ret.canExplode = (function(){
        return (
            this.mCurrentState ==  E_STATE_NORMAL ||
            this.mCurrentState ==  E_STATE_POWUP );
    });
/*
    if(this.mAI != null){
        this.mAI.onTankStatusUpdate(AI.E_TANK_STATUS_TELEPORTING);
    }
    if(this.mAI != null){
        this.mAI.onTankStatusUpdate(AI.E_TANK_STATUS_MOVABLE);
        this.mAI.onTankStatusUpdate(AI.E_TANK_STATUS_DEAD);
    }
  */

    ret.shieldUp = (function(){
        this.mCurrentState = E_STATE_SHIELDED;
        this.setVisible(true);
        this.mCurrentGfx = GFX.newInstance(
                    this.mLevel     ,
                    this.mCellPos.mX,
                    this.mCellPos.mY,
                    GFX.E_GFX_SHILED,
                    Math.floor(DT_TANK_SHIELDED / GFX.ANIM_FRAME_LEN[GFX.E_GFX_SHILED]),
                    this
                    );
    })
    ret.onAnimSeqFinished = (function (oAnimSeq){
        oAnimSeq.releaseInstance();
        this.mCurrentGfx = null;

        switch(this.mCurrentState)
        {
        case E_STATE_TELEPORTING : {

            if(!this.mIsEnemy){
                this.shieldUp();
            }else
            {
                this.mCurrentState = E_STATE_NORMAL;
                this.mIsVisible( true );
                if(this.mAI != null){
                    this.mAI.onTankStatusUpdate(AI.E_TANK_STATUS_MOVABLE);
                }
            }
        } break;
        case E_STATE_SHIELDED    : {
            this.mCurrentState = E_STATE_NORMAL;

        } break;
        case E_STATE_EXPLODING:
        {

            //TODO: IMPLEMENT RESPAWN
            //do things
            if(this.isEnemy){
                if(this.mAI != null){
                    this.mAI.onTankStatusUpdate(AI.E_TANK_STATUS_DEAD);
                }
            }else
            {
            }


            console.log("BCCTank::onAnumSeqFinished::E_STATE_EXPLODING");
        } break;

        default                  : console.log("BCCTank::onAnimSeqFinished::default");break;
        }
    });




    ret.mIsEnemy = pEnemy;
    //ret.mCurrentGfx = GFX.newInstance(oLevel,pX,pY,GFX.E_GFX_TELEPORT,0,ret);\
    //ret.mCurrentState = E_STATE_TELEPORTING;
    //ret.setVisible(false);

    ret.mCurrentGfx = null;
    ret.mCurrentState = E_STATE_NORMAL;
    ret.setVisible(true);

    ret.setCurrentFrame();
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
                default: console.log("onKeyEvent unknown"); this.setCurrentFrame(); break;
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
        this.mLevel.addDynObj(Bullet.newInstance(this));
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

            var cFrm = this.currDir * TNK_FRAMES_PER_DIR + (this.currDirFrame++)%TNK_FRAMES_PER_DIR;
            this.setCurrentFrame(Vec.Vec2(cFrm,0));

            //TODO: move nicely
            var newPos = this.calcUpdatedPos(eDir,Vec.cctor(this.mCellPos));

            var cellDim = this.getCellDim();

            if(this.mLevel.bIsInside2v(newPos,cellDim)){

            var collidingCells = this.mLevel.collidesWithStatic2v(newPos,cellDim);
            collidingCells.concat(this.mLevel.collidesWithDynamic2v(this));

                if(collidingCells.length > 0){
                //for the moment, do not update
                    if(this.mAI != null){
                        this.mAI.onTankStatusUpdate(AI.E_TANK_STATUS_BLOCKED_MOV);
                    }
                }else
                {
                    this.setCellPos(newPos);
                }
            }else{
                if(this.mAI != null){
                    this.mAI.onTankStatusUpdate(AI.E_TANK_STATUS_BLOCKED_MOV);
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

        //manually update paint the gfx
        if(this.mCurrentGfx != null)
        {
            Global.cUpdatePaint(this.mCurrentGfx,tick);
        }

        //move this to the updatable list
        if(this.mAI != null){
            this.mAI.update(tick);
        }

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
            case E_STATE_NORMAL     :{

                this.mPainter.invalidate();
            }break;
            case E_STATE_POWUP      :{}break;
            case E_STATE_EXPLODING  :{
            }break;
            default: console.log("BBCTank::update::default!");
        }

    });

    return ret;
}

