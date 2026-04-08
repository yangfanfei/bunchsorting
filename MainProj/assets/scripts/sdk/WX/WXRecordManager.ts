/**
 * @Author: Joey
 * @Date: 2026-03-17 09:34:43
 * @LastEditors: Joey
 * @LastEditTime: 2026-03-17 09:34:43
 * @Description: 微信游戏存储相关内容
 */

import { events, Key } from "../../enum/Enums";
import { Global } from "../../Global";
import { save } from "../../utils/Tools";
import { SdkMgr } from "../SdkMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class WXRecordManager  {

    private static _instance: WXRecordManager;

    static get ins() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new WXRecordManager();
        return this._instance;
    }

    public init(){
        if(cc.sys.platform == cc.sys.WECHAT_GAME)
        {
            console.log(" Platform in wechat....... ");
            if (typeof wx !== 'undefined' && wx.cloud) {
                wx.cloud.init({
                    env: 'cloud1-6gmxh81sb3f93d53', // 替换为你的云环境ID，可以在云开发控制台获取
                    traceUser: true      // 是否追踪用户
                });
                console.log('云开发初始化成功');
                this.loginAndGetData();
            } else {
                console.error('当前环境不支持云开发');
            }
        }
    }

    // 加载游戏数据
    async loadGameData() {
        try {
            const db = wx.cloud.database();
            const result = await db.collection('UserInfo').get();
            console.log('游戏数据加载成功', result.data);
        } catch (error) {
            console.error('游戏数据加载失败', error);
        }
    }


    loginAndGetData() {
        console.log("  WX.Call loginAndGetData:::::::::::::::  ");
        if(cc.sys.platform != cc.sys.WECHAT_GAME) return;

        //console.log(" 加载存档中！！！！！！！！！！！！！ ");
        try {
                wx.cloud.callFunction({
                    name: 'login',
                    success: res => {
                        console.log('加载成功:', res.result);
                        if (res.result.code === 0) {
                            console.log('玩家数据加载成功:',  res.result.data)
                            if (res.result.isNew) {
                                console.log('欢迎新玩家！ 新接入玩家，从本地缓存数据更新到服务器。')
                                this.updateUserDataFromLocal();
                            }
                            else
                            {
                                console.log('欢迎老玩家！ 以云端数据为准。')
                                Global.lv = res.result.data.level;
                                Global.currentCoin = res.result.data.coins;

                                let resetVal = res.result.data.reset ? res.result.data.reset : 0;
                                let finishVal = res.result.data.finish ? res.result.data.finish : 0;
                                let backVal = res.result.data.back ? res.result.data.back : 0;
                                let bunchVal = res.result.data.bunch ? res.result.data.bunch : 0;
                                let luckyKeyVal = res.result.data.luckyKey ? res.result.data.luckyKey : 0;
                                console.log(" Tool.Data:::: reset: ",resetVal," finish: ",finishVal," back: ",backVal,
                                    " bunch: ",bunchVal," luckyKey: ",luckyKeyVal
                                );
                                cc.director.emit(events.CoinChange);
                                cc.director.emit(events.LevelSelectChange);
                                save(Key.Lv, Global.lv);
                                save(Key.CoinCount, Global.currentCoin);
                            }
                        }
                    },
                    fail: err => {
                        console.error('失败:', err);
                    },
                    complete: () => {
                        console.log('调用完成');
                    }
                });

            } catch (err) {
                console.error('获取玩家数据失败:', err)
                // 降级方案：尝试使用本地缓存
                /*const localData = wx.getStorageSync('playerData')
                if (localData) {
                    this.globalData.playerData = localData
                    wx.showToast({ title: '使用本地存档', icon: 'none' })
                }*/
        }
        
        //wx.hideLoading()
    }

    async updateUserDataFromLocal()
    {
        if(cc.sys.platform != cc.sys.WECHAT_GAME) return;
        const Gl = Global;
        // 调用云函数更新云端
        try {
            await wx.cloud.callFunction({
                name: 'updateUserData',
                data: {
                    gameData: {
                        coins: Gl.currentCoin,
                        level: Gl.lv,
                        reset: Global._toolSetting.reset,
                        back: Global._toolSetting.back,
                        finish: Global._toolSetting.finish,
                        bunch: Global._toolSetting.bunch,
                        luckyKey: Global._toolSetting.luckyKey
                    }
                }
            })
            
            // 备份到本地
            //wx.setStorageSync('playerData', getApp().globalData.playerData)
            //wx.showToast({ title: '存档成功' })
            console.log("  updateUserDataFromLocal  更新数据成功！ ")
        } catch (err) {
            console.error('存档失败', err)
            //wx.showToast({ title: '存档失败，已保存至本地', icon: 'none' })
        }
    }

    async updateUserLevel(newLevel:number)
    {
        if(cc.sys.platform != cc.sys.WECHAT_GAME) return;

        const Gl = Global;
        // 调用云函数更新云端
        try {
            await wx.cloud.callFunction({
                name: 'updateUserData',
                data: {
                    gameData: {
                        level: newLevel,
                    }
                }
            })
            
            // 备份到本地
            // wx.setStorageSync('playerData', getApp().globalData.playerData)
            // wx.showToast({ title: '存档成功' })
            console.log("  updateUserLevel  更新等级数据成功！ ： ",newLevel)
        } catch (err) {
            console.error('存档失败', err)
            //wx.showToast({ title: '存档失败，已保存至本地', icon: 'none' })
        }
    }

    async updateUserCoin(newCoin:number)
    {
        if(cc.sys.platform != cc.sys.WECHAT_GAME) return;

        // 调用云函数更新云端
        try {
            await wx.cloud.callFunction({
                name: 'updateUserData',
                data: {
                    gameData: {
                        coins: newCoin,
                    }
                }
            })
            
            // 备份到本地
            // wx.setStorageSync('playerData', getApp().globalData.playerData)
            //wx.showToast({ title: '存档成功' })
            console.log("  updateUserCoin  更新金币数据成功！ ： ",newCoin)
        } catch (err) {
            console.error('存档失败', err)
            //wx.showToast({ title: '存档失败，已保存至本地', icon: 'none' })
        }
    }

    async updateUserToolInfo()
    {
        if(cc.sys.platform != cc.sys.WECHAT_GAME) return;

        console.log("  updateUserToolInfo:::::: ",Global._toolSetting);
        // 调用云函数更新云端
        try {
            await wx.cloud.callFunction({
                name: 'updateUserData',
                data: {
                    gameData: {
                        reset: Global._toolSetting.reset,
                        back: Global._toolSetting.back,
                        finish: Global._toolSetting.finish,
                        bunch: Global._toolSetting.bunch,
                        luckyKey: Global._toolSetting.luckyKey
                    }
                }
            })
            
            // 备份到本地
            // wx.setStorageSync('playerData', getApp().globalData.playerData)
            //wx.showToast({ title: '存档成功' })
            console.log("  updateUserToolInfo  更新道具数据成功！ &&&&&&&&  ")
        } catch (err) {
            console.error('存档失败', err)
            //wx.showToast({ title: '存档失败，已保存至本地', icon: 'none' })
        }
    }
    
}
