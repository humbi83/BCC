.import "BCCGlobal.js" as BCCGlobal
.import "BCCIVec.js"   as BCCIVec
.import "BCCDoodad.js" as BCCDoodad

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

function BCCLevel2i(iDimX,iDimY){
    var ret = new Object({

                             mDim: BCCIVec.BCCIVec2i(iDimX,iDimY),
                             //can I do this
                             mCells : null,

                             initLevel:(function(){
                                 var rows = new Array(iDimY);

                                 for(var i = 0; i < rows.length;i++)
                                 {
                                     var col = new Array(iDimX);

                                     for(var j=0;j<col.length;j++)
                                     {
                                         col[j] = BCCDoodad.BCCDoodad2o4iFFT(null,this,i,j,1,1);
                                     }

                                     rows[i] = col;
                                 }
                                 return rows;
                             }),

                             bIsInside2i:(function(iX,iY)
                             {
                                 return true;
                             }),

                             isPassable1iv:(function(position){
                                 var ret = false;
                                 var cX = g_f_clamp(x, 0, g_c_LEVEL_NO_CELLS - 1);
                                 var cY = g_f_clamp(y, 0, g_c_LEVEL_NO_CELLS - 1);

                                 if(cX == x && cY == y){
                                     ret = mData[cX][cY].mDoodad.isPassable;
                                 }

                                 return ret;
                             }),

                             //editor stuff
                             canBePlaced: (function(x,y,doodad){
                                return false;
                             }),


                             addDoodad: (function(x,y,doodad){})

                         });
    ret.mCells = ret.initLevel();

    console.log(ret.mCells[0][0].mLevel.mDim.mX);
    return ret;
}
