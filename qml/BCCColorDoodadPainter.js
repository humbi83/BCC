
.import "BCCGlobal.js" as Global
.import "BCCBaseDoodadPainter.js" as BaseDoodadPainter
.import QtQuick 2.7 as QQ

function BCCColorDoodadPainter(sColor) {
    var ret = BaseDoodadPainter.BCCBaseDoodadPainter("BBCRectangle.qml");

    ret.mColor = sColor == undefined || sColor == null ? "white" : sColor;
    ret.mColorInvalid = true;
    ret.setColor = (function(sColor){ if(sColor !== this.mColor){this.mColor = sColor; this.mColorInvalid = true;}});

    ret.paint_BaseDoodadPainter = ret.paint;

    ret.paint = (function(){

        if(this.mColorInvalid || this.mIsInvalid){
            this.qComponentInstance.color = this.mColor;
            this.mColorInvalid = false;
        }

        this.paint_BaseDoodadPainter();
   });

    return ret;
}
