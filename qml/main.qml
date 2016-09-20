import QtQuick 2.7
import QtQuick.Window 2.2
import QtQuick.Controls 2.0



Window {

    visible: true
    width: 832
    height: 832
    title: qsTr("Hello World")

    BBCBoard{
        id : bbcBoard1
    }

    BBCTank{
        id: tankPlayer;
    }

    BBCIVec {id: someID; mX : 0; mY : 0}
    property var someObjectCtor: (function(cX,cY){
        return new Object({
                                    x:cX,
                                    y:cY,
                                    getX:(function(){ return x;})

                               });
    });

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
        set1  : (function(value){return _this.prop1=value;})
            });
        console.log(_this.prop1);
        console.log(_this.get1());
        _this.set1(3);
        console.log(_this.get1());
    }

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
