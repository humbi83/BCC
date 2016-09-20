import QtQuick 2.0

BCCDoodad {
    frames:[];


    function clamp(val, min, max)
    {
        return val < min ? min : val > max? max : val;
    }

    function canMove(xDelta,yDelta,level)
    {
        var ret = false;
        var newX =
    }

    function moveUp   (){var changed = false; var cell = mCellY; cell--; cell = clamp(cell,0,13*2); changed = cell != mCellY; return changed;}
    function moveDown (){var changed = false; var cell = mCellY; cell++; cell = clamp(cell,0,13*2); changed = cell != mCellY; return changed;}
    function moveLeft (){var changed = false; var cell = mCellX; cell--; cell = clamp(cell,0,13*2); changed = cell != mCellX; return changed;}
    function moveRight(){var changed = false; var cell = mCellX; cell++; cell = clamp(cell,0,13*2); changed = cell != mCellX; return changed;}
}
