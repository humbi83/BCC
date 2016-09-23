.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global
.import QtQuick 2.7 as QQ

function BCCBaseDoodadPainter(sQComponentPath, oPaintee) {

    var ret = sQComponentPath == undefined || sQComponentPath == null ? null :
                                                                        new Object({
                          //pos & dim in pix, should be updated in paint based on paintee model
                          mPos: Vec.Vec2(),
                          mDim: Vec.Vec2(),
                          mPaintee: oPaintee == undefined ? null : oPaintee,
                          paint:(function(){console.log("empty paint");})
    });

    console.log(sQComponentPath);

    //this should be a singleton ... anyway
    ret.qComponentClass = Qt.createComponent(sQComponentPath);


    if (ret.qComponentClass.status == QQ.Component.Ready) {
        ret.qComponentInstance       = ret.qComponentClass.createObject(root);
        ret.qComponentInstance.scale = Global.LEVEL_SCALE;
    }else
    {
        console.log(component.errorString());
    }

    return ret;
}
