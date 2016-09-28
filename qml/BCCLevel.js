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

                             //TODO: ALEX: rm also from other lists !!!!!
                             addDynObj:(function(object){                                 
                                this.mDynObjects.push(object);
                             }),


                             remDynObj:(function(oDoodad){

                                 var ret = Global.remObject(oDoodad, this.mDynObjects);
                                     ret = Global.remObject(oDoodad, this.mUpdatableDoodads);
                                     ret = Global.remObject(oDoodad, this.mPaintableDoodads);

                                 //should be done on doodad side, + have getters, setters to control & validate the values
                                 var iPosX = Global.clamp(oDoodad.mCellPos.mX,0,Global.LEVEL_NO_CELLS - 1 );
                                 var jLimit = iPosX + oDoodad.mCellDim.mX;

                                 var iPosY = Global.clamp(oDoodad.mCellPos.mY,0,Global.LEVEL_NO_CELLS - 1 );
                                 var iLimit = iPosY + oDoodad.mCellDim.mY;



                                 for(var i=iPosY; i < iLimit && i < this.mCells.length;i++)
                                 {
                                     var lenI = this.mCells[i].length;

                                     for(var j=iPosX; j < jLimit && j < lenI ;j++)
                                     {
                                         var sDoodad = this.mCells[i][j].mStationedDoodad != undefined ? this.mCells[i][j].mStationedDoodad : null;
                                         if( sDoodad == oDoodad){
                                            this.mCells[i][j].mStationedDoodad = null;
                                         }
                                     }
                                 }

                                    //? -- cells
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
                                 var eDoodadType = Doodad.E_DOODAD_EMPTY;
                                 var iPosX   = Math.floor(xInPix/4);
                                 var iPosY   = Math.floor(yInPix/4);
                                 var iDimX   = Math.floor(wInPix/4);
                                 var iDimY   = Math.floor(hInPix/4);

                                 //should be an int, no hits or no stars needed or both
                                 var bIsDist = false;

                                 ///todo add to factory
                                 switch(eBrushType){
                                    case E_BRUSH_HQ_ALIVE   : eDoodadType = Doodad.E_DOODAD_HQ_2F     ; bIsDist = true ; mapView.applyBrush(iPosX, iPosY, 304, 32, 16,16,1,1); break;
                                    case E_BRUSH_HQ_DEAD    : eDoodadType = Doodad.E_DOODAD_HQ_2F     ; bIsDist = false; mapView.applyBrush(iPosX, iPosY, 320, 32, 16,16,1,1); break;
                                    case E_BRUSH_BRICK_WALL : eDoodadType = Doodad.E_DOODAD_BRICK_WALL; bIsDist = true ; mapView.applyBrush(iPosX, iPosY, 256,  0, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                    case E_BRUSH_STONE_WALL : eDoodadType = Doodad.E_DOODAD_STONE_WALL; bIsDist = false; mapView.applyBrush(iPosX, iPosY, 256, 16, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                    case E_BRUSH_EMPTY      : //fall through
                                    default                 : mapView.applyBrush(Math.floor(xInPix/4), Math.floor(yInPix/4), 336,  0, Global.clamp(wInPix, 4,16), Global.clamp(hInPix, 4, 16), Math.max(1,Math.floor(wInPix / 16)), Math.max(1,Math.floor(hInPix /16))); break;
                                 }

                                 ///Not nice
                                 var oDoodad = Doodad.BCCDoodad2o4i3b(eDoodadType, null, this, iPosX, iPosY, iDimX, iDimY, bIsDist, false);

                                 //ALEX: Do not forget to remove them !!!!!
                                 for(var i=oDoodad.mCellPos.mY;i< (oDoodad.mCellPos.mY + oDoodad.mCellDim.mY) && i < this.mCells.length;i++)
                                 {
                                     for(var j=oDoodad.mCellPos.mX;j<(oDoodad.mCellPos.mX + oDoodad.mCellDim.mX) && j < this.mCells[i].length;j++)
                                     {
                                        this.mCells[i][j].mStationedDoodad = oDoodad;
                                     }
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
