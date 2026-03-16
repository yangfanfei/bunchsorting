import Main from "../../Main";
import GameView from "../../view/GameView";


export class WxPlatform {

    static _ins: WxPlatform;
    public wx = window["wx"];

    private customID:string = "adunit-4d1247e0f9b361f0";  // 主界面横幅
    private luckyDrawCustomID:string = "adunit-b35140556ac102fa";  // 转盘横幅
    private signCustomID:string = "adunit-7bc7ba4cff5807ca";  // 签到横幅

    private rewardID:string = "adunit-a5ae18943f3b7b5d";  // 激励广告
    private luckyDrawRewardID:string = "adunit-859b5be43c8fc3b9"; // 转盘激励广告
    private signRewardID:string = "adunit-6aedcf39a93f2da7"; // 签到激励广告
    
    private backRewardID:string = "adunit-ed1933c9f2563992"; // 关卡后退激励
    private addBunchRewardID:string = "adunit-1c09c1bae24c04d0"; // 关卡加串激励
    private finishRewardID:string = "adunit-5d114428fe0f29bf"; // 关卡结束激励

    private intersitialID:string = "adunit-75fb911d443c0bfd"; // 插屏广告

    static get ins() {
        if (this._ins) {
            return this._ins;
        }

        this._ins = new WxPlatform();
        this._ins.init();
        return this._ins;
    }

    init() {
        this.wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // 绑定分享参数
        //const shares = Main.ins.Shares[0].sharePics;
        /*if (shares.length > 0) {
            this.wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                //let url = Math.floor(Math.random() * shares.length);
                return {
                    title: "",
                    imageUrlId: "", // 图片 id
                    imageUrl: "" // 图片 URL
                }
            })

            this.wx.onShareTimeline(() => {
                //let url = Math.floor(Math.random() * shares.length);
                return {
                    title: "",
                    imageUrl: "", // 图片 URL
                    query: ''
                }
            })
        }*/

        //console.log(" 微信平台初始化成功。");
    }

    getLaunchOption() {
        const query = this.wx.getLaunchOptionsSync().query;

        return query;
    }

    getScene() {
        let scene = this.wx.getLaunchOptionsSync().scene;
        return scene
    }

    showShare(queryString: string = '') {
        console.log("  showShare.Calll shareAppMessage ........ ");
        this.wx.shareAppMessage({
            title: "一起来穿个串儿，解压休闲美食之旅",
            imageUrlId: "l1xW3fyMT4md4Wc3+P6V4Q==", // 图片 id
            imageUrl: "https://mmocgame.qpic.cn/wechatgame/VuIPU9TOnMay8Ghe2dpLiazWHIDUCohq3kHsBpDGiaQOdbz7P7icM0fa1gQCVvnkIut/0", // 图片 URL
            query: queryString

        })
    }

    //创建原生模板广告组件-横幅广告-主界面
    custom: any;
    timeId!: number
    showCustomAd(callback) {
        if (this.timeId) {
            clearTimeout(this.timeId);
            this.timeId = null
        }

        let id = this.customID;
        if (!CC_WECHATGAME || !id) {
            return;
        }

        let winSize = this.wx.getSystemInfoSync();
        //console.log('========== 环境信息 ==========');
        //console.log('微信基础库版本:', winSize.SDKVersion);
        //console.log('微信版本:', winSize.version);
        //console.log('操作系统:', winSize.platform, winSize.system);
        let style = {}
        style = {
            left: 30,
            top: winSize.screenHeight - 120,
            width: winSize.screenWidth - 60
        }

        //console.log(" ShowCustomAD.........  WinSize: ",winSize," Style::: ",style," ID:: ",id)
        if (this.custom) {
            this.custom.show();
            return;
        }

        let CustomAd = this.wx.createCustomAd({
            adUnitId: id, 
            style: style
        });

        // 在适合的场景显示 原生模板 广告
        CustomAd.show()
        CustomAd.onLoad(() => {
            console.log('原生模板 广告加载成功');
            this.custom = CustomAd;
            callback(1);
            //CustomAd.show().then(() => console.log('原生模板 广告显示成功')).catch((err) => {
            //    console.log("原生模板 广告显示失败", err)
            //    callback(0);
            //})
        })

        CustomAd.onClose(res => {
            this.custom = null
            //this.timeId = setTimeout(() => this.showCustomAd(callback), 5 * 1000)
            console.log('关闭原生模板广告', res);
        })

        CustomAd.onError(err => {
            this.custom = null
            this.timeId = setTimeout(() => this.showCustomAd(callback), 5 * 1000)
            console.log('原生模板CustomAd 广告加载失败：', err);
        })
    }

