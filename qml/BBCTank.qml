import QtQuick 2.0

//cell should be 4x4
//13x13 cells, 16x16/4x4/4x8 ? others cell gfx
Item {

//TODO:ALEX: move this
    property int cBOARD_CELL_NO_W : 13 * 4 * 4;
    property int cBOARD_CELL_NO_H : 13 * 4 * 4;

    property int cBOARD_CELL_PIX_SZ_W : 4;
    property int cBOARD_CELL_PIX_SZ_H : 4;

    //TODO:ALEX: Move this
    property int mKeyBindUp   : Qt.Key_Up   ;
    property int mKeyBindDown : Qt.Key_Down ;
    property int mKeyBindLeft : Qt.Key_Left ;
    property int mKeyBindRight: Qt.Key_Right;
    property int mKeyBindFire : Qt.Key_Space;

    property int mCellX : 0;
    property int mCellY : 0;

    x : mCellX * cBOARD_CELL_PIX_SZ_W;
    y : mCellY * cBOARD_CELL_PIX_SZ_H;

    BBCAtlas{}


    //TODO:ALEX: MOVE THIS
    function clamp(val, min, max)
    {
        return val < min ? min : val > max? max : val;
    }

    focus: true;
    Keys.onPressed: {

        switch(event.key){
        case mKeyBindUp:
            mCellY--;
            break;
        case mKeyBindDown:
            mCellY++;
            break;
        case mKeyBindLeft:
            mCellX--;
            break;
        case mKeyBindRight:
            mCellX++;
            break;
        case mKeyBindFire:
            //TODO:ALEX
            break;
        default:
            //nothing
            break;
        }

        console.log("Before Clamp",mCellX, mCellY);

        mCellX = clamp(mCellX,0,cBOARD_CELL_NO_W);
        mCellY = clamp(mCellY,0,cBOARD_CELL_NO_H);

        console.log("Before Clamp",mCellX, mCellY);
    }

}
