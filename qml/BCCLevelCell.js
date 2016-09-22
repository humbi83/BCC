.import "BCCVec.js" as Vec
function BBCLevelCell(iPosX, iPosY, oLevel) {
    var ret = new Object({
                             mPos             : Vec.Vec2(iPosX,iPosY),
                             mLevel           : oLevel,
                             mStationedDoodad : null
                         });

        return ret;

    }
