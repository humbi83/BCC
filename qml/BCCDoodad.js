.import "BCCVec.js" as Vec
.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCColorDoodadPainter.js" as ColorPainter
.import "BCCGlobal.js" as Global
//.import "BCCLevelPainert.js" as LevelPainter

var NV_E_DOODAD               = 0;
var E_DOODAD_EMPTY            = 1;
var E_DOODAD_STONE_WALL       = 2;
var E_DOODAD_BRICK_WALL       = 3;
var E_DOODAD_HQ_ALIVE         = 4;
var E_DOODAD_HQ_DEAD          = 5;
var E_DOODAD_BULLET           = 6;
var E_DOODAD_TANK             = 7;
var E_DOODAD_POWUP            = 8;
var SZ_E_DOODAD               = 9;

//CPP map related doodads
//TODO: have also dyn/batching doodads handled on cpp side

//TODO:ALEX: Checks
function newInstance(
    eType,
    oPainter,
    oLevel,
    iPosX, iPosY,
    bIsDestroyable, bIsPassable)
{
    var ret = new Object({
                             mDoodadType    : eType,
                             mPainter       : oPainter, //todo: check if it works
                             mLevel         : oLevel,

                             mCellPos       : Vec.Vec2(),
                             getPixPos      : (function(){
                                 return mPainter != null ? Vec.cctor(mPainter.mPos) :
                                                           mCellPos.vMulC(Global.LEVEL_CELL_PIX_SZ);
                             }),
                             setPixXY       : (function(x,y){
                                 this.mCellPos = Global.pixXY2CellV(x,y);
                                 if(this.mPainter != null)
                                 {
                                     //painter maintains the unfloored values
                                    this.mPainter.setPos(Vec.Vec2(x,y));
                                 }
                             } ),

                             setCellPos     : (function(vPos){
                               this.mCellPos = Vec.cctor(vPos);
                                if(this.mPainter != null){
                                    this.mPainter.setPos(vPos.vMulC(Global.LEVEL_CELL_PIX_SZ).floor());
                                }
                             }),

                             getCellDim     : (function(){
                                 //hmmm now I link the painter & the doodad dims ... not nice .. should i have a sep value ?
                                 return this.mPainter != null ? this.mPainter.mDim.vMulC(1/Global.LEVEL_CELL_PIX_SZ) : Vec.Vec2(0,0);
                             }),

                             mIsDestroyable : bIsDestroyable != undefined ? bIsDestroyable : false,
                             mIsPassable    : bIsPassable    != undefined ? bIsPassable    : true ,

                             isVisible      : (function()         { if(this.mPainter != null) { return this.mPainter.mIsVisible;} }),
                             setVisible     : (function(bVisible) { if(this.mPainter != null) { this.mPainter.setIsVisible(bVisible);} } ),

                             explode        : (function(){console.log("Doodad::explode ", mDoodadType);}),
                             canExplode     : (function(){return false;}),

                             paint          : (function(){if(this.mPainter != null){this.mPainter.paint();}}),

                             mStartTick     : 0,
                             update         : (function(tick){}),

                             releaseInstance: (function(){
                                 if(this.mPainter != null){
                                    this.mPainter.releaseInstance();
                                 }
                             })
                         });
    ret.setCellPos(Vec.Vec2(iPosX,iPosY));
    return ret;
}
