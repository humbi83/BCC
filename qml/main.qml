import QtQuick 2.7
import QtQuick.Window 2.2
import QtQuick.Controls 2.0


import "BCCVec.js" as Vec
import "BCCGlobal.js" as BCCGlobal
import "BCCLevel.js" as BCCLevel
//import "BCCSimpleDoodadPainter.js" as BCCSimpleDoodadPainter
import "BCCMain.js" as BCCMain


Window {

    id : "root"
    visible: true
    width: 832
    height: 832
    color: "black"
    title: qsTr("Hello World")

        property var myBCCMain : BCCMain.BCCMain();

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

    BBCIVec {id: someID; mX : 0; mY : 0}


    //property BBCIVec sss : BBCIVec._BBCIVec_new(10,10);
    property var someObjectCtor: (function(cX,cY){
        return new Object({
                                    x:cX,
                                    y:cY,
                                    getX:(function(){ return x;})

                               });
    });

    property var ivec0  : Vec.Vec2();
    property var ivec10 : Vec.Vec2(10,10);
  // property var level : BCCLevel.BCCLevel(BCCGlobal.LEVEL_NO_CELLS,BCCGlobal.LEVEL_NO_CELLS);

    property var instance: someObjectCtor(2,2);
   // property BBCIVec somep : factory.newBBCIVec(1,1)
   // Component.onCompleted: {
   //     var _this = new Object();
   //     _this.prop1 = 1;
   //     _this.prop2 = 2;
   //     _this.get1 = (function(){return _this.prop1;});
   //     _this.set1 = (function(value){return _this.prop1=value;});
   //     console.log(_this.prop1);
   //     console.log(_this.get1());
   //     _this.set1(3);
   //     console.log(_this.get1());
   // }

    Component.onCompleted: {
        var _this = new Object({
        prop1 : 1,
        prop2 : 2,
        get1  : (function(){return _this.prop1;}),
        set1  : (function(value){return _this.prop1=value;}),
        bbcI  : (function(){var ret = Qt.createComponent("BBCIVec.qml"); return BBCIVec._BBCIVec_new(10,10);})
     //bbcI  : (function(){return new BBCIVec;})
                               });
        console.log(_this.prop1);
        console.log(_this.get1());
        _this.set1(3);
        console.log(_this.get1());
       // var bbc = _this.bbcI();

        console.log(ivec10.mX);
        //not working console.log(ivec0._this.mX);
        console.log(ivec0.iGetX());

        //var somePainter = BCCSimpleDoodadPainter.BCCSimpleDooodadPainter(null);
        myBCCMain.notify(myBCCMain.E_EVENT_INIT,null);
        _BCCMainTimer.start();
    }

//////// KINDA WORKS
//    Audio {
//           id: channel1
//           source: "../res/BCSnd1.mp3"
//       }
//
   // MainForm {
   //     anchors.fill: parent
   //     mouseArea.onClicked: {
   //         Qt.quit();
   //     }
   //
   //
   //
   //     GridView {
   //         id: gridView1
   //         anchors.fill: parent
   //         delegate: Item {
   //             x: 5
   //             height: 50
   //             Column {
   //                 Rectangle {
   //                     width: 40
   //                     height: 40
   //                     color: colorCode
   //                     anchors.horizontalCenter: parent.horizontalCenter
   //                 }
   //
   //                 Text {
   //                     x: 5
   //                     text: name
   //                     font.bold: true
   //                     anchors.horizontalCenter: parent.horizontalCenter
   //                 }
   //                 spacing: 5
   //             }
   //         }
   //         //model: ListModel {
   //         //    ListElement {
   //         //        name: "Grey"
   //         //        colorCode: "grey"
   //         //    }
   //         //
   //         //    ListElement {
   //         //        name: "Red"
   //         //        colorCode: "red"
   //         //    }
   //         //
   //         //    ListElement {
   //         //        name: "Blue"
   //         //        colorCode: "blue"
   //         //    }
   //         //
   //         //    ListElement {
   //         //        name: "Green"
   //         //        colorCode: "green"
   //         //    }
   //         //}
   //
   //         cellHeight: 64
   //         cellWidth: 64
   //     }
   // }
}
