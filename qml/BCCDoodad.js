.import "BCCIVec.js" as BCCIVec
.import "BCCLevel.js" as BCCLevel

function BCCDoodad4i3b(iPosX,iPosY,iDimX,iDimY, bIsMovable, bIsDestroyable, bIsPassable)
{
    var ret = new Object({
                             level          : 0,
                             mPos           : BCCIVec.BCCIVec2i(iPosX,iPosY),
                             mDim           : BCCIVec.BCCIVec2i(iDimX,iDimY),
                             mIsMovable     : bIsMovable,
                             mIsDestroyable : bIsDestroyable,
                             mIsPassable    : bIsPassable

                             //function move(deltaX,deltaY){}

                         });
}

function BCCDoodad4iTTF(iPosX,iPosY,iDimX,iDimY)
{
    return BCCDoodad4i3b(iPosX,iPosY,iDimX,iDimY,false,false,true);
}
