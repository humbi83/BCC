.import "BCCVec.js" as Vec
.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCColorDoodadPainter.js" as ColorPainter
.import "BCCGlobal.js" as Global

var NV_E_DOODAD               = 0;
var E_DOODAD_EMPTY            = 1;
var E_DOODAD_BRICK_WALL_4x4   = 2;
var E_DOODAD_BRICK_WALL_4x8   = 3;
var E_DOODAD_BRICK_WALL_4x16  = 4;
var E_DOODAD_BRICK_WALL_8x8   = 5;
var E_DOODAD_BRICK_WALL_8x16  = 6;
var E_DOODAD_BRICK_WALL_8x24  = 7;
var E_DOODAD_BRICK_WALL_16x16 = 8;
var E_DOODAD_BRICK_WALL_16x48 = 9;
var E_DOODAD_BRICK_WALL_16x64 =10;
var E_DOODAD_STONE_WALL_8x8   =12;
var E_DOODAD_STONE_WALL_8x16  =12;
var E_DOODAD_STONE_WALL_16x16 =13;
var E_DOODAD_BRICK_WALL_8x4   =14;
var E_DOODAD_BRICK_WALL_16x4  =15;
var E_DOODAD_BRICK_WALL_16x8  =16;
var E_DOODAD_BRICK_WALL_16x12 =17;
var E_DOODAD_BRICK_WALL_12x16 =18;
var E_DOODAD_STONE_WALL_16x8  =19;
var E_DOODAD_STONE_WALL       =20;
var E_DOODAD_BRICK_WALL       =21;
var E_DOODAD_HQ_2F            =22;
var E_DOODAD_BULLET           =23;
var SZ_E_DOODAD               =24;


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
                             update         : (function(tick){}),
                             mLCState       : Global.E_DOODAD_LC_STATE_ALIVE,
                             //I might have multiple painters ???
                             onGfxDestroyed : (function(oPainter){
                                 if(this.mPainter == oPainter)
                                 {
                                    console.log("onGfxDestroyed true");
                                    this.mLCState = Global.E_DOODAD_LC_STATE_DESTROYED;
                                     //should I do this ???
                                    this.mPainter = null;
                                 }
                                 else
                                 {
                                    console.log("onGfxDestroyed false");
                                 }
                             })

                         });

    if(oPainter !== null){
        oPainter.mPaintee = ret;
    }
    return ret;
}


function BCCDoodadFactory(oLevel)
{
    var ret = new Object({
                             newInstance:(function(eDoodadType, doodadW, doodadH){
                                switch(eDoodadType)
                                {
                                case E_DOODAD_BRICK_WALL_4x4  : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2(  4,  4)              ), oLevel,0,0,1, 1,true,false);
                                case E_DOODAD_BRICK_WALL_4x8  : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2(  4,  8)              ), oLevel,0,0,1, 2,true,false);
                                case E_DOODAD_BRICK_WALL_4x16 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2(  4, 16)              ), oLevel,0,0,1, 4,true,false);

                                case E_DOODAD_BRICK_WALL_8x4  : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2(  8,  4)              ), oLevel,0,0,2, 1,true,false);
                                case E_DOODAD_BRICK_WALL_16x4 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( 16,  4)              ), oLevel,0,0,4, 1,true,false);
                                case E_DOODAD_BRICK_WALL_16x8 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( 16,  8)              ), oLevel,0,0,4, 2,true,false);
                                case E_DOODAD_BRICK_WALL_16x12: return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( 16, 12)              ), oLevel,0,0,4, 3,true,false);
                                case E_DOODAD_BRICK_WALL_12x16: return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( 12, 16)              ), oLevel,0,0,3, 4,true,false);
                                case E_DOODAD_BRICK_WALL_8x8  : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2(  8,  8)              ), oLevel,0,0,2, 2,true,false);
                                case E_DOODAD_BRICK_WALL_8x16 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2(  8, 16)              ), oLevel,0,0,2, 4,true,false);
                                case E_DOODAD_BRICK_WALL_16x16: return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( 16, 16)              ), oLevel,0,0,4, 4,true,false);
                                case E_DOODAD_BRICK_WALL_8x24 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2(  8, 24)              ), oLevel,0,0,2, 6,true,false);
                                case E_DOODAD_BRICK_WALL_16x48: return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( 16, 16),Vec.Vec2(1,3)), oLevel,0,0,4,12,true,false);
                                case E_DOODAD_BRICK_WALL_16x64: return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( 16, 16),Vec.Vec2(1,4)), oLevel,0,0,4,16,true,false);
                                case E_DOODAD_STONE_WALL_8x8  : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,16), Vec.Vec2(  8,  8),Vec.Vec2(1,1)), oLevel,0,0,2, 2,true,false);
                                case E_DOODAD_STONE_WALL_8x16 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,16), Vec.Vec2(  8,  8),Vec.Vec2(1,2)), oLevel,0,0,2, 4,true,false);
                                case E_DOODAD_STONE_WALL_16x16: return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,16), Vec.Vec2(  8,  8),Vec.Vec2(2,2)), oLevel,0,0,4, 4,true,false);
                                //Do not repeat if I do not have to, anyway .. this has to be done diff
                                case E_DOODAD_STONE_WALL_16x8 : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,16), Vec.Vec2( 16,  8)              ), oLevel,0,0,4, 2,true,false);
                                case E_DOODAD_STONE_WALL      : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,16), Vec.Vec2( doodadW % 16, doodadH % 16), Vec.Vec2( Math.max(1,Math.floor(doodadW / 16)) , Math.max(1,Math.floor(doodadH /16)))), oLevel,0,0, Math.floor(doodadW / 4), Math.floor(doodadH / 4),true,false);
                                case E_DOODAD_BRICK_WALL      : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( doodadW % 16, doodadH % 16), Vec.Vec2( Math.max(1,Math.floor(doodadW / 16)) , Math.max(1,Math.floor(doodadH /16)))), oLevel,0,0, Math.floor(doodadW / 4), Math.floor(doodadH / 4),true,false);
                                case E_DOODAD_HQ_2F           : return BCCDoodad2o4i3b(AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(304 + (doodadW % 2) * 16, 32 + (doodadH % 2) * 16), Vec.Vec2(16, 16)), oLevel,0,0,4, 4,true,false);
                                case E_DOODAD_EMPTY:
                                    //fallthrough
                                    default: return BCCDoodad2o4i3b(ColorPainter.BCCColorDoodadPainter("white"),oLevel,0,0,1,1,false,true);
                                }
                             })
                         });
    return ret;
}
