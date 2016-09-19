//atlas qml
import QtQuick 2.7

Item {
    property int mIdxX : 0;
    property int mIdxY : 0;

    property string mResPath: "../res/general.png";

    property int mOffsetX : 0;
    property int mOffsetY : 0;

    property int mResCellW : 16;
    property int mResCellH : 16;

    scale : 4;

    Rectangle{

            id: rectangle1
            clip: true
            width: parent.mResCellW
            height: parent.mResCellH

        Image {
            x: parent.parent.mOffsetX - parent.parent.mIdxX * parent.width
            y: parent.parent.mOffsetY - parent.parent.mIdxY * parent.height
            id: name
            fillMode: Image.Stretch
            mipmap : false;
            smooth: false;
            source: mResPath
        }
    }

}
