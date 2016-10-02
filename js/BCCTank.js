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



var DT_TANK_TELEPORT  = 2000;
var DT_TANK_SHIELDED  = 3000;
var DT_TANK_CELLS_PER_MS = 52 / 6000; // full map lenght in 6 sec

var E_STATE_TELEPORTING   = 0;//2 sec
var E_STATE_SHIELDED      = 1;////3 sec
var E_STATE_NORMAL        = 2;
var E_STATE_POWUP         = 3;//flashes red
var E_STATE_EXPLODING     = 4;
var E_STATE_EXPLODED      = 5;
var E_STATE_FROZEN        = 6;


//I will need 2 paintes

function newInstance(oLevel, iX, iY, ePlayer, oListener) {

    var pX     = iX       != undefined ? iX     : 0;
    var pY     = iY       != undefined ? iY     : 0;
    var pPlayer = ePlayer != undefined ? ePlayer : Global.E_PLAYER_AI_X;
    var tOffX = pPlayer == Global.E_PLAYER_AI_X ? 8*16 : 0;
    var tOffY = pPlayer == Global.E_PLAYER_AI_X ? 4*16 : 0;
    var ret = MFDoodad.newInstance(
                Doodad.E_DOODAD_TANK,
                Vec.Vec2(tOffX,  tOffY),
                Vec.Vec2(   16,     16),
                Vec.Vec2(    1,      8),
                oLevel,
                pX, pY,
                true,false
                );


    //ret.log = console.log;
    ret.log = (function(){});
    ret.mListener = oListener != undefined && oListener != null ? oListener : oLevel;
    ret.mCanFire = true;
    ret.mAI = pPlayer == Global.E_PLAYER_AI_X ? AI.newInstance(ret) : null;
    ret.explode = (function(){
        var ret = false;

        if(this.canExplode()){
            this.mCurrentState = E_STATE_EXPLODING;
            this.mCurrentGfx   = GFX.newInstance(
                     this.mLevel,
                     this.mCellPos.mX-2, this.mCellPos.mY-2,
                     GFX.E_GFX_BIG_EXP,
                     1, this);
            this.setVisible(false);
            ret = true;


        }
        return ret;
    });


    //can i be in frozen + shield ?? no
    ret.canExplode = (function(){
        return (
            this.mCurrentState ==  E_STATE_NORMAL ||
            this.mCurrentState ==  E_STATE_POWUP  ||
            this.mCurrentState ==  E_STATE_FROZEN
                    );
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

            if(this.mPlayerType != Global.E_PLAYER_AI_X){
                this.shieldUp();
            }else
            {
                this.mCurrentState = E_STATE_NORMAL;
                this.setVisible( true );
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

            if(this.mListener != null){
                //not the best name
                this.mListener.onAnimSeqFinished(this);
            }


            this.log("BCCTank::onAnumSeqFinished::E_STATE_EXPLODING");
        } break;

        default                  : this.log("BCCTank::onAnimSeqFinished::default");break;
        }
    });




    ret.mPlayerType = pPlayer;
    ret.mCurrentGfx = GFX.newInstance(oLevel,pX,pY,GFX.E_GFX_TELEPORT,0,ret);
    ret.mCurrentState = E_STATE_TELEPORTING;
    ret.setVisible(false);

    //ret.mCurrentGfx = null;
    //ret.mCurrentState = E_STATE_NORMAL;
    //ret.setVisible(true);

    ret.setCurrentFrame();
    ret.mIsKeyPressed  = false;

