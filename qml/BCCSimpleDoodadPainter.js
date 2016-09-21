.import "BCCPainter.js" as BCCPainter
.import QtQuick 2.7 as QQ

var atlasInstance = null;
var component = null;

function BCCSimpleDooodadPainter(oPaintee) {
    //var ret = BCCPainter.BCCPainter(oPaintee);
    var ret = new Object();

    component = Qt.createComponent("BBCAtlas.qml");
    if (component.status == QQ.Component.Ready) {

        var atlasInstance = component.createObject(root);
    }else
    {
        console.log(component.errorString());
    }

   // ret.paint=(function(){
   //
   // })
    return ret;
}


