/*
 * @Author: jxgamestudio
 * @Description: Andriod ad
 */
import Main from "../Main";

// jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAd","(Ljava/lang/String;)V","你的广告位id");
export class AndroidAD {
    static _ins: AndroidAD;

    static get ins(): AndroidAD {
        if (!this._ins) {
            this._ins = new AndroidAD();
        }
        return this._ins;
    }



    showRewardVideo() {
        //let id = Main.ins.Platforms[2].videoId[0];
        //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "jiaZaiJiLiShiPin", "(Ljava/lang/String;)V", id);
    }

    showInterstitial() {
        //let id = Main.ins.Platforms[2].intersitialId[0];
        //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "jiaZaiChaPing", "(Ljava/lang/String;)V", id, 300, 450);
    }

    showBanner() {
        //let id = Main.ins.Platforms[3].bannerId[0];
        //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "jiaZaiBanner", "(Ljava/lang/String;)V", id, 600, 50);
    }
}