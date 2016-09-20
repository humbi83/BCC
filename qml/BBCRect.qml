import QtQuick 2.0

Item {
    property BBCIVec point : BBCIVec._new(0,0);
    property BBCIVec dim   : BBCIVec._new(0,0);

    function _new(x,y,w,h){
        var ret = new BBCRect;
        ret.point = BBCIVec._new(x,y);
        ret.dim   = BBCIVec._new(w,h);
    }

    function _new(pos,dim){
        return BBCRect._new(pos.x, pos.y, dim.x , dim.y);
    }
}
