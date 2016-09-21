.import "BCCGlobal.js" as BCCGlobal
.import "BCCIVec.js"   as BCCIVec
.import "BCCDoodad.js" as BCCDoodad

function BCCLevel2i(iDimX,iDimY){
    var ret = new Object({

                             mDim: BCCIVec.BCCIVec2i(iDimX,iDimY),
                             //can I do this
                             mCells : initLevel(mDim),

                             initLevel:(function(){
                                 var i,j;
                                 var rows = new Array(this.mDim.mY);
                                 for(i = 0;i< rows.length;i++)
                                 {
                                     rows[i]=new Array(this.mDim.mX);
                                     for(j=0;j<rows[i].length;i++)
                                     {
                                         rows[i][j] = new BCCDoodad.BCCDoodad4iFFT(i,j,1,1);
                                     }
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
    return ret;
}
