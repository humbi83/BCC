.import "BCCDoodad.js" as Doodad
.import "BCCFrameSequenceCPPPainter.js" as FramePainter
.import "BCCGlobal.js" as Global
.import "BCCVec.js" as Vec

function newInstance(
    eType,
    //Painter Params
    vFirstFrameOffsetInAtlas, vFrameDimInAtlas, vSequenceSpan,
    oLevel,
    iPosX, iPosY,
    bIsDestroyable, bIsPassable
    )
{

    var __ret = Doodad.newInstance(
        eType,
        FramePainter.newInstance(vFirstFrameOffsetInAtlas, vFrameDimInAtlas, vSequenceSpan),
        oLevel, iPosX, iPosY, bIsDestroyable,bIsPassable
    )

    __ret.setCurrentFrame = (function(vFrame){
        var pFrame = vFrame != undefined && vFrame != null ? vFrame : Vec.Vec2();
        if(Global.isOV(this.mPainter))
        {
            this.mPainter.setCurrentFrame(pFrame);
        }
    });

    __ret.getCurrentFrame = (function() {
        return Global.isOV(this.mPainter) ? Vec.cctor(this.mPainter.mCurrentFrame) : Vec.Vec2();
    });

    return __ret;
}