    // 隐藏原生模板广告组件
    hideCustomAd() {
        if (this.custom) {
            this.custom.hide();
        }
    }

    //创建原生模板广告组件-横幅广告-转盘
    customLucky: any;
    timeId2!: number
    showLuckyDrawCustomAd() {
        if (this.timeId) {
            clearTimeout(this.timeId);
            this.timeId = null
        }

        let id = this.luckyDrawCustomID;
        if (!CC_WECHATGAME || !id) {
            return;
        }

        let winSize = this.wx.getSystemInfoSync();
        let style = {}
        style = {
            left: 30,
            top: winSize.screenHeight - 120,
            width: winSize.screenWidth - 60
        }

       // console.log(" ShowLuckyDrawCustomAd.........  WinSize: ",winSize," Style::: ",style," ID:: ",id)
        if (this.customLucky) {
            this.customLucky.show();
            return;
        }

        let CustomAd = this.wx.createCustomAd({
            adUnitId: id, 
            style: style
        });

        // 在适合的场景显示 原生模板 广告
        CustomAd.show()
        this.customLucky = CustomAd;

        CustomAd.onClose(res => {
            this.customLucky = null
            //this.timeId2 = setTimeout(() => this.showLuckyDrawCustomAd(), 5 * 1000)
            console.log('关闭转盘原生模板广告', res);
        })

        CustomAd.onError(err => {
            this.customLucky = null
            this.timeId2 = setTimeout(() => this.showLuckyDrawCustomAd(), 5 * 1000)
            console.log('转盘原生模板CustomAd 广告加载失败：', err);
        })
    }

    // 隐藏原生模板广告组件
    hideLuckyDrawCustomAd() {
        if (this.customLucky) {
            this.customLucky.hide();
        }
    }

    //创建原生模板广告组件-横幅广告-签到
    customSign: any;
    timeId3!: number
    showSignCustomAd() {
        if (this.timeId) {
            clearTimeout(this.timeId);
            this.timeId = null
        }

        let id = this.signCustomID;
        if (!CC_WECHATGAME || !id) {
            return;
        }

        let winSize = this.wx.getSystemInfoSync();
        let style = {}
        style = {
            left: 30,
            top: winSize.screenHeight - 120,
            width: winSize.screenWidth - 60
        }

        //console.log(" ShowSignCustomAd.........  WinSize: ",winSize," Style::: ",style," ID:: ",id)
        if (this.customSign) {
            this.customSign.show();
            return;
        }

        let CustomAd = this.wx.createCustomAd({
            adUnitId: id, 
            style: style
        });

        // 在适合的场景显示 原生模板 广告
        CustomAd.show()
        this.customSign = CustomAd;

        CustomAd.onClose(res => {
            this.customSign = null
            //this.timeId3 = setTimeout(() => this.showSignCustomAd(), 5 * 1000)
            console.log('关闭签到原生模板广告', res);
        })

        CustomAd.onError(err => {
            this.customSign = null
            this.timeId3 = setTimeout(() => this.showSignCustomAd(), 5 * 1000)
            console.log('签到原生模板CustomAd 广告加载失败：', err);
        })
    }

    // 隐藏原生模板广告组件
    hideSignCustomAd() {
        if (this.customSign) {
            this.customSign.hide();
        }
    }

    showInterstitialAd(delay = 0) {
        let id = this.intersitialID;//Main.ins.Platforms[0].intersitialId[0];
        if (!CC_WECHATGAME || !id) {
            return;
        }

        let interstitialAd = this.wx.createInterstitialAd({
            adUnitId: id,
        });

        console.log(" Show InterstitialAD >>>>>>>>>>>>");

        if (interstitialAd) {
            interstitialAd.load().then(() => {
                console.log('插屏 广告加载成功');
            });
            interstitialAd.onClose(res => {
                console.log('关闭插屏广告', res);
            });
            interstitialAd.onError(err => {
                console.log('err:插屏广告加载失败', err);
            });

            setTimeout(() => {
                interstitialAd.show().catch((err) => {
                    console.log('插屏广告展示失败', err);
                });
            }, delay * 1000);
        }

    }

