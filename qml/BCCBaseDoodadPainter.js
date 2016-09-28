.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global
.import QtQuick 2.7 as QQ

//ALEX: do not forget all props m<Prop>, m<Prop>Invalid, paintM<Prop>, setMProp
function newInstance(sQComponentPath) {

    var ret = sQComponentPath == undefined || sQComponentPath == null ? null :
                                                                        new Object({

                          mScale             : Global.LEVEL_SCALE,
                          mScaleInvalid      : true,
                          paintMScale        : (function(){
                              if(this.mScaleInvalid || this.mIsInvalid)
                              {
                                  this.qComponentInstance.scale = this.mScale;
                                  this.mScaleInvalid = false;
                              }
                          }),

                          mPos               : Vec.Vec2(),
                          mPosInvalid        : true,
                          paintMPos          : (function(){
                              if(this.mPosInvalid || this.mIsInvalid)
                              {
                                  this.qComponentInstance.x = this.mPos.mX * this.mScale;
                                  this.qComponentInstance.y = this.mPos.mY * this.mScale;
                                  this.mPosInvalid = false;
                              }
                          }),

                          mDim               : Vec.Vec2(),
                          mDimInvalid        : true,
                          paintMDim          :(function(){
                              if(this.mDimInvalid || this.mIsInvalid)
                              {
                                    this.qComponentInstance.width = this.mDim.mX * this.mScale;
                                    this.qComponentInstance.height= this.mDim.mY * this.mScale;
                                    this.mDimInvalid= false;
                              }
                           }),

                          mIsVisible         : true,
                          mIsVisibleInvalid  : true,
                          paintMIsVisible      : (function(){
                              if(this.mIsVisibleInvalid || this.mIsInvalid){
                                this.qComponentInstance.visible = this.mIsVisible;
                                this.mIsVisibleInvalid = false;
                              }
                          }),

                          mIsInvalid  : true,
                          invalidate:(function(){this.mIsInvalid = true;}),

                          //Setters
                          setScale    :(function(fScale    ){ if(fScale     !== this.mScale    ) {this.mScale     = fScale;          this.mScaleInvalid     = true;}}),
                          setPos      :(function(vPos      ){ if(!vPos.bEquals (this.mPos      )){this.mPos       = Vec.cctor(vPos); this.mPosInvalid       = true;}}),
                          setDim      :(function(vDim      ){ if(!vDim.bEquals (this.mDim      )){this.mDim       = Vec.cctor(vDim); this.mDimInvalid       = true;}}),
                          setIsVisible:(function(bIsVisible){ if(bIsVisible !== this.mIsVisible) {this.mIsVisible = bIsVisible;      this.mIsVisibleInvalid = true;}}),

                          canPaint           : (function()
                          {
                              return Global.isOV(this.qComponentClass) &&
                                      Global.isOV(this.qComponentInstance);
                          }),

                          paint:(function(){

                              if(this.canPaint())
                              {
                                this.paintMScale();
                                this.paintMPos();
                                this.paintMDim();
                                this.paintMIsVisible();
                                this.mIsInvalid = false;
                              }

                          }),

                          releaseInstance:(function(){
                              if(Global.isOV(this.qComponentInstance))
                              {
                                //is this even going to be passed below ? , have 16 on destroy to be sure
                                this.qComponentInstance.visible = false;
                                this.qComponentInstance.destroy(16);
                                this.qComponentInstance = null;
                              }

                              if(Global.isOV(this.qComponentClass)){
                                //will this work ??
                                this.qComponentClass.destroy(32);
                                this.qComponentClass    = null;
                              }
                          })

    });

    //this should be a singleton ... anyway
    ret.qComponentClass = Qt.createComponent(sQComponentPath);

    if (ret.qComponentClass.status == QQ.Component.Ready) {
        ret.qComponentInstance       = ret.qComponentClass.createObject(root);        
    }else
    {
        console.log(component.errorString());
    }

    return ret;
}
