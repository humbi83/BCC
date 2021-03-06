.import "BCCVec.js" as Vec
.import "BCCMainAtlasDoodadPainter.js" as AtlasPainter
.import "BCCColorDoodadPainter.js" as ColorPainter
.import "BCCGlobal.js" as Global

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
                             mPainter       : oPainter,
                             mLevel         : oLevel, // mPos this will be used to offset the painting

                             mCellPos       : Vec.Vec2(),

                             getPixPos      : (function(){
                                 var __ret = Vec.Vec2();

                                 if(this.mPainter != undefined && this.mPainter != null)
                                 {
                                    __ret = Vec.Vec2(
                                        this.mPainter.mPos.mX - this.mLevel.mPos.mX * Global.LEVEL_CELL_PIX_SZ,
                                        this.mPainter.mPos.mY - this.mLevel.mPos.mY * Global.LEVEL_CELL_PIX_SZ
                                        );
                                }else{
                                     //our values are not offseted
                                     __ret = this.mCellPos.vMulC(Global.LEVEL_CELL_PIX_SZ);
                                 }

                                 return __ret;

                             }),

                             //again, relative to the map pos
                             setPixPos      : (function (vPos){
                                this.setPixXY(vPos.mX, vPos.mY);
                             }),
                             setPixXY       : (function(x,y){
                                 this.mCellPos = Global.pixXY2CellV(x,y);
                                 if(this.mPainter != null)
                                 {
                                     //painter maintains the unfloored values
                                    this.mPainter.setPos(Vec.Vec2(x + this.mLevel.mPos.mX * Global.LEVEL_CELL_PIX_SZ,
                                                                  y + this.mLevel.mPos.mY * Global.LEVEL_CELL_PIX_SZ));
                                 }
                             }),

                             setCellPos     : (function(vPos){
                               this.mCellPos = Vec.cctor(vPos);
                                if(this.mPainter != null){
                                    this.mPainter.setPos(vPos.
                                                         vPlus(this.mLevel.mPos).
                                                         mulC(Global.LEVEL_CELL_PIX_SZ).
                                                         floor()
                                                         );
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

                             explode        : (function(){console.log("Doodad::explode ", this.mDoodadType);}),
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
