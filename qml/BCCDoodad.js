.import "BCCVec.js" as Vec
.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCColorDoodadPainter.js" as ColorPainter
.import "BCCGlobal.js" as Global

var NV_E_DOODAD               = 0;
var E_DOODAD_EMPTY            = 1;
var E_DOODAD_BRICK_WALL_4x4   = 2;
var E_DOODAD_BRICK_WALL_4x8   = 3;
var E_DOODAD_BRICK_WALL_8x8   = 4;
var E_DOODAD_BRICK_WALL_8x16  = 5;
var E_DOODAD_BRICK_WALL_8x24  = 6;
var E_DOODAD_BRICK_WALL_16x48 = 7;
var E_DOODAD_BRICK_WALL_16x64 = 8;
var SZ_E_DOODAD               = 9;

function BCCDoodad2o4i3b(oPainter,oLevel,iPosX,iPosY,iDimX,iDimY, bIsDestroyable, bIsPassable)
{
    var ret = new Object({
                             mPainter       : oPainter, //todo: check if it works
                             mLevel         : oLevel,
                             mCellPos       : Vec.Vec2(iPosX,iPosY),
                             mCellDim       : Vec.Vec2(iDimX,iDimY),
                             mCells         : [], // Should be filled by the level upon adding
                             mIsDestroyable : bIsDestroyable,
                             mIsPassable    : bIsPassable,
                             setPixXY          : (function(x,y){
                                 this.mCellPos = Global.pixXY2CellV(x,y);
                             } ),
                             paint          : (function(){if(this.mPainter !== null){this.mPainter.paint();}}),
                             update         : (function(){})
                         });

    if(oPainter !== null){
        oPainter.mPaintee = ret;
    }
    return ret;
}


function BCCDoodadFactory(oLevel)
{
    var ret = new Object({
                             newInstance:(function(eDoodadType){
                                switch(eDoodadType)
                                {
                                case E_DOODAD_BRICK_WALL_4x4  : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,0), Vec.Vec2( 4,  4)), oLevel,0,0,1,1,true,false);
                                case E_DOODAD_BRICK_WALL_4x8  : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,0), Vec.Vec2( 4,  8)), oLevel,0,0,1,2,true,false);
                                case E_DOODAD_BRICK_WALL_8x8  : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,0), Vec.Vec2( 8,  8)), oLevel,0,0,2,2,true,false);
                                case E_DOODAD_BRICK_WALL_8x16 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,0), Vec.Vec2( 8, 16)), oLevel,0,0,2,4,true,false);
                                case E_DOODAD_BRICK_WALL_8x24 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,0), Vec.Vec2( 8, 24)), oLevel,0,0,2,6,true,false);
                                case E_DOODAD_BRICK_WALL_16x48: return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,0), Vec.Vec2( 16,16),Vec.Vec2(1,4)), oLevel,0,0,4,16,true,false);
                                case E_DOODAD_BRICK_WALL_16x64: return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,0), Vec.Vec2( 16,16),Vec.Vec2(1,3)), oLevel,0,0,4,12,true,false);
                                case E_DOODAD_EMPTY:
                                    //fallthrough
                                    default: return BCCDoodad2o4i3b(ColorPainter.BCCColorDoodadPainter("white"),oLevel,0,0,1,1,false,true);
                                }
                             })
                         });
    return ret;
}
