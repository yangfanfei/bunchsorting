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
import UserDataMgr from "../manager/UserDataMgr";
import ConfigMgr from "../manager/ConfigMgr";
import { ADD_LIFE_SOW_AD, ENTER_LEVEL_COST, MAX_LIFE } from "../base/Const";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainView extends BaseView {

    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Label)
    lifeLabel: cc.Label = null;

    @property(cc.Label)
    enterLifeLabel: cc.Label = null;

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

    private enterLifeLableoutline:cc.LabelOutline = null;

    onEnable() {
      cc.director.on(events.LevelSelectChange, this.eventLevelChange, this);
      cc.director.on(events.CoinChange, this.setCoinLabel, this);
      cc.director.on(events.LifeChange, this.setLifeLabel, this);
      cc.director.on(events.BackToMain, this.eventBackToMain, this);
    }
    onDisable() {
      cc.director.off(events.LevelSelectChange, this.eventLevelChange, this);
      cc.director.off(events.CoinChange, this.setCoinLabel, this);
      cc.director.off(events.LifeChange, this.setLifeLabel, this);
      cc.director.off(events.BackToMain, this.eventBackToMain, this);
    }

    onLoad(): void {
      ConfigMgr.ins.init();
      UserDataMgr.ins.init();

      this.setLvLabel();
      this.setCoinLabel();
      this.setLifeLabel();
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

    setLifeLabel(){
      console.log(" setLifeLabel....... Update");
      let currentLife = UserDataMgr.ins.getCurrentLife();
      if(currentLife < ENTER_LEVEL_COST)
      {
        if (!this.enterLifeLableoutline) {
          this.enterLifeLableoutline = this.enterLifeLabel.getComponent(cc.LabelOutline);
        }
        this.enterLifeLableoutline.color = new cc.Color(177, 49, 52);
        this.enterLifeLabel.node.color = new cc.Color(254, 125, 125);
      }
      else
      {
        if (!this.enterLifeLableoutline) {
          this.enterLifeLableoutline = this.enterLifeLabel.getComponent(cc.LabelOutline);
        }
        this.enterLifeLableoutline.color = new cc.Color(26, 163, 52);
        this.enterLifeLabel.node.color = new cc.Color(90, 255, 82);
      }

      this.lifeLabel.string = MAX_LIFE + "/" + currentLife;
      this.enterLifeLabel.string = currentLife + "/" + ENTER_LEVEL_COST;
    }

    onAddLifeClick(){
      let currentLife = UserDataMgr.ins.getCurrentLife();
      if(currentLife >= MAX_LIFE)
      {
        cc.director.emit(events.Toast, `体力已达上限！`)
      }
      else
      {
          SdkMgr.showLifeRewardAD((retValue) => {
              if(retValue == 1)
              {
                  //UserDataMgr.ins.addToActiveDressUpItems(this.itemData.id);
                  UserDataMgr.ins.adAccAdCountAndSave();
                  console.log(" CurrentLife:::  ",currentLife);
                  currentLife = currentLife + ADD_LIFE_SOW_AD;
                  UserDataMgr.ins.setLife(currentLife);
                  cc.director.emit(events.LifeChange);
              }
          });
      }
    }

    async onStartGameClick() {
        let currentLife = UserDataMgr.ins.getCurrentLife();
        if(currentLife < ENTER_LEVEL_COST)
        {
          cc.director.emit(events.Toast, `体力不足，无法进入关卡！`)
          return;
        }
        //Global.lv = 340;
        const view = await ResMgr.ins.getUI(ui.GameView);
        let gameView = view.getComponent(GameView);
        gameView.init(Global.lv);
        view.parent = this.node.parent;
        GameMgr.ins.setInGame(true);
        currentLife = currentLife - ENTER_LEVEL_COST;
        UserDataMgr.ins.setLife(currentLife);
        SdkMgr.hideCustomAd();
    }

    async onDressupClick() {
        const view = await ResMgr.ins.getUI(ui.ShopView);
        view.parent = this.node.parent;
    }
  
    async onTurnTableClick(){
        const view = await ResMgr.ins.getUI(ui.LuckyDrawView);
        view.parent = this.node.parent;
    }

    async onSignClick(){
        const view = await ResMgr.ins.getUI(ui.SignView);
        view.parent = this.node.parent;
    }

    async onRankClick(){
        //Global.clearActiveItems();
        const view = await ResMgr.ins.getUI(ui.RankListView);
        view.parent = this.node.parent;
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
      this.setLifeLabel();
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
