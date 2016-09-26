.import "BCCGlobal.js" as Global

var E_TANK_STATUS_TELEPORTING  = 0;
var E_TANK_STATUS_MOVABLE      = 1;
var E_TANK_STATUS_BLOCKED_MOV  = 2;
var E_TANK_STATUS_BLOCKED_FIRE = 3;
var E_TANK_STATUS_DEAD         = 4;

var E_STATE_WAIT_SMOV  = 0;
var E_STATE_MOVE       = 1;
var E_STATE_CHANGE_DIR = 2;
var E_STATE_SHOOT      = 3;

var DT_180  = 5000 / 16 ;
var DT_FIRE = 1000 / 16 ;
var DT_MOV  = 200  / 16 ;

function newInstance(oTank) {

    var ret = new Object({
                            mMovTick          : 0,
                            mFireTick         : 0,
                            m180Tick          : 0,
                            mCurrentDir       : 0,
                            mCanMove          : true,
                            mTank             : oTank,
                            mTankStatus       : E_TANK_STATUS_TELEPORTING,
                            mCurrentState     : E_STATE_WAIT_SMOV,
                            onTankStatusUpdate:(function(status){
                                switch(status){
                                case E_TANK_STATUS_MOVABLE:
                                    if( this.mCurrentState == E_STATE_WAIT_SMOV){
                                            this.mCurrentState = E_STATE_MOVE;
                                    }
                                    break;
                                case E_TANK_STATUS_BLOCKED_MOV:
                                    this.mCurrentDir = (this.mCurrentDir+1) % Global.SZ_E_DIR;
                                    break;
                                    default: /*nothing*/ break;
                                }
                            }),

                            update:(function(tick){

                                if(this.mStartTick == 0){
                                    this.mStartTick = tick;
                                }

                                if(this.mMovTick == 0)
                                {
                                    this.mMovTick = tick;
                                }

                                if(this.mFireTick == 0)
                                {
                                    this.mFireTick = tick;
                                }

                                var dT = tick - this.mStartTick;
                                var dTMov  = tick - this.mMovTick ;
                                var dTFire = tick - this.mFireTick;

                                if(this.mCurrentState == E_STATE_MOVE){

                                    if(dTFire >= DT_FIRE )
                                    {
                                        this.mFireTick = tick;
                                        this.mCurrentState = E_STATE_SHOOT;
                                    }else
                                    if(dTMov >= DT_MOV){
                                        this.mMovTick = tick;
                                        this.mTank.onMoveEvent(this.mCurrentDir);
                                    }


                                }

                                if(this.mCurrentState == E_STATE_SHOOT){
                                    this.mTank.onFire();
                                    this.mCurrentState = E_STATE_MOVE;
                                }
                            })
                         });

    return ret;
}