//todo mCurrDir
    ret.currDir      = Global.NV_E_DIR;
    ret.currDirFrame = 0;

    ret.lutDirToVec = ( function(eDir){
        var __ret = Vec.Vec2();
        if(this.canMove()){
            switch(eDir){
                case Global.E_DIR_UP    : __ret =  Vec.Vec2( 0,-1);/*mY--;*/ break;
                case Global.E_DIR_LEFT  : __ret =  Vec.Vec2(-1, 0);/*mX--;*/ break;
                case Global.E_DIR_DOWN  : __ret =  Vec.Vec2( 0, 1);/*mY++;*/ break;
                case Global.E_DIR_RIGHT : __ret =  Vec.Vec2( 1, 0);/*mX++;*/ break;
                default: this.log("calcUpdatedPos unknown"); this.setCurrentFrame(); break;
            }
        }

        return __ret;
    });


    //only on audio ch
    //music top prio
    // pow sfx
    // tras + motor player -- same lvl
    //motor enemy
    ret.onFire = (function()
    {
        //so what ..
        if(this.canMove() &&  this.mCanFire){

            //will be true when Bullet Exp
            this.mCanFire = false;
            this.mLevel.addDynObj(Bullet.newInstance(this));
        }
    });


    ret.mTargetDir    = Vec.Vec2(0,0);
    ret.mTargetCell   = ret.mCellPos;
    ret.mCurrentPixPos= ret.getPixPos();


    //TODO:ALEX move to update & animate movement
    ret.onMoveEvent = (function(eDir){

        if(eDir == Global.NV_E_DIR){
           // channel1.stop();
           ///ret.mTargetCell = this.mCellPos;
            this.log(0);
        }else
        {
            //channel1.source = "../res/tank1.wav"
            //channel1.play();

            this.log(1);
            var dirChanged = false;
            var isCurrentlyStationary = this.mTargetDir.mX == 0 && this.mTargetDir.mY == 0;

            if(this.currDir != eDir){
                this.log(2);
                this.currDir = eDir;
                this.currDirFrame = 0;
                dirChanged = true;
            }

            var cFrm = this.currDir * TNK_FRAMES_PER_DIR + (this.currDirFrame++)%TNK_FRAMES_PER_DIR;
            this.setCurrentFrame(Vec.Vec2(cFrm,0));

            var newTargetDir  = this.lutDirToVec(eDir);

            //if ret mag != 0 .. do stuff

            var newTargetCell = this.mCellPos.vPlus(newTargetDir);

            var cellDim = this.getCellDim(); // this is kinda const

            var isNewTargetCellInside = this.mLevel.bIsInside2v(newTargetCell,cellDim);


            if(isNewTargetCellInside){
                this.log(3);
                var staticCC = this.mLevel.collidesWithStatic2v(newTargetCell,cellDim);
                var dynCC    = this.mLevel.collidesWithDynamic2v(this,newTargetCell);

                var allPassable = staticCC.length == 0;

                for(var i = 0 ; i<dynCC.length && allPassable; i++)
                {
                    allPassable = dynCC[i].mIsPassable;
                }

                if(allPassable){

                    this.log(4);
                    if(dirChanged){
                        this.log(5);
                        this.setCellPos(this.mCellPos);
                        this.mPrevTick = 0;
                    }

                    this.mTargetDir  = newTargetDir;
                    this.mTargetCell = newTargetCell;

                }else if(this.mAI != null){
                    this.mAI.onTankStatusUpdate(AI.E_TANK_STATUS_BLOCKED_MOV);
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

    ret.spd = 52 / 8000;

    ret.mPrevTick = 0;
    ret.updatePos = (function(tick){

        if(this.mTargetDir.mX != 0 || this.mTargetDir.mY != 0){

            this.log("6_1", this.mTargetDir    .mX, this.mTargetDir    .mY);
            this.log("6_2", this.mCellPos      .mX, this.mCellPos      .mY);
            this.log("6_3", this.mTargetCell   .mX, this.mTargetCell   .mY);
            this.log("6_4", this.mCurrentPixPos.mX, this.mCurrentPixPos.mY);

            if(this.mPrevTick == 0)
            {
                this.log(7);
                this.mCurrentPixPos = this.getPixPos();
                this.mPrevTick = tick;
            }

            var dT = tick - this.mPrevTick;
            //all pix posz are relative to level
            var targetPixPos = this.mTargetCell.vMulC(Global.LEVEL_CELL_PIX_SZ);
            this.log("8_0", targetPixPos.mX, targetPixPos.mY );

            if( !targetPixPos.bEquals(this.mCurrentPixPos))
            {
                var sDt = ret.spd * dT;
                this.log("8_1",sDt, ret.spd, dT);

                var dCellXY = this.mTargetDir.vMulC(sDt);
                var dPixXY  = dCellXY.vMulC(Global.LEVEL_CELL_PIX_SZ);

                this.log("8_2",dCellXY.mX, dCellXY.mY, dPixXY.mX, dPixXY.mY);

                var newPixPos = dPixXY.vPlus(this.mCurrentPixPos);

                var diffPos   = targetPixPos.vMinus(newPixPos).vMulCW(this.mTargetDir);
                var xySum = diffPos.mX + diffPos.mY;

                this.log("8_3",xySum, newPixPos.mX, newPixPos.mY);

                //we overshot, I should not do it over dscrt steps but recomp from the beg, lots of errors add up
                if(xySum < 0){

                    this.log("9_1");
                    this.mCurrentPixPos = Vec.cctor(targetPixPos);
                    this.setPixPos(this.mCurrentPixPos);
                    //I should compute the mag here
                    this.mTargetDir = Vec.Vec2();
                    this.mTargetCell = Vec.cctor(this.mCellPos);
                    this.mPrevTick = 0; // I need to settle on what it means not to move / no need to move

                }else
                {
                    this.log(10);
                    this.setPixPos(newPixPos);
                    this.mCurrentPixPos = newPixPos;
                    this.mPrevTick = tick;
                }
            }else
            {
                this.log("9_2");
                this.mCurrentPixPos = Vec.cctor(targetPixPos);
                this.setPixPos(this.mCurrentPixPos);
                //I should compute the mag here
                this.mTargetDir = Vec.Vec2();
                this.mTargetCell = Vec.cctor(this.mCellPos);
                this.mPrevTick = 0; // I need to settle on what it means not to move / no need to move
            }
        }
    });



    ret.update = (function(tick){

        //this.log(this.mLevel.mDynObjects);

        //manually update paint the gfx
        if(this.mCurrentGfx != null)
        {
            this.mCurrentGfx.setCellPos(this.mCellPos);
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

        if(this.canMove())
        {
            ///this.
        }

        switch(this.mCurrentState){
            case E_STATE_SHIELDED   :{
                if(this.mCurrentGfx != null){
                    this.mCurrentGfx.setCellPos(this.mCellPos);
                }
            }
            //fallthrough
            case E_STATE_NORMAL     :{
                this.updatePos(tick);
                this.mPainter.invalidate();
            }break;

            case E_STATE_POWUP      :{}break;
            case E_STATE_EXPLODING  :{
            }break;
            default: break;//this.log("BBCTank::update::default!");
        }

    });

    return ret;
}

