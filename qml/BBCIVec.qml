import QtQuick 2.0

BBCBase {
    property int mX : 0;
    property int mY : 0;

    function tSet2i(iX,iY){
        mX=iX;
        mY=iY;
    }

    function _BBCIVec_new(iX,iY){
        var ret = Qt.createComponent("BBCIVec.qml");
        ret.mX = iX;
        ret.mY = iY;
        return ret;
    }

    function bIsInside2iv(){}

    function iClampX2i( iLow, iHigh)
    {
        return g_f_clamp(mX, iLow, iHigh);
    }

    function iClampY2i( iLow, iHigh)
    {
        return g_f_clamp(mY, iLow, iHigh);
    }

    function ivClampXY4i(iLowX, iHighX, iLowY, iHighY){
        var ret = new BBCIVec2;
        ret.mX = clampX2i(iLowX,iHighX);
        ret.mY = clampY2i(iLowY,iHighY);
        return ret;
    }
    function ivClampXY2iv(iv2Low, iv2High)
    {
        return clampXY4i(iv2Low.mX,iv2High.mX,iv2Low.mY,iv2High.mY);
    }

}
