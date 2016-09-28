
.import "BCCGlobal.js" as Global
.import "BCCBaseDoodadPainter.js" as BaseDoodadPainter
.import QtQuick 2.7 as QQ

function BCCColorDoodadPainter(sColor) {
    var ret = BaseDoodadPainter.newInstance("BBCRectangle.qml");

    ret.mColor = sColor == undefined || sColor == null ? "white" : sColor;
    ret.mColorInvalid = true;
    ret.paintMColor =(function(){
        if(this.mColorInvalid || this.mIsInvalid){
            this.qComponentInstance.color = this.mColor;
            this.mColorInvalid = false;
        }
    });

    ret.setColor = (function(sColor){ if(sColor !== this.mColor){this.mColor = sColor; this.mColorInvalid = true;}});

    ret.paint_BaseDoodadPainter = ret.paint;
    ret.paint = (function(){
        this.paintMColor();
        this.paint_BaseDoodadPainter();
   });

    return ret;
}
