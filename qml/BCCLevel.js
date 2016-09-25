.import "BCCGlobal.js" as Global
.import "BCCVec.js"   as Vec
.import "BCCDoodad.js" as Doodad
.import "BCCLevelCell.js" as Cell

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
                             mCells : null,
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

                             //No check for the moment !!!
                             collidesOn2v:(function(vPos,vDim){
                                 var __ret = [];

                                 for(var i = vPos.mY; i < (vPos.mY + vDim.mY );i++ ){
                                     for(var j = vPos.mX; j < (vPos.mX + vDim.mX) ;j++ )
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
