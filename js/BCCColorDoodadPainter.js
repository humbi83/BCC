.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global
.import "BCCBaseDoodadPainter.js" as BaseDoodadPainter
.import QtQuick 2.7 as QQ

function newInstance(sColor, iW, iH) {
    var ret = BaseDoodadPainter.newInstance("BBCRectangle.qml");
    var pW = iW != undefined ? iW : 16;
    var pH = iH != undefined ? iH : 16;

    ret.setDim(Vec.Vec2(pW,pH));

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
