
function Vec2(iX,iY) {

    var pX = iX != undefined ?  iX : 0;
    var pY = iY != undefined ?  iY : 0;

    var ret = new Object({

                             mX : pX,
                             mY : pY,

                             setXY: (function(x,y){
                                 this.mX=x;
                                 this.mY=y;
                                 return this;
                             }),

                             setV: (function(oVec2){
                                 this.mX = oVec2.mX;
                                 this.mY = oVec2.mY;
                                 return this;
                             }),

                             mulC: (function(c){
                                 this.mX *= c;
                                 this.mY *= c;
                                 return this;
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

                             plus: (function(oVec2){
                                 this.mX += oVec2.mX;
                                 this.mY += oVec2.mY;
                                 return this;
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

                             vClampXY4i:(function(iLowX, iHighX, iLowY, iHighY){
                                 return Vec2(
                                             clampX2i(iLowX,iHighX),
                                             clampY2i(iLowY,iHighY)
                                             );
                             }),
                             ivClampXY2iv:(function(iv2Low, iv2High)
                             {
                                 return clampXY4i(iv2Low.mX,iv2High.mX,iv2Low.mY,iv2High.mY);
                             }),

                             floor: (function(){
                                Math.floor(this.mX);
                                Math.floor(this.mY);
                                return this;
                             }),

                             vFloor: (function(){
                                 return cctor(this).floor();
                             })

                         });
    return ret;
}


function cctor(vec) {
    return Vec2(vec.mX,vec.mY);
}
