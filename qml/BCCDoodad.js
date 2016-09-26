.import "BCCVec.js" as Vec
.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCColorDoodadPainter.js" as ColorPainter
.import "BCCGlobal.js" as Global

var NV_E_DOODAD               = 0;
var E_DOODAD_EMPTY            = 1;
var E_DOODAD_STONE_WALL       = 2;
var E_DOODAD_BRICK_WALL       = 3;
var E_DOODAD_HQ_2F            = 4;
var E_DOODAD_BULLET           = 5;
var E_DOODAD_TANK             = 6;
var E_DOODAD_POWUP            = 7;
var SZ_E_DOODAD               = 8;


function BCCDoodad2o4i3b(eType, oPainter, oLevel,iPosX,iPosY,iDimX,iDimY, bIsDestroyable, bIsPassable)
{
    var ret = new Object({
                             mDoodadType    : eType,
                             mPainter       : oPainter, //todo: check if it works
                             mLevel         : oLevel,
                             mCellPos       : Vec.Vec2(iPosX,iPosY),
                             mCellDim       : Vec.Vec2(iDimX,iDimY),
                             mCells         : [], // Should be filled by the level upon adding
                             mIsDestroyable : bIsDestroyable,
                             mIsPassable    : bIsPassable,
                             setPixXY       : (function(x,y){
                                 this.mCellPos = Global.pixXY2CellV(x,y);
                             } ),
                             explode        : (function(){console.log("Doodad::explode ", mDoodadType);}),
                             canExplode     : (function(){return false;}),
                             mIsVisible     : true,
                             paint          : (function(){if(this.mPainter !== null){this.mPainter.paint();}}),
                             mStartTick     : 0,
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
                                case E_DOODAD_STONE_WALL      : return BCCDoodad2o4i3b(eDoodadType, AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256,16), Vec.Vec2( doodadW % 16, doodadH % 16), Vec.Vec2( Math.max(1,Math.floor(doodadW / 16)) , Math.max(1,Math.floor(doodadH /16)))), oLevel,0,0, Math.floor(doodadW / 4), Math.floor(doodadH / 4),true,false);
                                case E_DOODAD_BRICK_WALL      : return BCCDoodad2o4i3b(eDoodadType, AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(256, 0), Vec.Vec2( doodadW % 16, doodadH % 16), Vec.Vec2( Math.max(1,Math.floor(doodadW / 16)) , Math.max(1,Math.floor(doodadH /16)))), oLevel,0,0, Math.floor(doodadW / 4), Math.floor(doodadH / 4),true,false);
                                case E_DOODAD_HQ_2F           : return BCCDoodad2o4i3b(eDoodadType, AtlasPainter.BCCMainAtlasDooodadPainter(Vec.Vec2(304 + (doodadW % 2) * 16, 32 + (doodadH % 2) * 16), Vec.Vec2(16, 16)), oLevel,0,0,4, 4,true,false);
                                case E_DOODAD_EMPTY:
                                    //fallthrough
                                    default: return BCCDoodad2o4i3b(E_DOODAD_EMPTY, ColorPainter.BCCColorDoodadPainter("white"),oLevel,0,0,1,1,false,true);
                                }
                             })
                         });
    return ret;
}
