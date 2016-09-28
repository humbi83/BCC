.import "BCCGlobal.js" as Global
.import "BCCBaseDoodadPainter.js" as BaseDoodadPainter
.import "BCCVec.js" as Vec
.import QtQuick 2.7 as QQ

//Make this such that it accepts a string to the png ? and have 2 atlas types
function newInstance( vOffsetInAtlas, vDimInAtlas) {
    var ret = BaseDoodadPainter.newInstance("BBCAtlasFrame.qml");

    var pOff = vOffsetInAtlas == undefined || vOffsetInAtlas == null ? Vec.Vec2() : vOffsetInAtlas;
    var pDim = vDimInAtlas    == undefined || vDimInAtlas    == null ? Vec.Vec2() : vDimInAtlas;

    ret.mOffsetInAtlas = pOff;
    ret.mOffsetInAtlasInvalid = true;
    //Can I have a globla func for this ? have vars bound and just set it ???
    ret.setOffsetInAtlas  = ( function(vOff)
    {
        if(!vOff.bEquals (this.mOffsetInAtlas)){
            this.mOffsetInAtlas = Vec.cctor(vOff);
            this.mOffsetInAtlasInvalid = true;
        }
    });

    ret.paintMOffsetInAtlas =(function(){
        if(this.mOffsetInAtlasInvalid || this.mIsInvalid){
            this.qComponentInstance.mOffsetX = this.mOffsetInAtlas.mX;
            this.qComponentInstance.mOffsetY = this.mOffsetInAtlas.mY;
            this.mOffsetInAtlasInvalid = false;
        }
    });

    ret.setDim(pDim);

    ret.paint_BaseDoodadPainter = ret.paint;

    ret.paint=(function(){

        if(this.canPaint())
        {
            this.paintMOffsetInAtlas();
            this.paint_BaseDoodadPainter();
        }
   });

    return ret;
}



