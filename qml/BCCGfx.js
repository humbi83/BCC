.import "BCCDoodad.js" as Doodad
.import "BCCMultiFrameDoodad.js" as MFDoodad
.import "BCCFrameSequenceCPPPainter.js" as FramePainter
.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global

var E_GFX_TELEPORT   = 0;
var E_GFX_SHILED     = 1;
var E_GFX_SMALL_EXP  = 2;
var E_GFX_BIG_EXP    = 3;
//implemented in 2Gfx ??
var E_GFX_TANK_EXP   = 4; // combined small + big ??

//Big.... small .. big

var ANIM_SEQ_TELEPORT  = [3,2,1,0,1,2,3,2,1,0,1,2,3]; //maybe no 3, anyway on end tank spawns, add cb on end of anim
var ANIM_SEQ_SHILED    = [0,1];
var ANIM_SEQ_EXP_SMALL = [0,1,2];
var ANIM_SEQ_EXP_BIG   = [0,1];

var ANIM_SEQZ = [
            ANIM_SEQ_TELEPORT ,
            ANIM_SEQ_SHILED   ,
            ANIM_SEQ_EXP_SMALL,
            ANIM_SEQ_EXP_BIG
    ];

//in ticks
//6 - 100
var ANIM_FRAME_LEN = [
            50,
            50,
            50,
            50
        ];
//listener Should impl some if

//function onAnimSeqFinished(oAnimSeq);

var E_STATE_RUNNING   = 0;
var E_STATE_FINISHING = 1;
var E_STATE_FINISHED  = 2;

function newInstance(oLevel, iX, iY, eGFX, iNoLoops, oListener) {

    var __ret = null;

    switch(eGFX){
    case E_GFX_TELEPORT :
        __ret = MFDoodad.newInstance(
                    Doodad.E_DOODAD_EMPTY,
                    Vec.Vec2(256,96),Vec.Vec2(16,16),Vec.Vec2(4,1),
                    oLevel,
                    iX ,iY
                    );
        break;
    case E_GFX_SHILED:
        __ret = MFDoodad.newInstance(
                    Doodad.E_DOODAD_EMPTY,
                    Vec.Vec2(256,96 + 48),Vec.Vec2(16,16),Vec.Vec2(2,1),
                    oLevel,
                    iX ,iY
                    );
        break;
     case E_GFX_SMALL_EXP:
         __ret = MFDoodad.newInstance(
                     Doodad.E_DOODAD_EMPTY,
                     Vec.Vec2(256,96 + 32),Vec.Vec2(16,16),Vec.Vec2(3,1),
                     oLevel,
                     iX ,iY
                     );
         break;
    case E_GFX_BIG_EXP:
        __ret = MFDoodad.newInstance(
                    Doodad.E_DOODAD_EMPTY,
                    Vec.Vec2(256 + 48 ,96 + 32),Vec.Vec2(32,32),Vec.Vec2(2,1),
                    oLevel,
                    iX ,iY
                    );
        break;
    }

    //update related
    __ret.mCurrentState = E_STATE_RUNNING;
    __ret.mListener = oListener != undefined && oListener != null ? oListener : oLevel;

    __ret.mNoLoops  = iNoLoops != undefined ? iNoLoops : 0;
    __ret.mCurrentLoop = 0;

    __ret.mType = eGFX;
    __ret.mStartTick = 0;

    __ret.setCurrentFrame(Vec.Vec2(ANIM_SEQZ[eGFX],0));// not okey .. need to def the anims

    __ret.update = (function(tick){

        //hmm .. globals .. not ok..
        if(this.mStartTick == 0){
            this.mStartTick = tick;
        }

       var dT = tick - this.mStartTick;

//should I stablize the state here ??? i loose 2 frames till death just for sswitch .. .. anyway
        switch(this.mCurrentState)
        {
            case E_STATE_RUNNING:
            {
                var frameCount = Math.floor(dT / ANIM_FRAME_LEN[this.mType]);
                var frameNo    = frameCount % ANIM_SEQZ[this.mType].length

                this.mCurrentLoop = Math.floor(frameCount / ANIM_SEQZ[this.mType].length);

                if(__ret.mNoLoops == -1 || this.mCurrentLoop <= this.mNoLoops ){
                    //TODO?: also for Y, I don't seem to have any anims layed on Y
                    this.setCurrentFrame( Vec.Vec2(ANIM_SEQZ[this.mType][frameNo],0));
                }else
                {
                    if(this.mListener != null){
                        this.mListener.onAnimSeqFinished(this);
                        this.mCurrentState = E_STATE_FINISHED;
                        this.setVisible(false);
                    }
                }
            }
            break;
            case E_STATE_FINISHED:
            {
                //do nothing ???
            }
            break;
        }
    });

    return __ret;
}
