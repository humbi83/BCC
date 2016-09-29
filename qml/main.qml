import QtQuick 2.7
import QtQuick.Window 2.2
import QtQuick.Controls 2.0
import QtMultimedia 5.5
import OpenGLUnderQML 1.0
import QtQml.StateMachine 1.0 as SM


import "BCCVec.js" as Vec
import "BCCGlobal.js" as BCCGlobal
import "BCCLevel.js" as BCCLevel
//import "BCCSimpleDoodadPainter.js" as BCCSimpleDoodadPainter
import "BCCMain.js" as BCCMain


Window {

    SM.StateMachine{
        id:bccSM
        initialState: sStartLevel
        running: true
        SM.State{
            id : sStartLevel
            initialState: sStartLevel_sCloseAnim
            SM.State
            {
                id: sStartLevel_sCloseAnim
                onEntered:{anim1.start()}

                SM.SignalTransition {
                                 targetState: sStartLevel_sWaitKeyPressedEnter
                                 signal: anim1.onStopped
                             }
            }

            SM.State
            {
                id:sStartLevel_sWaitKeyPressedEnter
                onEntered:{rLevelStart_Stage1.visible = true;}

                SM.SignalTransition{
                    targetState: sStartLevel_sOpenAnim;
                    signal: keyHandler.Keys.onEnterPressed
                }
            }
            SM.State
            {
                id: sStartLevel_sOpenAnim
                onEntered: {anim2.start()}
            }
        }
    }




    id : "rootWindow"
    visible: true
    //832
    width: 1024;//(256 = 16 + 208 + 32)  * 4
    height: 960; //(240 = 16+208 + 16) *4
    color: "black"
    title: qsTr("Hello World")

        property var myBCCMain : BCCMain.BCCMain();

    //Rectangle{
    //    color:"black"
    //    width: rootWindow.width;
    //    height: rootWindow.height;
    //}

    Timer {
        id : _BCCMainTimer
            interval: 32; running: true; repeat: true;triggeredOnStart: true
            onTriggered: myBCCMain.notify(myBCCMain.E_EVENT_TIMER,_BCCMainTimer);
        }

    Item {
        id : keyHandler
        focus: true;
        Keys.onPressed : myBCCMain.notify(myBCCMain.E_EVENT_KEY_DOWN, event);
        Keys.onReleased: myBCCMain.notify(myBCCMain.E_EVENT_KEY_UP  , event);
    }

    Squircle {
        width: 832
        height: 832
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
        id : levelStartAnimRes

        color :"black"
        width : rootWindow.width ;
        height: rootWindow.height;
        property var mDuration: 2000


        property var mYH : 0//rootWindow.height/2 ;

        SequentialAnimation on mYH {
            id : anim1
            NumberAnimation { to: rootWindow.height/2; duration: 2000; easing.type: Easing.InQuad }
            running: false
        }

        SequentialAnimation on mYH {
            id : anim2
            NumberAnimation { to: 0; duration:2000; easing.type: Easing.OutQuad }
            running: false
        }

        //0 -> h/2
        Rectangle
        {
            y : 0
            color :"#636363"
            width : rootWindow.width
            height: parent.mYH
        }

        Rectangle
        {
            y : rootWindow.height - parent.mYH
            color :"#636363"
            width : rootWindow.width
            height: rootWindow.height
        }

        Rectangle{

            id : rLevelStart_Stage1
            visible:false;
            anchors.centerIn: levelStartAnimRes

            BBCAtlasFrame
            {
                id : rLevelStart_Stage1_Stage
                mOffsetX: 328
                mOffsetY: 176
                mWidth:40
                mHeight:8
            }

            BBCAtlasFrame
            {
                id : rLevelStart_Stage1_1
                //x : rLevelStart_Stage1_Stage.width + 64
                mOffsetX: 336
                mOffsetY: 183
                mWidth:8
                mHeight:8
            }



            //328x183, 40x16 // all chars0-9
        }

        Component.onCompleted: {
            //anim1.start();
        }
    }

//////// KINDA WORKS
    Audio {
           id: channel1
           source: "../res/BCSnd1.mp3"
       }
}
