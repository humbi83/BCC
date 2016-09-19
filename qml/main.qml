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

    BBCAtlas{
        mResPath : "../res/general.png"
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
