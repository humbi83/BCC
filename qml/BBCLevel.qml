import QtQuick 2.0

BBCBase {

    property variant mData : initLevel;

    function initLevel(){
        var i,j;
        var rows = new Array(g_c_LEVEL_NO_CELLS);
        for(i = 0;i< rows.length;i++)
        {
            rows[i]=new Array(g_c_LEVEL_NO_CELLS);
            for(j=0;j<rows[i].length;i++)
            {
                rows[i][j] = new BBCLevelCell;
                rows[i][j].mCellX = j;
                rows[i][j].mCellY = i;
            }
        }
        return rows;
    }

    //function bIsInside2i(iX,iY)
    //{
    //    BBCIVec._new(iX,iY).
    //}
    //
    //function isPassable1iv(position){
    //    var ret = false;
    //    var cX = g_f_clamp(x, 0, g_c_LEVEL_NO_CELLS - 1);
    //    var cY = g_f_clamp(y, 0, g_c_LEVEL_NO_CELLS - 1);
    //
    //    if(cX == x && cY == y){
    //        ret = mData[cX][cY].mDoodad.isPassable;
    //    }
    //
    //    return ret;
    //}


//    function canBePlaced(x,y,doodad){
//
//    }
//
//
//    function addDoodad(x,y,doodad)
}
