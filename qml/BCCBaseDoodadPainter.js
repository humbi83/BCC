.import "BCCVec.js" as Vec
.import "BCCGlobal.js" as Global
.import QtQuick 2.7 as QQ

function BCCBaseDoodadPainter(sQComponentPath) {

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
                                  this.qComponentInstance.x = this.mPos.mX * mScale;
                                  this.qComponentInstance.y = this.mPos.mY * mScale;
                                  this.mPosInvalid = false;
                              }
                          }),

                          mDim               : Vec.Vec2(),
                          mDimInvalid        : true,
                          paintMDim          :(function(){
                              if(this.mDimInvalid || this.mIsInvalid)
                              {
                                    this.qComponentInstance.width = this.mDim.mX * mScale;
                                    this.qComponentInstance.height= this.mDim.mY * mScale;
                                    this.mDimInvalid= false;
                              }
                           }),

                          mIsVisible         : true,
                          mIsVisibleInvalid  : true,
                          paintMVisible      : (function(){
                              if(this.mIsVisibleInvalid || this.mIsInvalid){
                                this.qComponentinstance.visible = this.mIsVisible;
                                this.mIsVisibleInvalid = false;
                              }
                          }),

                          mIsInvalid  : true,
                          setScale    :(function(fScale    ){ if(fScale     !== this.mScale    ) {this.mScale     = fScale;          this.mScaleInvalid     = true;}}),
                          setPos      :(function(vPos      ){ if(!vPos.bEquals (this.mPos      )){this.mPos       = Vec.cctor(vPos); this.mPosInvalid       = true;}}),
                          setDim      :(function(vDim      ){ if(!vDim.bEquals (this.mDim      )){this.mDim       = Vec.cctor(vDim); this.mDimInvalid       = true;}}),
                          setIsVisible:(function(bIsVisible){ if(bIsVisible !== this.mIsVisible) {this.mIsVisible = bIsVisible;      this.mIsVisibleInvalid = true;}}),

                          invalidate:(function(){this.mIsInvalid = true;}),

                          paint:(function(){
                              // paintMXXX is a missnomer .. hmm
                            this.paintMScale();
                            this.paintMPos();
                            this.paintMDim();
                            this.paintMIsVisible();
                            this.mIsInvalid = false;
                          }),

                          releaseInstance:(function(){
                            this.qComponentinstance.visible = false;
                                this.qComponentInstance.destroy(16);
                                this.qComponentInstance = null;
                          })

    });

    console.log(sQComponentPath);

    //this should be a singleton ... anyway
    ret.qComponentClass = Qt.createComponent(sQComponentPath);


    if (ret.qComponentClass.status == QQ.Component.Ready) {
        ret.qComponentInstance       = ret.qComponentClass.createObject(root);
        ret.qComponentInstance.scale = Global.LEVEL_SCALE;
    }else
    {
        console.log(component.errorString());
    }

    return ret;
}
