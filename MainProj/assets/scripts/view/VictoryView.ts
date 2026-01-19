/*
 * @Author: jxgamestudio
 * @Description: victory view
 */

import BaseView from "./BaseView";
import { Global } from "../Global";
import { events } from "../enum/Enums";
import { randomNum } from "../base/Math";
import CoinMgr from "../manager/CoinMgr";
import { SdkMgr } from "../sdk/SdkMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VictoryView extends BaseView {
  @property(cc.Label)
  curAwardLabel: cc.Label = null;

  @property(cc.Sprite)
  curToolIcon: cc.Sprite = null;

  @property(cc.Label)
  curToolLabel: cc.Label = null;

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

  init() {
    this.coinReward = Global.rewardCoin;
    this.curAwardLabel.string = "+" + this.coinReward.toString();

    let lastLv = Global.lv - 1
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
    else
    {
       this.curAwardCoin.position = new cc.Vec3(-50,0,0);
       this.curAwardTool.active = false;
    }
  }

  onNextLevelClick(){
    if(this.bunchReward > 0)
    {
      Global.addToolSetting("bunch", 1);
      cc.director.emit(events.ToolItemChange);
    }
    if(this.backReward > 0)
    {
      Global.addToolSetting("back", 1);
      cc.director.emit(events.ToolItemChange);
    }
    if(this.finishReward > 0)
    {
      Global.addToolSetting("finish", 1);
      cc.director.emit(events.ToolItemChange);
    }

    Global.addCoin(this.coinReward);
    CoinMgr.ins.setCoinLabel();
    this.loadNextLvel();
  }

  onMoreAwardClick(){
    SdkMgr.showRewardAD(() => {
          this.coinReward = Global.rewardCoin*5;
          this.curAwardLabel.string = "+" + this.coinReward.toString();
          Global.addCoin(Global.rewardCoin*5);
          CoinMgr.ins.setCoinLabel();
      })
  }

  loadNextLvel(){
    super.close();
    this.node.destroy();
    cc.director.emit(events.Start);
  }
}
