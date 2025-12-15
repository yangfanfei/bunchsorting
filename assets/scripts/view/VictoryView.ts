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
  tubeFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  fallbackFrame: cc.SpriteFrame = null;

  private coinReward = 0;
  private tubeReward = 0;
  private fallbackReward = 0;

  init() {
    this.coinReward = Global.rewardCoin;
    this.curAwardLabel.string = "+" + this.coinReward.toString();

    let random1 = randomNum(1,100);
    let random2 = randomNum(1,10);

    console.log(" RandomNumber1:: ",random1," RandomNumber2: ",random2);
    if(random1 >= 50)    /// random have tool reward
    {
      if(random2 >= 5)
      {
        this.curToolIcon.spriteFrame = this.fallbackFrame;
        this.fallbackReward = 1;
      }
      else
      {
        this.curToolIcon.spriteFrame = this.tubeFrame;
        this.tubeReward = 1;
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
    if(this.tubeReward > 0)
    {
      Global.addToolSetting("bunch", 1);
      cc.director.emit(events.AddBunch);
    }
    if(this.fallbackReward > 0)
    {
      Global.addToolSetting("back", 1);
      cc.director.emit(events.Back);
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
