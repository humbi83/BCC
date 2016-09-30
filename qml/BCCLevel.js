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
var E_BRUSH_
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
                             mPos: Vec.Vec2(Global.LEVEL_CELL_POS_X,Global.LEVEL_CELL_POS_Y),
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

                             onActionEvents:(function(ePlayer, eAction, value){
                                for(var i=0; i< this.mDynObjects.length;i++)
                                {
                                    var pDoodad = this.mDynObjects[i];
                                    if(
                                            pDoodad != null &&
                                            pDoodad.mDoodadType == Doodad.E_DOODAD_TANK &&
                                            pDoodad.mPlayerType == ePlayer){
                                        switch(eAction){
                                            case Global.E_ACTION_MOVE : pDoodad.onMoveEvent(value); break;
                                            case Global.E_ACTION_FIRE : pDoodad.onFire(); break;
                                            default: console.log("Level::onActionEvents");break;
                                        }
                                    }
                                }
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
                                 return vPos.mX >= 0 &&
                                        vPos.mY >= 0 &&
                                        vPos.mX + vDim.mX <=  this.mDim.mX &&
                                        vPos.mY + vDim.mY <=  this.mDim.mY ;

                                 //var b1 =  vPos.mX >= this.mPos.mX;
                                 //var b2 =  vPos.mY >= this.mPos.mY ;
                                 //var b3 =  vPos.mX + vDim.mX <=  this.mDim.mX + this.mPos.mX;
                                 //var b4 =  vPos.mY + vDim.mY <=  this.mDim.mY + this.mPos.mY;
                                 //
                                 //var ret = b1 && b2 && b3 && b4;
                                 return ret;
                             }),

                             //bullets will kill, they will check for collision
                             //so no check in tank, tanks only for collision with other tanks
                             collidesWithDynamic2v:(function(oDoodad, vPos, vDim){

                                 var collidesWithDynamic2v__ret = [];

                                 if(oDoodad != undefined && oDoodad != null){

                                    var pPos = vPos == undefined || vPos == null ? oDoodad.mCellPos     : vPos;
                                    var pDim = pDim == undefined || pDim == null ? oDoodad.getCellDim() : vDim;

                                    for(var i=0; i < this.mDynObjects.length;i++)
                                    {
                                        var dynObj = this.mDynObjects[i];

                                        if( dynObj != null && dynObj != oDoodad){

                                                var bTouching = Global.rectOverlaps(
                                                    pPos           , pDim,
                                                    dynObj.mCellPos, dynObj.getCellDim());

                                             if(bTouching)
                                             {
                                                    collidesWithDynamic2v__ret.push(dynObj);
                                             }
                                        }
                                    }
                                 }

                                 //console.log(collidesWithDynamic2v__ret,collidesWithDynamic2v__ret[0]);
                                 return collidesWithDynamic2v__ret;

                             }),
                             //No check for the moment !!!
                             collidesWithStatic2v:(function(vPos,vDim){
                                 var collidesWithStatic2v__ret = [];

                                 vPos = vPos.ivClampXY2iv(
                                             Vec.Vec2(),
                                             this.mDim.vPlusXY(-1,-1)
                                             );

                                 var iLimit = Global.clamp((vPos.mY + vDim.mY ), 0, this.mDim.mY);
                                 var jLimit = Global.clamp((vPos.mX + vDim.mX ), 0, this.mDim.mX);

                                 for(var i = vPos.mY; i < iLimit;i++ ){
                                     for(var j = vPos.mX; j < jLimit ;j++ )
                                     {
                                         var __cell = this.mCells[i][j];

                                         if(__cell.mStationedDoodad != null /*&& !__bla.mIsPassable*/)
                                         {
                                             //console.log("pushed", __cell.mStationedDoodad);
                                            collidesWithStatic2v__ret.push(__cell.mStationedDoodad);
                                         }
                                     }
                                 }

                                 //console.log(collidesWithStatic2v__ret,collidesWithStatic2v__ret[0]);
                                 return collidesWithStatic2v__ret;

                             }),


                             applyBrush:( function(xInPix, yInPix, eBrushType, wInPix, hInPix)
                             {


                                 var eDoodadType = Doodad.E_DOODAD_EMPTY;
                                 var iPosX   = Math.floor(xInPix/4);
                                 var iPosY   = Math.floor(yInPix/4);
                                 var iDimX   = Math.floor(wInPix/4);
                                 var iDimY   = Math.floor(hInPix/4);

                                 var iBrushPosX = iPosX + this.mPos.mX;
                                 var iBrushPosY = iPosY + this.mPos.mY;
                                 //should be an int, no hits or no stars needed or both
                                 var bIsDist = false;
                                 var bIsPass = false;
                                 var bIsNullDoodad = false;

                                 ///todo add to factory
                                 switch(eBrushType){
                                    case E_BRUSH_HQ_ALIVE   : eDoodadType = Doodad.E_DOODAD_HQ_ALIVE  ; bIsDist = true ; mapView.applyBrush(iBrushPosX, iBrushPosY, 304, 32, 16,16,1,1); break;
                                    case E_BRUSH_HQ_DEAD    : eDoodadType = Doodad.E_DOODAD_HQ_DEAD   ; bIsDist = false; mapView.applyBrush(iBrushPosX, iBrushPosY, 320, 32, 16,16,1,1); break;
                                    case E_BRUSH_BRICK_WALL : eDoodadType = Doodad.E_DOODAD_BRICK_WALL; bIsDist = true ; mapView.applyBrush(iBrushPosX, iBrushPosY, 256,  0, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                    case E_BRUSH_STONE_WALL : eDoodadType = Doodad.E_DOODAD_STONE_WALL; bIsDist = false; mapView.applyBrush(iBrushPosX, iBrushPosY, 256, 16, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                    case E_BRUSH_EMPTY      : //fall through
                                    default                 : bIsNullDoodad = true; bIsPass = true; mapView.applyBrush(iBrushPosX, iBrushPosY, 336,  0, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                 }


                                 var limitI = iPosY + iDimY;
                                 var limitJ = iPosX + iDimX;

                                 if(this.bIsInside2v(Vec.Vec2(iPosX,iPosY),Vec.Vec2(iDimX,iDimY))){
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
                                 }
                             })
                         });
    ret.mCells = ret.initLevel();

    //console.log(ret.mCells[0][0].mLevel.mDim.mX);
    return ret;
}
