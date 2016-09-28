import QtQuick 2.7
import QtQuick.Window 2.2
import QtQuick.Controls 2.0
import QtMultimedia 5.5
import OpenGLUnderQML 1.0


import "BCCVec.js" as Vec
import "BCCGlobal.js" as BCCGlobal
import "BCCLevel.js" as BCCLevel
//import "BCCSimpleDoodadPainter.js" as BCCSimpleDoodadPainter
import "BCCMain.js" as BCCMain


Window {

    id : "rootWindow"
    visible: true
    width: 832
    height: 832
    color: "black"
    title: qsTr("Hello World")

        property var myBCCMain : BCCMain.BCCMain();

    Rectangle{
        color:"black"
        width: rootWindow.width;
        height: rootWindow.height;
    }

    Timer {
        id : _BCCMainTimer
            interval: 16; running: true; repeat: true;triggeredOnStart: true
            onTriggered: myBCCMain.notify(myBCCMain.E_EVENT_TIMER,_BCCMainTimer);
        }

    Item {
    focus: true;
        Keys.onPressed : myBCCMain.notify(myBCCMain.E_EVENT_KEY_DOWN, event);
        Keys.onReleased: myBCCMain.notify(myBCCMain.E_EVENT_KEY_UP  , event);
    }

    Squircle {
        id : mapView;
            SequentialAnimation on t {
                NumberAnimation { to: 1; duration: 2500; easing.type: Easing.InQuad }
                NumberAnimation { to: 0; duration: 2500; easing.type: Easing.OutQuad }
                loops: Animation.Infinite
                running: true
            }
        }

    Component.onCompleted: {     
        myBCCMain.notify(myBCCMain.E_EVENT_INIT,null);
        _BCCMainTimer.start();
       // someQ.applyBrush(16,16,256,0,16,16,2,3);
    }

    Rectangle{
        x : 100
        y : 100
        width:  20
        height: 20
        //scale : 4
        color :"red"
    }
//////// KINDA WORKS
    Audio {
           id: channel1
           source: "../res/BCSnd1.mp3"
       }
}
