
function newInstance() {

    var __ret=Object({

                        mStartTick: 0,

                        clearScreen:(function(){
                            //black
                            //99,99,99
                        }),
                        paint :(function(){

                        }),

                        update:(function(tick){

                            //hmm .. globals .. not ok..
                            if(this.mStartTick == 0){
                                this.mStartTick = tick;
                            }
                        })
                     });

    return __ret;

}
