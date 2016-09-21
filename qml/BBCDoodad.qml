import QtQuick 2.0
import "BCCSimpleDoodadPainter" as bla
Item {
        id: container
        width: 300; height: 300

        function loadButton() {
            var component = Qt.createComponent("Button.qml");
            if (component.status == Component.Ready) {
                var button = component.createObject(container);
                button.color = "red";
            }
        }

        Component.onCompleted: loadButton()
}
