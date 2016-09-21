.import "BCCIVec.js" as BCCIVec
function BCCPainter(oPaintee) {
 var ret = new Object({
                          mPos: BCCIVec.BCCIVec2i(0,0),
                          mDim: BCCIVec.BCCIVec2i(0,0),
                          mPaintee: oPaintee,
                          paint:(function(){})
    });
 return ret;
}
