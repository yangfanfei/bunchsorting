/*
 * @Author: jxgamestudio
 * @Description: SdkManager
 */
import { events, ui } from '../enum/Enums';
import { Global } from '../Global';

export class SdkMgr {

    static bannerOn = false;
    static customOn = false;
    static customOn1 = false;

    static initSdk(){
        window["GD_OPTIONS"] = {
            "gameId": "db32138e68cf4dbb98abd870cf93a693",
            "loader": { enabled: true },
            "onEvent": function (event) {
                switch (event.name) {
                    case "SDK_GAME_START":
                        console.log(" SDK.Game.Start.Event......... ");
                        // advertisement done, resume game logic and unmute audio
                        break;
                    case "SDK_GAME_PAUSE":
                        console.log(" SDK.Game.Pause.Event......... ");
                        // pause game logic / mute audio
                        break;
                    case "SDK_GDPR_TRACKING":
                        console.log(" SDK.Gdpr.Tracking.Event......... ");
                        // this event is triggered when your user doesn't want to be tracked
                        break;
                    case "SDK_GDPR_TARGETING":
                        console.log(" SDK.Gdpr.Targeting.Event......... ");
                        // this event is triggered when your user doesn't want personalised targeting of ads and such
                        break;
                    //case "SDK_REWARDED_WATCH_COMPLETE":
                    //    console.log(" SDK.Rewarded.Watch.Complete.Event......... ");
                    //    break;
                }
            },
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://html5.api.gamedistribution.com/main.min.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'gamedistribution-jssdk'));
    }

    static closeAd() {
        const system = cc.sys.platform;
    }

    static showBanner() {
        const system = cc.sys.platform;
    }

    static showInterstial(delay = 0) {
        const system = cc.sys.platform;

    }


    static showAD(CB){
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            console.log("CallShowAD............");
            gdsdk.showAd()
            .then(response => {
                    CB && CB();
                    console.log("Ad.Watch.Complete.Event......... ");
                })
        }
    }

    static showRewardAD(CB){
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd('rewarded')
             .then(response => {
                    CB && CB();
                    console.log("Rewarded.Watch.Complete.Event......... ");
                })
        }
    }
    
    static showRewardVideo(CB = null) {
        console.log("SdkMgr.showRewardVideo.......... ");
    }

    static shareFn(CB) {

    }
    static shareVideoFn(videoPath, CB) {

    }
    showCustomAd(callback: Function) {
       
    }
}

