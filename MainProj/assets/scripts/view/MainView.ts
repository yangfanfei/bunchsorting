/*
 * @Author: jxgamestudio
 * @Description: main view
 */
import BaseView from "./BaseView";
import GameView from "./GameView";
import ResMgr from "../manager/ResMgr";
import { Global } from "../Global";
import { Clips, events, ui } from "../enum/Enums";
import { SdkMgr } from "../sdk/SdkMgr";
import GameMgr from "../manager/GameMgr";
import { SoundMgr } from "../manager/SoundMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainView extends BaseView {

    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.SpriteFrame)
    coinSpr:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    coinSmallSpr:cc.SpriteFrame = null;
  
    @property(cc.SpriteFrame)
    resetSpr:cc.SpriteFrame = null;
  
    @property(cc.SpriteFrame)
    backSpr:cc.SpriteFrame = null;
  
    @property(cc.SpriteFrame)
    bunchSpr:cc.SpriteFrame = null;
  
    @property(cc.SpriteFrame)
    finishSpr:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    luckyKeySpr:cc.SpriteFrame = null;

    public static ins: MainView = null;

    onEnable() {
      cc.director.on(events.LevelSelectChange, this.eventLevelChange, this);
      cc.director.on(events.CoinChange, this.setCoinLabel, this);
      cc.director.on(events.BackToMain, this.eventBackToMain, this);
    }
    onDisable() {
      cc.director.off(events.LevelSelectChange, this.eventLevelChange, this);
      cc.director.off(events.CoinChange, this.setCoinLabel, this);
      cc.director.off(events.BackToMain, this.eventBackToMain, this);
    }

    onLoad(): void {
      this.setLvLabel();
      this.setCoinLabel();
      SoundMgr.ins.playBackMusic(Clips.back_inMain);
      SdkMgr.showCustomAd((retValue) => {
          //console.log(" showCustomAd.... retValue: ",retValue);
          if(retValue == 1)
          {
            if(GameMgr.ins && GameMgr.ins.getInGame() == true)
            {
              setTimeout(() => SdkMgr.hideCustomAd(), 2000)
            }
          }
      })
    }

    start () {
      MainView.ins = this;
    }

    setLvLabel(_lv?: number) {
      let lv = _lv;
      //console.log(" MainView.Set LV: ",_lv,"  Global.LV:: ",Global.lv)
      if(_lv == null || _lv == 0)
      {
        lv = Global.lv;
      }
      this.lvLabel.string = "第" + lv + "关"; 
    }

    setCoinLabel(){
      this.coinLabel.string = Global.getCurrentCoin().toString();
    }

    async onStartGameClick() {
        const view = await ResMgr.ins.getUI(ui.GameView);
        let gameView = view.getComponent(GameView);
        gameView.init(Global.lv);
        view.parent = this.node.parent;
        GameMgr.ins.setInGame(true);
        SdkMgr.hideCustomAd();
    }

    async onDressupClick() {

    }
  
    async onTurnTableClick(){
        const view = await ResMgr.ins.getUI(ui.LuckyDrawView);
        view.parent = this.node.parent;
    }

    async onSignClick(){
        const view = await ResMgr.ins.getUI(ui.SignView);
        view.parent = this.node.parent;
        //Global.setToolSettingValue("luckyKey", 5);
    }

    async onRankClick(){
        const view = await ResMgr.ins.getUI(ui.RankListView);
        view.parent = this.node.parent;
        //Global.clearLuckyDrawData();
    }

    async onSettingClick(){
        const view = await ResMgr.ins.getUI(ui.SettingView);
        view.parent = this.node.parent;
    }

    eventLevelChange(){
      this.setLvLabel();
    }

    eventBackToMain(){
      this.setLvLabel();
      this.setCoinLabel();
      SoundMgr.ins.playBackMusic(Clips.back_inMain);
      SdkMgr.showCustomAd((retValue) => {
          //console.log(" onMoreAwardClick.... retValue: ",retValue);
          if(retValue == 1)
          {
            if(GameMgr.ins && GameMgr.ins.getInGame() == true)
            {
              setTimeout(() => SdkMgr.hideCustomAd(), 2000)
            }
          }
      })
    }
      
    // update (dt) {}
}
