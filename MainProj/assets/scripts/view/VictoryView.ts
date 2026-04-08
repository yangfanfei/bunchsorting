/*
 * @Author: jxgamestudio
 * @Description: victory view
 */

import BaseView from "./BaseView";
import { Global } from "../Global";
import { events } from "../enum/Enums";
import { randomNum } from "../base/Math";
import { SdkMgr } from "../sdk/SdkMgr";
import GameView from "./GameView";
import UserDataMgr from "../manager/UserDataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VictoryView extends BaseView {
  @property(cc.Label)
  curAwardLabel: cc.Label = null;

  @property(cc.Sprite)
  curToolIcon: cc.Sprite = null;

  @property(cc.Label)
  curToolLabel: cc.Label = null;

  @property(cc.Label)
  nextLabel:cc.Label = null;

  @property(cc.Label)
  levelLabel:cc.Label = null;

  @property(cc.Node)
  curAwardCoin: cc.Node = null;

  @property(cc.Node)
  curAwardTool: cc.Node = null;

  @property(cc.SpriteFrame)
  bunchFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  fallbackFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  finishFrame: cc.SpriteFrame = null;

  private coinReward = 0;
  private bunchReward = 0;
  private backReward = 0;
  private finishReward = 0;
  private intervalID = 0;
  private currentLevel = 0;

  onLoad(): void {
    this.nextLabel.node.active = false;
    let nextLabel = this.nextLabel;
    this.intervalID = setTimeout(() => {
        //console.log('这个消息永远不会显示');
        nextLabel.node.active = true;
    }, 2000);

  }

  init() {
    this.coinReward = Global.rewardCoin;
    this.curAwardLabel.string = "+" + this.coinReward.toString();
    /*let lastLv = Global.lv - 1
    let rewardItem = false
    if(lastLv > 0)
    {
      if(lastLv%5 ==0 || lastLv%10 == 0)
      {
          rewardItem = true
      }
    }

    console.log(" CurrentLevel:::::  ",Global.lv," RewardItem:: ",rewardItem);
    if(rewardItem == true)    /// random have tool reward
    {
      let random1 = randomNum(1,100);
      console.log(" randNum =============  ",random1);
      if(random1 > 98)
      {
        this.curToolIcon.spriteFrame = this.finishFrame;
        this.finishReward = 1;
      }
      else if(random1 > 85)
      {
        this.curToolIcon.spriteFrame = this.bunchFrame;
        this.bunchReward = 1;
      }
      else
      {
        this.curToolIcon.spriteFrame = this.fallbackFrame;
        this.backReward = 1;
      }

      this.curToolLabel.string = "+1";
    }
    else*/
    {
       this.curAwardCoin.position = new cc.Vec3(-50,0,0);
       this.curAwardTool.active = false;
    }
  }

  public setLevel(val)
  {
    this.levelLabel.string = "第" + val + "关";
  }

  onNextLevelClick(){

    Global.addCoin(this.coinReward);
    cc.director.emit(events.CoinChange);

    this.loadNextLvel();
  }

  onMoreAwardClick(){
    console.log("  OnMoreAwardClick.................. ");

    let view = this;
    SdkMgr.showRewardAD((retValue) => {
          console.log(" onMoreAwardClick.... retValue: ",retValue);
          if(retValue == 1)
          {
            this.coinReward = Global.rewardCoin*5;
            Global.addCoin(Global.rewardCoin*5);
            cc.director.emit(events.CoinChange);
          }
          else
          {
            this.coinReward = Global.rewardCoin;
            Global.addCoin(Global.rewardCoin);
            cc.director.emit(events.CoinChange);
          }
          UserDataMgr.ins.adAccAdCountAndSave();
          view.loadNextLvel();
      })
  }

  loadNextLvel(){
    // 取消定时器
    clearTimeout(this.intervalID);
    super.close();
    this.node.destroy();
    cc.director.emit(events.Start);
  }
}
