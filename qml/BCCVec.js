
function Vec2(iX,iY) {

    var pX = iX != undefined ?  iX : 0;
    var pY = iY != undefined ?  iY : 0;

    var ret = new Object({

                             mX : pX,
                             mY : pY,

                             setXY: (function(x,y){
                                 this.mX=x;
                                 this.mY=y;
                             }),

                             setV: (function(oVec2){
                                 this.mX = oVec2.mX;
                                 this.mY = oVec2.mY;
                             }),

                             mulC: (function(c){
                                 this.mX *= c;
                                 this.mY *= c;
                             }),

                             vMulC: (function(c){
                                 return Vec2(
                                 this.mX * c,
                                 this.mY * c
                                          );
                             }),

                             vMulCW: (function(oVec2){
                                 return Vec2(
                                 this.mX * oVec2.mX,
                                 this.mY * oVec2.mY
                                             );
                             }),

                             vPlus: (function(oVec2){
                                 return Vec2(
                                 this.mX + oVec2.mX,
                                 this.mY + oVec2.mY
                                             );
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
