import QtQuick 2.0

Item {
    property BBCLevel level;

    property int  mCellX      : 0;
    property int  mCellY      : 0;
    property int  mCellW      : 1;
    property int  mCellH      : 1;
    property bool mIsMovable     : false;
    property bool mIsDestroyable : false;
    property bool mIsPassable    : false;

    function move(deltaX,deltaY){}
}
