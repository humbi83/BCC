.import "BCCAtlasCPPPainter.js" as AtlasPainter
.import "BCCVec.js" as Vec

function newInstance(vFirstFrameOffsetInAtlas, vFrameDimInAtlas, vSequenceSpan, oMain) {

    var pMain = oMain != undefined && oMain != null ? oMain : myBCCMain;
    var ret = AtlasPainter.newInstance(vFirstFrameOffsetInAtlas, vFrameDimInAtlas, pMain);

    //these are constant for all intents and purposes, no props out of them
    ret.mFirstFrameOffsetInAtlas = vFirstFrameOffsetInAtlas;
    ret.mSequenceSpan            = vSequenceSpan;

    //This is kinda a prop
    ret.mCurrentFrame   = Vec.Vec2();
    ret.setCurrentFrame = (function (vFrame){
        if(!vFrame.bEquals(this.mCurrentFrame)){

            //do i need to do this ???
            ret.mCurrentFrame = Vec.cctor(vFrame);

            this.setOffsetInAtlas(
                 this.mFirstFrameOffsetInAtlas.vPlus(
                     this.mCurrentFrame.vMulCW(this.mDim)
                     ));
        }
    });

    return ret;
}
