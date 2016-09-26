.import "BCCVec.js" as Vec
.import "BCCDoodad.js" as Doodad
.import "BCCMainAtlasDoodadPainter.js" as Atlas

///function BCCDoodad2o4i3b(eType, oPainter, oLevel,iPosX,iPosY,iDimX,iDimY, bIsDestroyable, bIsPassable)
//function BCCMainAtlasDooodadPainter( vOffsetInAtlas, vDimInAtlas, vRepeat, oPaintee) {
function newInstance(iPosX, iPosY, oLevel) {
    var ret = Doodad.BCCDoodad2o4i3b(
                Doodad.E_DOODAD_EMPTY,
                Atlas.BCCMainAtlasDooodadPainter(Vec.Vec2(256,0), Vec.Vec2(4,4)),
                iPosX, iPosY,
                1,1,
                true,false
                );
    ret.mCellPos=Vec.Vec2(iPosX,iPosY);
    ret.mCellDim=Vec.Vec2(1,1);
    ret.mPainter.mPaintee = ret;
    return ret;
}