    rewardVideo: any;
    showRewardVideo(callback?: Function) {
        //console.log(" WXPlatform.Show Reward $$$$$$$$$$: Platform.Data::::: ",Main.ins.Platforms);
        let my = this;
        let id = this.rewardID;
        if (my.rewardVideo != null) {
            my.rewardVideo.offClose(fun);
        }

        let rewardedVideoAd = this.wx.createRewardedVideoAd({
            adUnitId: id,
        });

        my.rewardVideo = rewardedVideoAd;
        rewardedVideoAd.load().then(() => {
            this.wx.showToast({
                title: "加载中，请稍后",
                icon: 'success',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }
            })

            console.log('showRewardVideo 激励视频 广告加载成功');
            rewardedVideoAd.show();
        });

        let showToastState = false
        rewardedVideoAd.onError(err => {
            console.log('showRewardVideo 激励视频 广告显示失败', err);
            if (!showToastState) {
                showToastState = true
            } else {
                return
            }
            this.wx.showToast({
                title: "请稍后再试",
                icon: 'fail',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }

            })
            callback(2);
        })

        var fun = function (res) {
            if (res && res.isEnded) {
                console.log('res:  ', res);
                callback(1);
                rewardedVideoAd.offClose(fun);
            } else {
                console.log('播放中途退出');
                callback(0);
            }
        }
        
        rewardedVideoAd.onClose(fun);
    }

    rewardSignVideo: any;
    showSignRewardVideo(callback?: Function) {
        //console.log(" WXPlatform.Show Sign Reward $$$$$$$$$$: Platform.Data::::: ",Main.ins.Platforms);
        let my = this;
        let id = this.signRewardID;
        if (my.rewardSignVideo != null) {
            my.rewardSignVideo.offClose(fun);
        }

        let rewardedVideoAd = this.wx.createRewardedVideoAd({
            adUnitId: id,
        });

        my.rewardSignVideo = rewardedVideoAd;
        rewardedVideoAd.load().then(() => {
            this.wx.showToast({
                title: "加载中，请稍后",
                icon: 'success',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }
            })

            console.log('showSignRewardVideo 激励视频 广告加载成功 ID:::: ',id);
            rewardedVideoAd.show();
        });

        let showToastState = false
        rewardedVideoAd.onError(err => {
            console.log('激励视频 广告显示失败', err);
            if (!showToastState) {
                showToastState = true
            } else {
                return
            }
            this.wx.showToast({
                title: "请稍后再试",
                icon: 'fail',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }

            })
            callback(2);
        })

        var fun = function (res) {
            if (res && res.isEnded) {
                console.log('res:  ', res);
                callback(1);
                rewardedVideoAd.offClose(fun);
            } else {
                console.log('播放中途退出');
                callback(0);
            }
        }
        
        rewardedVideoAd.onClose(fun);
    }

    rewardLuckyDrawVideo: any;
    showLuckyDrawRewardVideo(callback?: Function) {
        //console.log(" WXPlatform.Show LuckyDraw Reward $$$$$$$$$$: Platform.Data::::: ",Main.ins.Platforms);
        let my = this;
        let id = this.luckyDrawRewardID;
        if (my.rewardLuckyDrawVideo != null) {
            my.rewardLuckyDrawVideo.offClose(fun);
        }

        let rewardedVideoAd = this.wx.createRewardedVideoAd({
            adUnitId: id,
        });

        my.rewardLuckyDrawVideo = rewardedVideoAd;
        rewardedVideoAd.load().then(() => {
            this.wx.showToast({
                title: "加载中，请稍后",
                icon: 'success',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }
            })

            console.log('rewardLuckyDrawVideo  激励视频 广告加载成功::::: ',id);
            rewardedVideoAd.show();
        });

        let showToastState = false
        rewardedVideoAd.onError(err => {
            console.log('激励视频 广告显示失败', err);
            if (!showToastState) {
                showToastState = true
            } else {
                return
            }
            this.wx.showToast({
                title: "请稍后再试",
                icon: 'fail',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }

            })
            callback(2);
        })

        var fun = function (res) {
            if (res && res.isEnded) {
                console.log('res:  ', res);
                callback(1);
                rewardedVideoAd.offClose(fun);
            } else {
                console.log('播放中途退出');
                callback(0);
            }
        }
        
        rewardedVideoAd.onClose(fun);
    }

    rewardBackVideo: any;
    showBackRewardVideo(callback?: Function) {
        let my = this;
        let id = this.backRewardID;
        if (my.rewardBackVideo != null) {
            my.rewardBackVideo.offClose(fun);
        }

        let rewardedVideoAd = this.wx.createRewardedVideoAd({
            adUnitId: id,
        });

        my.rewardBackVideo = rewardedVideoAd;
        rewardedVideoAd.load().then(() => {
            this.wx.showToast({
                title: "加载中，请稍后",
                icon: 'success',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }
            })

            console.log('激励视频 广告加载成功');
            rewardedVideoAd.show();
        });

        let showToastState = false
        rewardedVideoAd.onError(err => {
            console.log('激励视频 广告显示失败', err);
            if (!showToastState) {
                showToastState = true
            } else {
                return
            }
            this.wx.showToast({
                title: "请稍后再试",
                icon: 'fail',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }

            })
            callback(2);
        })

        var fun = function (res) {
            if (res && res.isEnded) {
                console.log('res:  ', res);
                callback(1);
                rewardedVideoAd.offClose(fun);
            } else {
                console.log('播放中途退出');
                callback(0);
            }
        }
        
        rewardedVideoAd.onClose(fun);
    }

    rewardBunchVideo: any;
    showBunchRewardVideo(callback?: Function) {
        let my = this;
        let id = this.addBunchRewardID;
        if (my.rewardBunchVideo != null) {
            my.rewardBunchVideo.offClose(fun);
        }

        let rewardedVideoAd = this.wx.createRewardedVideoAd({
            adUnitId: id,
        });

        my.rewardBunchVideo = rewardedVideoAd;
        rewardedVideoAd.load().then(() => {
            this.wx.showToast({
                title: "加载中，请稍后",
                icon: 'success',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }
            })

            console.log('激励视频 广告加载成功');
            rewardedVideoAd.show();
        });

        let showToastState = false
        rewardedVideoAd.onError(err => {
            console.log('激励视频 广告显示失败', err);
            if (!showToastState) {
                showToastState = true
            } else {
                return
            }
            this.wx.showToast({
                title: "请稍后再试",
                icon: 'fail',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }

            })
            callback(2);
        })

        var fun = function (res) {
            if (res && res.isEnded) {
                console.log('res:  ', res);
                callback(1);
                rewardedVideoAd.offClose(fun);
            } else {
                console.log('播放中途退出');
                callback(0);
            }
        }
        
        rewardedVideoAd.onClose(fun);
    }

    rewardFinishVideo: any;
    showFinishRewardVideo(callback?: Function) {
        let my = this;
        let id = this.finishRewardID;
        if (my.rewardFinishVideo != null) {
            my.rewardFinishVideo.offClose(fun);
        }

        let rewardedVideoAd = this.wx.createRewardedVideoAd({
            adUnitId: id,
        });

        my.rewardFinishVideo = rewardedVideoAd;
        rewardedVideoAd.load().then(() => {
            this.wx.showToast({
                title: "加载中，请稍后",
                icon: 'success',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }
            })

            console.log('激励视频 广告加载成功');
            rewardedVideoAd.show();
        });

        let showToastState = false
        rewardedVideoAd.onError(err => {
            console.log('激励视频 广告显示失败', err);
            if (!showToastState) {
                showToastState = true
            } else {
                return
            }
            this.wx.showToast({
                title: "请稍后再试",
                icon: 'fail',//图标，支持"success"、"loading" 
                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () { },
                fail: function () { },
                complete: function () { }

            })
            callback(2);
        })

        var fun = function (res) {
            if (res && res.isEnded) {
                console.log('res:  ', res);
                callback(1);
                rewardedVideoAd.offClose(fun);
            } else {
                console.log('播放中途退出');
                callback(0);
            }
        }
        
        rewardedVideoAd.onClose(fun);
    }

}



