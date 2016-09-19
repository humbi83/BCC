import QtQuick 2.7

Rectangle {
    property alias mouseArea: mouseArea

    width: 360
    height: 360

    MouseArea {
        id: mouseArea
        anchors.fill: parent

        GridView {
            id: gridView1
            x: 0
            y: 0
            width: 0
            height: 140
            snapMode: GridView.SnapToRow
            contentWidth: 13
            delegate: Item {
                x: 5
                height: 50
                Column {
                    Rectangle {
                        width: 40
                        height: 40
                        color: colorCode
                        anchors.horizontalCenter: parent.horizontalCenter
                    }

                    Text {
                        x: 5
                        text: name
                        font.bold: true
                        anchors.horizontalCenter: parent.horizontalCenter
                    }
                    spacing: 5
                }
            }
            model: ListModel {
                ListElement {
                    name: "Grey"
                    colorCode: "grey"
                }

                ListElement {
                    name: "Red"
                    colorCode: "red"
                }

                ListElement {
                    name: "Blue"
                    colorCode: "blue"
                }

                ListElement {
                    name: "Green"
                    colorCode: "green"
                }
            }
            cellHeight: 70
            cellWidth: 70
        }
    }

    Text {
        anchors.centerIn: parent
        text: "Hello World"
    }
}
