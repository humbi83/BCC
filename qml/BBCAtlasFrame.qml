import QtQuick 2.0

Item {
    scale: 4;

    property int    mOffsetX;
    property int    mOffsetY;
    property int    mWidth  ;
    property int    mHeight ;
    property string mResPath: "../res/general.png";

    Rectangle{
            clip: true   ;
            w   : mWidth ;
            h   : mHeight;
        Image {
            x       : mOffsetX;
            y       : mOffsetY;
            fillMode: Image.Stretch;
            mipmap  : false;
            smooth  : false;
            source  : mResPath
        }
    }
}
