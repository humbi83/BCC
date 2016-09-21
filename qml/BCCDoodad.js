.import "BCCIVec.js" as BCCIVec

function BCCDoodad2o4i3b(oPainter,oLevel,iPosX,iPosY,iDimX,iDimY, bIsMovable, bIsDestroyable, bIsPassable)
{
    var ret = new Object({
                             mPainter       : oPainter,
                             mLevel         : oLevel,
                             mPos           : BCCIVec.BCCIVec2i(iPosX,iPosY),
                             mDim           : BCCIVec.BCCIVec2i(iDimX,iDimY),
                             mIsMovable     : bIsMovable,
                             mIsDestroyable : bIsDestroyable,
                             mIsPassable    : bIsPassable

                             //function move(deltaX,deltaY){}

                         });
    return ret;
}

function BCCDoodad2o4iFFT(oPainter, oLevel, iPosX, iPosY, iDimX, iDimY)
{
    return BCCDoodad2o4i3b(oPainter, oLevel, iPosX,iPosY,iDimX,iDimY,false,false,true);
}
