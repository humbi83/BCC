.import "BCCVec.js" as Vec

var LEVEL_SCALE         =  4;
var LEVEL_CELL_PIX_SZ   =  4;
var TANK_PIX_SZ         = 16;
var LEVEL_NO_CELLS      = 13 * TANK_PIX_SZ / LEVEL_CELL_PIX_SZ;

var NV_E_DIR    = -1;
var E_DIR_UP    =  0;
var E_DIR_LEFT  =  1;
var E_DIR_DOWN  =  2;
var E_DIR_RIGHT =  3;
var SZ_E_DIR    =  4;

var T_tick = 0 ;
var T_LEN  = 16;

function clamp(val, min, max)
{
    return val < min ? min : val > max? max : val;
}

function dirAndSpdToVec(eDir, mag)
{
    var ret = Vec.Vec2();
    switch(eDir)
    {
        case E_DIR_UP    : ret.setXY( 0,-1);
        case E_DIR_LEFT  : ret.setXY(-1, 0);
        case E_DIR_DOWN  : ret.setXY( 0, 1);
        case E_DIR_RIGHT : ret.setXY( 1, 0);
    }

    ret.mulC(mag);

    return ret;
}

function pixXY2CellV(x,y){
return Vec.Vec2(Math.floor(x/LEVEL_CELL_PIX_SZ),Math.floor(y/LEVEL_CELL_PIX_SZ));
}


function cUpdate(updatable, tick){
    updatable && updatable.update && updatable.update(tick);
}

function cPaint(paintable){
    paintable && paintable.paint && paintable.paint();
}

function cUpdatePaint(element, tick){
    cUpdate(element, tick);
    cPaint(element);
}
