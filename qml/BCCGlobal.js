.import "BCCVec.js" as Vec

var LEVEL_SCALE         =  4;
var LEVEL_CELL_PIX_SZ   =  4;
var TANK_PIX_SZ         = 16;
var LEVEL_NO_CELLS      = 13 * TANK_PIX_SZ / LEVEL_CELL_PIX_SZ;

function clamp(val, min, max)
{
    return val < min ? min : val > max? max : val;
}

function pixXY2CellV(x,y){
return Vec.Vec2(Math.floor(x/LEVEL_CELL_PIX_SZ),Math.floor(y/LEVEL_CELL_PIX_SZ));
}


function cUpdate(updatable){
    updatable && updatable.update && updatable.update();
}

function cPaint(paintable){
    paintable && paintable.paint && paintable.paint();
}

function cUpdatePaint(element){
    cUpdate(element);
    cPaint(element);
}
