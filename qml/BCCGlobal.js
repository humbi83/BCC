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

// I should have some cb with gfx node destroyed
var E_DOODAD_LC_STATE_ALIVE       = 0;
var E_DOODAD_LC_STATE_DESTROY_REQ = 1;
var E_DOODAD_LC_STATE_DESTROYED   = 2;

//Move to some math js
function clamp(val, min, max)
{
    return val < min ? min : val > max? max : val;
}

function rectOverlaps( vPos1, vDim1, vPos2, vDim2)
{
    //RectA.Left < RectB.Right && RectA.Right > RectB.Left &&
    //RectA.Top < RectB.Bottom && RectA.Bottom > RectB.Top )
    var vPos1RB = vPos1.vPlus(vDim1);
    var vPos2RB = vPos2.vPlus(vDim2);

    return (
               vPos1.mX < vPos2RB.mX && vPos1RB.mX > vPos2.mX &&
               vPos1.mY < vPos2RB.mY && vPos1RB.mY > vPos2.mY
           );
}
function dirAndSpdToVec(eDir, mag)
{
    var ret = Vec.Vec2();
    switch(eDir)
    {
        case E_DIR_UP    : ret.setXY( 0,-1);break;
        case E_DIR_LEFT  : ret.setXY(-1, 0);break;
        case E_DIR_DOWN  : ret.setXY( 0, 1);break;
        case E_DIR_RIGHT : ret.setXY( 1, 0);break;
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

function remObject(obj, array){
    var ret = false;

    var i = 0;
/////////this is not working
    console.log(array);
    for(; i < array.length;i++)
    {
        var eleI = array[i];

       if(eleI === obj)
       {
           console.log(i);
           array.splice(i, 1);
           ret = true;
           break;
       }
    }

    console.log(array);
    return ret;
}

function isOV(object)
{
    return object != undefined && object != null;
}



