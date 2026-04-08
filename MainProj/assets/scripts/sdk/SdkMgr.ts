/*
 * @Author: jxgamestudio
 * @Description: SdkManager
 */
import { events, ui } from '../enum/Enums';
import { Global } from '../Global';
import { WxPlatform } from './WX/WxPlatform';

export class SdkMgr {

    static bannerOn = false;
    static customOn = false;
    static customOn1 = false;

    static initSdk(){
    
    }

    static closeAd() {
        const system = cc.sys.platform;
    }


    static login()
    {
        // 微信登录，获取code[citation:4]
        wx.login({
            success: (res) => {
                if (res.code) {
                    console.log('登录成功，code:', res.code);
                    //this.code = res.code;
                }
            }
        });
    }

    static shareFn(CB) {
        if (!window["wx"] && !window["tt"]) {
            CB()
            return
        }

        if (window["wx"]) {
            setTimeout(() => {
               WxPlatform.ins.showShare();
                setTimeout(() => {
                    CB && CB();
                }, 2000);
            }, 500);
        }
    }

    static showInterstial(delay = 0) {
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showInterstitialAd(0.5);
                break;
        }
    }

    static showRewardAD(CB){
        const system = cc.sys.platform;
        console.log("Show Reward  AD::::::::::::::: CurrentSystem: ",system);
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showRewardVideo(CB);
                break;
        }
    }

    static showSignRewardAD(CB){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showSignRewardVideo(CB);
                break;
        }
    }

    static showLuckyDrawRewardAD(CB){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showLuckyDrawRewardVideo(CB);
                break;
        }
    }

    static showBackRewardAD(CB){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showBackRewardVideo(CB);
                break;
        }
    }

    static showBunchRewardAD(CB){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showBunchRewardVideo(CB);
                break;
        }
    }

    static showFinishRewardAD(CB){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showFinishRewardVideo(CB);
                break;
        }
    }

    static showLifeRewardAD(CB){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showLifeRewardVideo(CB);
                break;
        }
    }
    
    static showDressupRewardVideo(CB){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showDressupRewardVideo(CB);
                break;
        }
    }

    static showRewardVideo(CB = null) {
        console.log("SdkMgr.showRewardVideo.......... ");
    }
    
    static showCustomAd(CB) {
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showCustomAd(CB);
                break;
        }
    }

    static hideCustomAd(){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.hideCustomAd();
                break;
        }
    }

    static showLuckyDrawCustomAd(){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showLuckyDrawCustomAd();
                break;
        }
    }

    static hideLuckyDrawCustomAd(){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.hideLuckyDrawCustomAd();
                break;
        }
    }

    static showSignCustomAd(){
        const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.showSignCustomAd();
                break;
        }
    }

    static hideSignCustomAd(){
               const system = cc.sys.platform;
        switch(system)
        {
            case cc.sys.WECHAT_GAME:
                WxPlatform.ins.hideSignCustomAd();
                break;
        } 
    }
}

