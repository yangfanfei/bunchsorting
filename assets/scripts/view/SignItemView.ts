/*
 * @Author: jxgamestudio
 * @Description:  signItem View
 */

import { prop } from "../enum/Enums";
import { AccessType, signInInfo } from "../base/Interface";
import PropBlockMgr from "../manager/PropBlockMgr";
import ResMgr from "../manager/ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SignItemView extends cc.Component {
  @property(cc.Label)
  dayLabel: cc.Label = null;

  @property(cc.Label)
  getLabel: cc.Label = null;

  @property(cc.Label)
  rewardLabel: cc.Label = null;

  @property(cc.Node)
  bgNode:cc.Node = null;

  @property(cc.Node)
  coinNode:cc.Node = null;

  @property(cc.SpriteFrame)
  todaySpr:cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  nonTodaySpr:cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  coinNormal:cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  coinRecv:cc.SpriteFrame = null;

  //@property(cc.Node)
  //content: cc.Node = null;

  //@property(cc.Node)
  //maskNode: cc.Node = null;

  //@property(cc.Node)
  //checkNode: cc.Node = null;

  //@property(cc.Node)
  //mendSignNode: cc.Node = null;

  //@property(cc.Node)
  //signLayoutNode: cc.Node = null;

  /*@property({
    type: [cc.SpriteFrame],
    tooltip: "0分享，1视频",
  })
  mendSignSpriteFrames: cc.SpriteFrame[] = [];*/

  /**
   * 补签点击事件
   */
  public mendSignFn: Function = null;
  //   签到状态
  private _signState: boolean = false;
  // 是否是今天
  private _isToday: boolean = false;
  setDayLabel(day: number) {
    if (this.dayLabel) this.dayLabel.string = `第${day}天`;
  }

  setItemSpr(sprFr:cc.SpriteFrame){
    let spr = this.coinNode.getComponent(cc.Sprite);
    spr.spriteFrame = sprFr;
  }

  //   更新签到状态
  updateSignState(state: boolean) {
    this._signState = state;
    var  coinSpr  = this.coinNode.getComponent(cc.Sprite);
    if(this._signState == true)
    {
      this.getLabel.node.active = true;
      this.rewardLabel.node.active = false;
      coinSpr.spriteFrame = this.coinRecv;
    }
    else
    {
      this.getLabel.node.active = false;
      this.rewardLabel.node.active = true;
      coinSpr.spriteFrame = this.coinNormal;
    }
  }
  // 更新今天状态
  updateTodayState(state: boolean) {
    this._isToday = state;
    var bgSpr = this.bgNode.getComponent(cc.Sprite);
    if(this._isToday == true)
    {
      bgSpr.spriteFrame = this.todaySpr;
    }
    else
    {
      bgSpr.spriteFrame = this.nonTodaySpr;
    }
  }

  setItemCount(count:number){
    this.rewardLabel.string = count+"";
  }

  // LIFE-CYCLE CALLBACKS:
}
