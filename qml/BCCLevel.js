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
                             mCells : null,
                             mUpdatableDoodads: [],
                             mPaintableDoodads: [],
                             initLevel:(function(){
                                 var rows = new Array(iDimY);

                                 for(var i = 0; i < rows.length;i++)
                                 {
                                     var col = new Array(iDimX);

                                     for(var j=0;j<col.length;j++)
                                     {
                                         col[j] = Cell.BBCLevelCell(j,i,this);
                                     }

                                     rows[i] = col;
                                 }
                                 return rows;
                             }),

                             update:(function(){
                                 for(var i = 0; i<this.mUpdatableDoodads.length;i++)
                                 {
                                    this.mUpdatableDoodads[i].update();
                                 }
                             }),

                             paint:(function() {

                                 for(var i = 0; i<this.mPaintableDoodads.length;i++)
                                 {
                                    this.mPaintableDoodads[i].paint();
                                 }
                             }),
                             bIsInside2i:(function(iX,iY)
                             {
                                 return true;
                             }),

                             bIsInside1v:(function(vPos){
                                 return
                             }),
                             bIsInside2v:(function(vPos,vDim){
                                return
                             }),


                             //TODO: add some checks here
                             removeCellXYDoodad:(function(x,y){

                             }),
                             //ret false or something on failure
                             addPixXYDoodad: (function(x,y,eDoodadType){
                                 var dFact = Doodad.BCCDoodadFactory(this);

                                 var oDoodad = dFact.newInstance(eDoodadType);

                                 oDoodad.setPixXY(x,y);
                                 if(oDoodad.update != undefined){
                                     this.mUpdatableDoodads.push(oDoodad);
                                 }

                                 if(oDoodad.paint != undefined){
                                    this.mPaintableDoodads.push(oDoodad);
                                 }

                                 for(var i=oDoodad.mCellPos.mX;i<oDoodad.mCellDim.mX;i++)
                                 {
                                     for(var j=oDoodad.mCellPos.mY;j<oDoodad.mCellDim.mY;j++)
                                     {
                                        mCells[i][j].mStationedDoodad = oDoodad;
                                     }
                                 }

                             })

                         });
    ret.mCells = ret.initLevel();

    //console.log(ret.mCells[0][0].mLevel.mDim.mX);
    return ret;
}
