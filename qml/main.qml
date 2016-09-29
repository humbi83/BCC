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
        initialState: sMainMenu
        running: true

        SM.State{
            id : sMainMenu
            onEntered:{
                rMainMenu.visible = true;
                rMainMenu_ShowAnim.start();
                levelStartAnimRes.visible = false;
            }

            onExited :{
                rMainMenu.visible = true;
                levelStartAnimRes.visible = false;
            }
        }
        SM.State{
            id : sStartLevel
            initialState: sStartLevel_sCloseAnim
            SM.State
            {
                id: sStartLevel_sCloseAnim
                onEntered:{anim1.start();}

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

                SM.TimeoutTransition
                {
                    targetState: sStartLevel_sOpenAnim
                    timeout: 3000
                }

                onExited: {rLevelStart_Stage1.visible = false;}
            }

            SM.State
            {
                id: sStartLevel_sOpenAnim
                onEntered: {anim2.start(); }
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
                NumberAnimation { to: 1; duration: 1000; easing.type: Easing.InQuad }
                NumberAnimation { to: 0; duration: 1000; easing.type: Easing.OutQuad }
                loops: Animation.Infinite
                running: true
            }
        }

    Component.onCompleted: {     

        //Enable !!!!
       // myBCCMain.notify(myBCCMain.E_EVENT_INIT,null);
       // _BCCMainTimer.start();

    }



    Rectangle{

id : rMainMenu

        property var zX : 418
        property var zY : 400

        SequentialAnimation on y {
            id : rMainMenu_ShowAnim
            NumberAnimation { to: rMainMenu.zY; duration: 4000; easing.type: Easing.InBounce }
        }


        x  : 400 + 18
        y  : zY + rootWindow.height
        visible: false;

        color :"black"
        width : rootWindow.width ;
        height: rootWindow.height;
        property var mScale : 3.5

        Image {

            y : -300
            id: rMainMenu_Phone
            anchors.horizontalCenter: parent.Center

            scale : rMainMenu.mScale
            smooth : false
            source: "../BCCMenuPhone.png"
        }

        Image {

anchors.horizontalCenter: parent.Center

x : -45
y : -350
                    id: rMainMenu_Mail
                    scale  :rMainMenu.mScale
                    smooth : false

                    source: "../BCCMenuMail.png"
                }


        Image {

            anchors.horizontalCenter: parent.Center
y:-50
            id: rMainMenu_List
            scale : rMainMenu.mScale

            smooth : false
            source: "../BCCMenuMiddle.png"
        }
        Image {
            y : 400
            scale : rMainMenu.mScale
            id: rMainMenu_ARR

            source: "../BCCMenuBottom.png"
            smooth : false
        }

    }


    Rectangle{
        id : levelStartAnimRes

        visible: false;

        color :"black"
        width : rootWindow.width ;
        height: rootWindow.height;
        property var mDuration: 1000


        property var mYH : 0//rootWindow.height/2 ;

        SequentialAnimation on mYH {
            id : anim1
            NumberAnimation { to: rootWindow.height/2; duration: levelStartAnimRes.mDuration; easing.type: Easing.InQuad }
            running: false
        }

        SequentialAnimation on mYH {
            id : anim2
            NumberAnimation { to: 0; duration:levelStartAnimRes.mDuration; easing.type: Easing.OutQuad }
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
            color : "#636363"
            width : 256
            height: 32


            BBCAtlasFrame
            {
                id : rLevelStart_Stage1_Stage

                anchors.left: parent.left;
                anchors.leftMargin: 60

                anchors.top:parent.top
                anchors.topMargin:12


                mOffsetX: 328
                mOffsetY: 176
                mWidth  :40
                mHeight :8
                mResPath: "../res/general_org.png";
            }

            BBCAtlasFrame
            {
                id : rLevelStart_Stage1_1

                anchors.left: parent.left
                //lM = 60 for what ever reason + 4*40(width prev item) +  16*4 empty space
                //(i'm missing something regarding scaling in BBCAtlas + 160
                anchors.leftMargin: 264

                anchors.top:parent.top
                anchors.topMargin:8



                mOffsetX: 336
                mOffsetY: 183
                mWidth:8
                mHeight:8
                mResPath: "../res/general_org.png";
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
