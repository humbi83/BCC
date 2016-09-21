.import "BCCPainter.js" as BCCPainter
.import QtQuick 2.7 as QQ

function BCCSimpleDooodadPainter(oPaintee) {
    var ret = BCCPainter.BCCPainter(oPaintee);

    ret.component = Qt.createComponent("BBCAtlas.qml");

    if (ret.component.status == QQ.Component.Ready) {

        ret.atlasInstance = ret.component.createObject(root);
    }else
    {
        console.log(component.errorString());
    }

   ret.paint=(function(){
       //if changed
     //  console.log(this.mPos.mX);
     //  console.log(this.mPos.mY);
    this.atlasInstance.x= this.mPos.mX;
    this.atlasInstance.y= this.mPos.mY;
   })
    return ret;
}


