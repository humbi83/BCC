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
                             //can I do this
                             mDynObjects: [],
                             mFreeDynObjects: 0,
                             mCells : [],
                             mUpdatableDoodads: [],
                             mPaintableDoodads: [],
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
                                 for(var i = 0; i<this.mUpdatableDoodads.length;i++)
                                 {
                                     if(this.mUpdatableDoodads[i] != null){
                                        this.mUpdatableDoodads[i].update(tick);
                                     }
                                 }

                                 for(var i=0; i<this.mDynObjects.length;i++){
                                     if(this.mDynObjects[i] != null){
                                        this.mDynObjects[i].update(tick);
                                     }
                                 }
                             }),

                             paint:(function() {

                                 for(var i = 0; i<this.mPaintableDoodads.length;i++)
                                 {
                                     if(this.mPaintableDoodads[i] != null){
                                        this.mPaintableDoodads[i].paint();
                                     }
                                 }

                                 for(var i=0; i<this.mDynObjects.length;i++){
                                     if(this.mDynObjects[i] != null){
                                        this.mDynObjects[i].paint();
                                     }
                                 }
                             }),

                             addDynObj:(function(object){
                                 if(this.mFreeDynObjects > 0){
                                    for(var i = 0; i< this.mDynObjects.length;i++)
                                    {
                                        if(this.mDynObjects[i] == null)
                                        {
                                            this.mDynObjects[i] = object;
                                            this.mFreeDynObjects-- ;
                                            break;
                                        }
                                    }
                                 }else{
                                     this.mDynObjects.push(object);
                                 }
                             }),

                             remDynObj:(function(object){
                                 var ret = false;

                                 for(var i = 0; i< this.mDynObjects.length;i++)
                                 {
                                    if(this.mDynObjects[i] == object)
                                    {
                                        this.mDynObjects[i] = null;
                                        this.mFreeDynObjects++;
                                        ret = true;
                                        break;
                                    }
                                 }
                                 return ret;
                             }),
                             bIsInside2v:(function(vPos,vDim){
                                 return vPos.mX >= 0 &&
                                        vPos.mY >= 0 &&
                                        vPos.mX + vDim.mX <=  this.mDim.mX &&
                                        vPos.mY + vDim.mY <=  this.mDim.mY ;
                             }),

                             //bullets will kill, they will check for collision
                             //so no check in tank, tanks only for collision with other tanks
                             collidesWithDynamic2v:(function(oDoodad, vPos, vDim){

                                 var ret = [];

                                 if(oDoodad != null){
                                    vPos = oDoodad.mCellPos;
                                    vDim = oDoodad.mCellDim;
                                 }

                                 var vPosClmp = vPos.ivClampXY2iv(Vec.Vec2(), this.mDim.vPlusXY(-1,-1));
                                 for(var i=0; i < this.mDynObjects.length;i++)
                                 {
                                     var dynObj = this.mDynObjects[i];

                                     if( dynObj != null &&
                                             (oDoodad != null && dynObj != oDoodad || oDoodad == null) &&

                                             Global.rectOverlaps(
                                                 vPos           , vDim,
                                                 dynObj.mCellPos, dynObj.mCellDim)
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
                                 switch(eBrushType){
                                    case E_BRUSH_HQ_ALIVE   : mapView.applyBrush(Math.floor(xInPix/4), Math.floor(yInPix/4), 304, 32, 16,16,1,1); break;
                                    case E_BRUSH_HQ_DEAD    : mapView.applyBrush(Math.floor(xInPix/4), Math.floor(yInPix/4), 320, 32, 16,16,1,1); break;
                                    case E_BRUSH_BRICK_WALL : mapView.applyBrush(Math.floor(xInPix/4), Math.floor(yInPix/4), 256,  0, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                    case E_BRUSH_STONE_WALL : mapView.applyBrush(Math.floor(xInPix/4), Math.floor(yInPix/4), 256, 16, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                    case E_BRUSH_EMPTY      : //fall through
                                    default                 : mapView.applyBrush(Math.floor(xInPix/4), Math.floor(yInPix/4), 336,  0, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                 }
                             }),
                             //ret false or something on failure
                             addPixXYDoodad: (function(x,y,eDoodadType, w,h){
                                 var dFact = Doodad.BCCDoodadFactory(this);

                                 var oDoodad = dFact.newInstance(eDoodadType, w, h);

                                 oDoodad.setPixXY(x,y);
                                 if(oDoodad.update != undefined){
                                     this.mUpdatableDoodads.push(oDoodad);
                                 }

                                 if(oDoodad.paint != undefined){
                                    this.mPaintableDoodads.push(oDoodad);
                                 }

                                 for(var i=oDoodad.mCellPos.mY;i< (oDoodad.mCellPos.mY + oDoodad.mCellDim.mY) && i < this.mCells.length;i++)
                                 {
                                     for(var j=oDoodad.mCellPos.mX;j<(oDoodad.mCellPos.mX + oDoodad.mCellDim.mX) && j < this.mCells[i].length;j++)
                                     {
                                        this.mCells[i][j].mStationedDoodad = oDoodad;
                                     }
                                 }

                             })

                         });
    ret.mCells = ret.initLevel();

    //console.log(ret.mCells[0][0].mLevel.mDim.mX);
    return ret;
}
