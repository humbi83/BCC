
function BCCIVec2i(iX,iY) {
    var ret = new Object({

                             mX : iX,
                             mY : iY,
                             tSet2i : (function(iX,iY){
                                 mX=iX;
                                 mY=iY;
                             }),

                             //function bIsInside2iv(){}
                             iGetX:(function(){return this.mX;}),
                             iClampX2i:(function(iLow, iHigh)
                             {
                                 return g_f_clamp(mX, iLow, iHigh);
                             }),

                             iClampY2i: (function ( iLow, iHigh)
                             {
                                 return g_f_clamp(mY, iLow, iHigh);
                             }),

                             ivClampXY4i:(function(iLowX, iHighX, iLowY, iHighY){
                                 var ret = new BBCIVec2;
                                 ret.mX = clampX2i(iLowX,iHighX);
                                 ret.mY = clampY2i(iLowY,iHighY);
                                 return ret;
                             }),
                             ivClampXY2iv:(function(iv2Low, iv2High)
                             {
                                 return clampXY4i(iv2Low.mX,iv2High.mX,iv2Low.mY,iv2High.mY);
                             })

                         });
    return ret;
}


function BCCIVecv(){
    return BCCIVec2i(0,0);
}
