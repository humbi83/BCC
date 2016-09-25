.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCVec.js" as Vec

function newInstance(vFirstFrameOffsetInAtlas, vFrameDimInAtlas, vSequenceSpan) {
    var ret = AtlasPainter.BCCMainAtlasDooodadPainter(vFirstFrameOffsetInAtlas,vFrameDimInAtlas);
    ret.mFirstFrameOffsetInAtlas = vFirstFrameOffsetInAtlas;
    ret.mSequenceSpan = vSequenceSpan;
    ret.paint_BCCMainAtlasDooodadPainter = ret.paint != undefined ? ret.paint : null;
    ret.paint = (function(){
        this.mOffsetInAtlas = this.mFirstFrameOffsetInAtlas.vPlus(this.mPaintee.mSelectedFrame.vMulCW(this.mDim));
        this.paint_BCCMainAtlasDooodadPainter();
    });
    return ret;
}
