import QtQuick 2.7

Item {
    x:0;
    y:0;
    property int    mOffsetX :  0;
    property int    mOffsetY :  0;
    property int    mWidth   : 16;
    property int    mHeight  : 16;
    property int    mXTimes  :  1;
    property int    mYTimes  :  1;
    property string mResPath: "../res/general.png";
    property int    mScale   : 4;

    Row{        
        Repeater{
            model:mXTimes;
            Column{
               Repeater{
                    model: mYTimes;                    
                    Rectangle{
                        scale   : mScale
                        clip    : true
                        width   : mWidth
                        height  : mHeight
                        color   : "#00000000"
                        Image {                            
                            x       : -mOffsetX
                            y       : -mOffsetY
                            fillMode: Image.Stretch;
                            mipmap  : false
                            smooth  : false
                            source  : mResPath
                        }
                    }
                }
            }
        }
    }
}
