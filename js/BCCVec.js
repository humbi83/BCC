
function clamp(val, min, max)
{
    return val < min ? min : val > max? max : val;
}

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

                             vPlusXY: (function(iX,iY){
                                 return Vec2(
                                 this.mX + iX,
                                 this.mY + iY
                                             );
                             }),

                             plus: (function(oVec2){
                                 this.mX += oVec2.mX;
                                 this.mY += oVec2.mY;
                                 return this;
                             }),

                             iClampX2i:(function(iLow, iHigh)
                             {
                                 return clamp(this.mX, iLow, iHigh);
                             }),

                             iClampY2i: (function ( iLow, iHigh)
                             {
                                 return clamp(this.mY, iLow, iHigh);
                             }),

                             vClampXY4i:(function(iLowX, iHighX, iLowY, iHighY){
                                 return Vec2(
                                             this.iClampX2i(iLowX,iHighX),
                                             this.iClampY2i(iLowY,iHighY)
                                             );
                             }),
                             ivClampXY2iv:(function(iv2Low, iv2High)
                             {
                                 return this.vClampXY4i(iv2Low.mX,iv2High.mX,iv2Low.mY,iv2High.mY);
                             }),

                             floor: (function(){
                                this.mX = Math.floor(this.mX);
                                this.mY = Math.floor(this.mY);
                                return this;
                             }),

                             vFloor: (function(){
                                 return cctor(this).floor();
                             }),

                             bEquals: (function(oVec){
                                return this.mX === oVec.mX && this.mY == oVec.mY;
                             })

                         });
    return ret;
}


function cctor(vec) {
    return Vec2(vec.mX,vec.mY);
}
