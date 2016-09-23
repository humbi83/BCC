.import "BCCGlobal.js" as Global
.import "BCCBaseDoodadPainter.js" as BaseDoodadPainter
.import "BCCVec.js" as Vec
.import QtQuick 2.7 as QQ

//Make this such that it accepts a string to the png ? and have 2 atlas types
function BCCMainAtlasDooodadPainter( vOffsetInAtlas, vDimInAtlas, vRepeat, oPaintee) {
    var ret = BaseDoodadPainter.BCCBaseDoodadPainter("BBCAtlasFrame.qml",oPaintee == undefined ? null : oPaintee);

    ret.mOffsetInAtlas = vOffsetInAtlas == undefined || vOffsetInAtlas == null ? Vec.Vec2()    : vOffsetInAtlas;
    ret.mDim           = vOffsetInAtlas == undefined || vOffsetInAtlas == null ? Vec.Vec2()    : vDimInAtlas;
    ret.mRepeat        = vRepeat        == undefined || vOffsetInAtlas == null ? Vec.Vec2(1,1) : vRepeat;

    ret.apply = (function(){

        this.qComponentInstance.mOffsetX = this.mOffsetInAtlas.mX;
        this.qComponentInstance.mOffsetY = this.mOffsetInAtlas.mY;

        this.qComponentInstance.x        = this.mPos.mX * Global.LEVEL_SCALE;
        this.qComponentInstance.y        = this.mPos.mY * Global.LEVEL_SCALE;
        this.qComponentInstance.mWidth   = this.mDim.mX / this.mRepeat.mX;
        this.qComponentInstance.mHeight  = this.mDim.mY / this.mRepeat.mY;

        this.qComponentInstance.mXTimes  = this.mRepeat.mX;
        this.qComponentInstance.mYTimes  = this.mRepeat.mY;

    });

    ret.paint=(function(){

        if(this.mPaintee !== null /*&& oPaintee.isDirty()*/)
        {
            //oPaintee.clean();
            this.mPos.setV(this.mPaintee.mCellPos);this.mPos.mulC(Global.LEVEL_CELL_PIX_SZ);
            this.mDim.setV(this.mPaintee.mCellDim);this.mDim.mulC(Global.LEVEL_CELL_PIX_SZ);
        }

        this.apply();
   })
    return ret;
}


