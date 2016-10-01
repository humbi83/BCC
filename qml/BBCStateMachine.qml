import QtQuick 2.0
import QtQml.StateMachine 1.0 as SM

SM.StateMachine{
    id:bccSM
    initialState: sMainMenu_Startup
    property var mIsFirstTime : true
    property var mGameState : 0
    running: false

    SM.State{
        id : sMainMenu_Startup
        initialState: scMainMenu_mIsFirstTime
        onEntered:{
            console.log("sMainMenu_Startup entered")
            rMainMenu.visible         = true;
            levelStartAnimRes.visible = false;
            mapView.visible           = false;
            rGameOver.visible         = false;
        }

        onExited :{
            console.log("sMainMenu_Startup exited")
            rMainMenu.visible         = false;
            levelStartAnimRes.visible = true;
            mapView.visible           = false;
            rGameOver.visible         = false;
        }
        //missing guard && missing conditional transitions .. wxx

        SM.State{
            id : scMainMenu_mIsFirstTime;

            SM.TimeoutTransition{
                id: tTout_scMainMenu_mIsFirstTime
                timeout: 1
            }

            SM.SignalTransition{
                id: tSig_scMainMenu_mIsFirstTime
                targetState: bccSM.mIsFirstTime && !(bccSM.mIsFirstTime=false) ? sMainMenu_FirstTime : sMainMenu_List
                signal: tTout_scMainMenu_mIsFirstTime.onTriggered // will this work ???
            }
        }


        SM.State {
            id : sMainMenu_FirstTime
            onEntered:{
                console.log("sMainMenu_FirstTime : entered")
                rMainMenu_ShowAnim.start();
            }

            onExited:{
                rMainMenu_ShowAnim.complete();
                console.log("sMainMenu_FirstTime : exited")
            }

            SM.SignalTransition {
                targetState: sMainMenu_List
                signal: rMainMenu_ShowAnim.onStopped
            }

            SM.SignalTransition {
                targetState: sMainMenu_List
                signal: keyHandler.Keys.onPressed
            }

        }

        SM.State {
            property var mSelectedEntry : 0
            id : sMainMenu_List
            onEntered:{
                console.log("sMainMenu_List : entered")
                rMainMenu.y = rMainMenu.zY
                rMainMenu_List_Cursor.visible = true;
                rMainMenu_List_Cursor.setPos(mSelectedEntry);
            }

            onExited:{
                console.log("sMainMenu_List : exited")
                mSelectedEntry = 0;
                rMainMenu_List_Cursor.visible = false;
                rMainMenu_List_Cursor.setPos(mSelectedEntry);
            }

            SM.SignalTransition{
                signal: keyHandler.Keys.onUpPressed
                guard: sMainMenu_List.onUpPressed()
            }

            SM.SignalTransition{
                signal: keyHandler.Keys.onDownPressed
                guard: sMainMenu_List.onDownPressed()
            }

            SM.SignalTransition{
                targetState: sStartLevel
                signal: keyHandler.Keys.onReturnPressed
                guard: sMainMenu_List.onEnterPressed()
            }

            SM.SignalTransition{
                targetState: sStartLevel
                signal: keyHandler.Keys.onEnterPressed
                guard: sMainMenu_List.onEnterPressed()
            }


            function onUpPressed(){
                console.log("Up");
                mSelectedEntry = mSelectedEntry > 0 ? mSelectedEntry - 1 : mSelectedEntry;
                rMainMenu_List_Cursor.setPos(mSelectedEntry);
                return false;
            }

            function onDownPressed(){
                console.log("Down");
                mSelectedEntry = mSelectedEntry < 2 ? mSelectedEntry + 1 : mSelectedEntry;
                rMainMenu_List_Cursor.setPos(mSelectedEntry);
                return false;
            }

            function onEnterPressed(){
                console.log("Enter");
                //TODO: set this value to the game itself or something
                return mSelectedEntry == 0;
            }
        }
    }

    SM.State{
        id : sStartLevel
        initialState: sStartLevel_sCloseAnim

        onEntered: {
            console.log("sStartLevel : entered")
            rMainMenu.visible         = false;
            levelStartAnimRes.visible = true;
            mapView.visible           = false;
            rGameOver.visible         = false;
        }

        SM.State
        {
            id: sStartLevel_sCloseAnim
            onEntered:{
                anim1.start();
            }
            onExited:{
                rStartLevel_Stage1.visible = true;
            }

            SM.SignalTransition {
                targetState: sStartLevel_InitGame
                signal: anim1.onStopped
            }
        }



        SM.State
        {
            id: sStartLevel_InitGame
            SM.TimeoutTransition
            {
                targetState: sStartLevel_sWaitKeyPressedEnter
                timeout: 64
            }

            onExited: {
                myBCCMain.notify(myBCCMain.E_EVENT_INIT,null);
            }
        }

        SM.State
        {
            id:sStartLevel_sWaitKeyPressedEnter

            SM.SignalTransition{
                targetState: sStartLevel_sOpenAnim;
                signal: keyHandler.Keys.onEnterPressed
            }

            SM.TimeoutTransition
            {
                targetState: sStartLevel_sOpenAnim
                timeout: 3000
            }

            onExited: {rStartLevel_Stage1.visible = false;}
        }

        SM.State
        {
            id: sStartLevel_sOpenAnim
            onEntered: {
                mapView.visible = true;
                anim2.start();
            }

            onExited: {
                rMainMenu.visible         = false;
                levelStartAnimRes.visible = false;
                mapView.visible           = true ;
                rGameOver.visible         = false;
            }

            SM.SignalTransition {
                targetState: sMainGame
                signal: anim2.onStopped
            }
        }
    }

    SM.State
    {
        id:sMainGame
        initialState: sMainGame_Loop1

        onEntered:{
            rMainMenu.visible         = false;
            levelStartAnimRes.visible = false;
            myBCCMain.visible         = true;
            rGameOver.visible         = false;

            _BCCMainTimer.start();
        }

        onExited: {
            _BCCMainTimer.stop();
            rMainMenu.visible         = false;
            levelStartAnimRes.visible = false;
            myBCCMain.visible         = false;
            rGameOver.visible         = true ;
        }

        SM.State{
            id:sMainGame_Loop1
            onEntered: {console.log("Loop1 B", bccSM.mGameState);}
            onExited:  {console.log("Loop1 E", bccSM.mGameState);}

            SM.TimeoutTransition{
                id:tTout_sMainGame_Loop1
                timeout: 1000
            }

            SM.SignalTransition{
                targetState: bccSM.mGameState < 2? sMainGame_Loop2 : sGameOver
                signal: tTout_sMainGame_Loop1.onTriggered
            }
        }


        SM.State{
            id:sMainGame_Loop2

            onEntered: {console.log("Loop2 B", bccSM.mGameState);}
            onExited:  {console.log("Loop2 E", bccSM.mGameState);}

            SM.TimeoutTransition{
                id:tTout_sMainGame_Loop2
                timeout: 1000
            }

            SM.SignalTransition{
                targetState: bccSM.mGameState < 2? sMainGame_Loop1 : sGameOver
                signal: tTout_sMainGame_Loop2.onTriggered
            }
        }

    }

    SM.State
    {
        id:sGameOver
        onEntered: {
            rMainMenu.visible         = false;
            levelStartAnimRes.visible = false;
            myBCCMain.visible         = false;
            rGameOver.visible         = true ;
        }

        SM.TimeoutTransition{
            targetState: sExit
            timeout: 60000
        }

        SM.SignalTransition{
            targetState: sExit
            signal: keyHandler.Keys.onPressed
        }

    }

    SM.State
    {
        id:sExit
        onEntered: {
            rootWindow.close();
        }
    }

}

