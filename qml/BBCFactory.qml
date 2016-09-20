import QtQuick 2.0

Item {
    property var newBBCIVec: (function(iX,iY){var ret = new BBCIVec;
        ret.mX = iX;
        ret.mY = iY;
        return ret;
    })
}
