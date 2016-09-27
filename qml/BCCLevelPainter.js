//.import "BCCVec.js" as Vec
//.import "BCCGlobal.js" as Global
//.import QtQuick 2.7 as QQ
//
//
//ret.mOffsetInAtlas = vOffsetInAtlas == undefined || vOffsetInAtlas == null ? Vec.Vec2()    : vOffsetInAtlas;
//ret.mDim           = vOffsetInAtlas == undefined || vOffsetInAtlas == null ? Vec.Vec2()    : vDimInAtlas;
//ret.mRepeat        = vRepeat        == undefined || vOffsetInAtlas == null ? Vec.Vec2(1,1) : vRepeat;
//
//function BCCBaseDoodadPainter(vOffsetInAtlas, vDimInAtlas, vRepeat, oPaintee) {
//
//    ret.mOffsetInAtlas = vOffsetInAtlas == undefined || vOffsetInAtlas == null ? Vec.Vec2()    : vOffsetInAtlas;
//    ret.mDim           = vOffsetInAtlas == undefined || vOffsetInAtlas == null ? Vec.Vec2()    : vDimInAtlas;
//    ret.mRepeat        = vRepeat        == undefined || vOffsetInAtlas == null ? Vec.Vec2(1,1) : vRepeat;
//
//
//    var ret = new Object({
//                          //pos & dim in pix, should be updated in paint based on paintee model
//                          mPos: Vec.Vec2(),
//                          mDim: Vec.Vec2(),
//                          mPaintee: oPaintee == undefined ? null : oPaintee,
//                          mLCState: Global.E_DOODAD_LC_STATE_ALIVE,
//                          mIsVisible:true,
//                          paint:(function(){
//                                //what should I send here ???
//                          })
//
//    });
//
//    return ret;
//}
