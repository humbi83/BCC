.import "BCCBaseDoodadPainter.js" as BasePainter
.import "BCCGlobal.js" as Global
.import "BCCVec.js" as Vec

var NV_E_AIO  = 0;
var E_AIO_ADD = 1;
var E_AIO_MOV = 2;
var E_AIO_RMV = 3;
var SZ_E_AIO  = 4;

function newInstance(vOffsetInAtlas, vDimInAtlas, oMain) {

    var pMain = oMain != undefined && oMain != null ? oMain : myBCCMain;

    var pOff = vOffsetInAtlas == undefined || vOffsetInAtlas == null ? Vec.Vec2() : vOffsetInAtlas;
    var pDim = vDimInAtlas    == undefined || vDimInAtlas    == null ? Vec.Vec2() : vDimInAtlas;

    var __ret = new Object({
                               mId                : pMain.getNextID(),
                               mMain              : pMain,
                               mScale             : Global.LEVEL_SCALE, //to add to if
                               mPos               : Vec.Vec2(),
                               mOffsetInAtlas     : pOff,
                               mDim               : pDim,
                               mIsVisible         : true,
                               mIsInvalid         : true,
                               invalidate:(function(){this.mIsInvalid = true;}),
                               //Setters
                               setScale         :(function(fScale    ){ if(fScale     !== this.mScale        ) {this.mScale         = fScale;          this.mIsInvalid = true;}}),
                               setPos           :(function(vPos      ){ if(!vPos.bEquals (this.mPos          )){this.mPos           = Vec.cctor(vPos); this.mIsInvalid = true;}}),
                               setOffsetInAtlas :(function(vOff      ){ if(!vOff.bEquals (this.mOffsetInAtlas)){this.mOffsetInAtlas = Vec.cctor(vOff); this.mIsInvalid = true;}}),
                               setDim           :(function(vDim      ){ if(!vDim.bEquals (this.mDim          )){this.mDim           = Vec.cctor(vDim); this.mIsInvalid = true;}}),
                               setIsVisible     :(function(bIsVisible){ if(bIsVisible !== this.mIsVisible    ) {this.mIsVisible     = bIsVisible;      this.mIsInvalid = true;}}),

                               paint:(function(){

                                if(this.mIsInvalid){

                                    this.remove();

                                    if(this.mIsVisible)
                                    {
                                        this.mId = this.mMain.getNextID();

                                        mapView.atlasOp(
                                                E_AIO_ADD             ,
                                                this.mId               ,
                                                this.mPos.mX          ,
                                                this.mPos.mY          ,
                                                this.mOffsetInAtlas.mX,
                                                this.mOffsetInAtlas.mY,
                                                this.mDim.mX          ,
                                                this.mDim.mY
                                                );
                                    }

                                    this.mIsInvalid = false;
                                }
                               }),

                               releaseInstance : (function(){
                                this.remove();
                               }),

                               remove  : (function(){
                                   mapView.atlasOp(
                                           E_AIO_RMV,
                                           this.mId ,
                                           0,
                                           0,
                                           0,
                                           0,
                                           0,
                                           0);
                               }),
                           });
    return __ret;
}
