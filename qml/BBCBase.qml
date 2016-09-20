import QtQuick 2.0

Item {
    property int g_c_LEVEL_NO_CELLS: 13 * 2;

    function g_f_clamp(val, min, max)
    {
        return val < min ? min : val > max? max : val;
    }


    function _BBCIVec_new(iX,iY){
        var ret = new BBCIVec;
        ret.mX = iX;
        ret.mY = iY;
    }
}
