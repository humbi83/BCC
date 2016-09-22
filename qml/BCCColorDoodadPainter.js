
.import "BCCGlobal.js" as Global
.import "BCCBaseDoodadPainter.js" as BaseDoodadPainter
.import QtQuick 2.7 as QQ

function BCCColorDoodadPainter(sColor, oPaintee) {
    var ret = BaseDoodadPainter.BCCBaseDoodadPainter("BBCRectangle.qml",oPaintee == undefined ? null : oPaintee);

    //TODO:CHECKS
    ret.mColor = sColor == undefined || sColor == null ? "white" : sColor;

    ret.apply = (function(){
        this.qComponentInstance.x     = this.mPos.mX*Global.LEVEL_SCALE;
        this.qComponentInstance.y     = this.mPos.mY*Global.LEVEL_SCALE;
        this.qComponentInstance.width = this.mDim.mX;
        this.qComponentInstance.height= this.mDim.mY;
        this.qComponentInstance.color = this.mColor ;
    });

    ret.paint = (function(/*bForces*/){

        //maybe some sort of repaint/invalidate to force a paint
//        var invalidateComponentInstance = true /*false*/;
        if(this.mPaintee !== null /*&& oPaintee.isDirty()*/)
        {
            //oPaintee.clean();
            this.mPos.setV(this.mPaintee.mCellPos);this.mPos.mulC(Global.LEVEL_CELL_PIX_SZ);
            this.mDim.setV(this.mPaintee.mCellDim);this.mDim.mulC(Global.LEVEL_CELL_PIX_SZ);
            //invalidateComponentInstance = true;
        }

        //some
        //if(invalidateComponentInstance)
        {
            this.apply();
        }
   });
    return ret;
}
