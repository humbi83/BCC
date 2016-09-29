.import "BCCGlobal.js" as Global
.import "BCCVec.js"   as Vec
.import "BCCDoodad.js" as Doodad
.import "BCCLevelCell.js" as Cell

var NV_E_BRUSH         = 0;
var E_BRUSH_EMPTY      = 1;
var E_BRUSH_BRICK_WALL = 2;
var E_BRUSH_STONE_WALL = 3;
var E_BRUSH_HQ_ALIVE   = 4;
var E_BRUSH_HQ_DEAD    = 5;
var SZ_E_BRUSH         = 6;

Array.matrix = function(numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}

function BCCLevel(iDimX,iDimY){

    var pDimX = iDimX == undefined ? Global.LEVEL_NO_CELLS : iDimX;
    var pDimY = iDimY == undefined ? Global.LEVEL_NO_CELLS : iDimY;
    var ret = new Object({

                             mDim: Vec.Vec2(pDimX,pDimY),
                             mDynObjects: [],                             
                             mCells : [],                             
                             initLevel:(function(){
                                 var rows = new Array(pDimY);

                                 for(var i = 0; i < rows.length;i++)
                                 {
                                     var col = new Array(pDimX);

                                     for(var j=0;j<col.length;j++)
                                     {
                                         col[j] = Cell.BCCLevelCell(j,i,this);
                                     }

                                     rows[i] = col;
                                 }
                                 return rows;
                             }),

                             update:(function(tick){
                                 //for the moment I do not update / paint the static stuff
                                 for(var i=0; i<this.mDynObjects.length;i++){
                                     Global.cUpdate(this.mDynObjects[i], tick)
                                 }
                             }),

                             paint:(function() {
                                 for(var i=0; i<this.mDynObjects.length;i++){
                                     Global.cPaint(this.mDynObjects[i])
                                 }
                             }),


                             //TODO: ALEX: rm also from other lists !!!!!
                             addDynObj:(function(object){                                 
                                this.mDynObjects.push(object);
                             }),

                             remDynObj:(function(oDoodad){
                                 return Global.remObject(oDoodad, this.mDynObjects);
                             }),

                             onAnimSeqFinished : (function(oDynDoodad){
                                this.remDynObj(oDynDoodad);
                                 oDynDoodad.releaseInstance();
                             }),

                             bIsInside2v:(function(vPos,vDim){
                                 //return vPos.mX >= 0 &&
                                 //       vPos.mY >= 0 &&
                                 //       vPos.mX + vDim.mX <=  this.mDim.mX &&
                                 //       vPos.mY + vDim.mY <=  this.mDim.mY ;

                                 var b1 =  vPos.mX >= 0 ;
                                 var b2 =  vPos.mY >= 0 ;
                                 var b3 =  vPos.mX + vDim.mX <=  this.mDim.mX ;
                                 var b4 =  vPos.mY + vDim.mY <=  this.mDim.mY ;

                                 var ret = b1 && b2 && b3 && b4;
                                 return ret;
                             }),

                             //bullets will kill, they will check for collision
                             //so no check in tank, tanks only for collision with other tanks
                             collidesWithDynamic2v:(function(oDoodad, vPos, vDim){

                                 var ret = [];

                                 if(oDoodad != null){
                                    vPos = oDoodad.mCellPos;
                                    vDim = oDoodad.getCellDim();
                                 }

                                 var vPosClmp = vPos.ivClampXY2iv(Vec.Vec2(), this.mDim.vPlusXY(-1,-1));

                                 for(var i=0; i < this.mDynObjects.length;i++)
                                 {
                                     var dynObj = this.mDynObjects[i];

                                     if( dynObj != null &&
                                             (oDoodad != null && dynObj != oDoodad || oDoodad == null) &&

                                             Global.rectOverlaps(
                                                 vPos           , vDim,
                                                 dynObj.mCellPos, dynObj.getCellDim())
                                        ){
                                                 ret.push(dynObj);
                                          }
                                 }

                                 return ret;

                             }),
                             //No check for the moment !!!
                             collidesWithStatic2v:(function(vPos,vDim){
                                 var __ret = [];

                                 vPos = vPos.ivClampXY2iv(Vec.Vec2(), this.mDim.vPlusXY(-1,-1));

                                 var iLimit = Global.clamp((vPos.mY + vDim.mY ),0,this.mDim.mY);
                                 var jLimit = Global.clamp((vPos.mX + vDim.mX ),0,this.mDim.mX);

                                 for(var i = vPos.mY; i < iLimit;i++ ){
                                     for(var j = vPos.mX; j < jLimit ;j++ )
                                     {
                                         var __cell = this.mCells[i][j];
                                         var __bla = __cell.mStationedDoodad ? __cell.mStationedDoodad : null;


                                         if(__bla != null)
                                         {
                                            __ret.push(__bla);
                                         }
                                     }
                                 }

                                 return __ret;

                             }),


                             applyBrush:( function(xInPix, yInPix, eBrushType, wInPix, hInPix)
                             {
                                 var eDoodadType = Doodad.E_DOODAD_EMPTY;
                                 var iPosX   = Math.floor(xInPix/4);
                                 var iPosY   = Math.floor(yInPix/4);
                                 var iDimX   = Math.floor(wInPix/4);
                                 var iDimY   = Math.floor(hInPix/4);

                                 //should be an int, no hits or no stars needed or both
                                 var bIsDist = false;
                                 var bIsPass = false;
                                 var bIsNullDoodad = false;

                                 ///todo add to factory
                                 switch(eBrushType){
                                    case E_BRUSH_HQ_ALIVE   : eDoodadType = Doodad.E_DOODAD_HQ_ALIVE  ; bIsDist = true ; mapView.applyBrush(iPosX, iPosY, 304, 32, 16,16,1,1); break;
                                    case E_BRUSH_HQ_DEAD    : eDoodadType = Doodad.E_DOODAD_HQ_DEAD   ; bIsDist = false; mapView.applyBrush(iPosX, iPosY, 320, 32, 16,16,1,1); break;
                                    case E_BRUSH_BRICK_WALL : eDoodadType = Doodad.E_DOODAD_BRICK_WALL; bIsDist = true ; mapView.applyBrush(iPosX, iPosY, 256,  0, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                    case E_BRUSH_STONE_WALL : eDoodadType = Doodad.E_DOODAD_STONE_WALL; bIsDist = false; mapView.applyBrush(iPosX, iPosY, 256, 16, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                    case E_BRUSH_EMPTY      : //fall through
                                    default                 : bIsNullDoodad = true; bIsPass = true; mapView.applyBrush(Math.floor(xInPix/4), Math.floor(yInPix/4), 336,  0, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                 }

                                 ///Not nice
                                 var limitI = iPosY + iDimY;
                                 var limitJ = iPosX + iDimX;

                                 //ALEX: Do not forget to remove them !!!!!
                                 for(var i=iPosY;i< limitI && i < this.mCells.length;i++)
                                 {
                                     for(var j=iPosX;j<limitJ && j < this.mCells[i].length;j++)
                                     {
                                        //one doodad per cell, I should cut paint/update ??, Ill do the logic in bullet
                                         //I will need some hacking for HQ
                                        var oDoodad = bIsNullDoodad ? null : Doodad.newInstance(eDoodadType, null, this, j, i, 1, 1, bIsDist, false);
                                        this.mCells[i][j].mStationedDoodad = oDoodad;
                                     }
                                 }
                             })
                         });
    ret.mCells = ret.initLevel();

    //console.log(ret.mCells[0][0].mLevel.mDim.mX);
    return ret;
}
