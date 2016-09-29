import QtQuick 2.0

 BBCAtlasFrame{
    property var  mFrameNo : 2;
    property var  mFrameData:[ [ 0, 0 ], [ 16, 0] ];
    property var  mCurrentFrame : 0
    property var  mDuration : 200

    mOffsetX : mFrameData[Math.floor(mCurrentFrame)][0];
    mOffsetY : mFrameData[Math.floor(mCurrentFrame)][1];
    mWidth   : 16;
    mHeight  : 16;
    mResPath: "../BCCMenuListCursorFrames.png";

    NumberAnimation on mCurrentFrame {
        from : 0
        to   : mFrameData.length - 0.001
        duration: mDuration
        running: parent.visible;
        loops  : Animation.Infinite
    }

 }
