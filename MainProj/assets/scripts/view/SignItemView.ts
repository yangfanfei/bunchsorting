/*
 * @Author: jxgamestudio
 * @Description:  signItem View
 */

import { prop } from "../enum/Enums";
import { AccessType, signInInfo } from "../base/Interface";
import PropBlockMgr from "../manager/PropBlockMgr";
import ResMgr from "../manager/ResMgr";
import { FuncUtil } from "../base/FuncUtil";

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
  getedSpr:cc.SpriteFrame = null;

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
  updateSignState(state: boolean, iconSpr:cc.SpriteFrame, iconScale:number) {
    this._signState = state;
    let  coinSpr  = this.coinNode.getComponent(cc.Sprite);
    if(this._signState == true)
    {
      this.getLabel.node.active = true;
      this.rewardLabel.node.active = false;
      coinSpr.spriteFrame = iconSpr;
      this.coinNode.scale = iconScale;
      FuncUtil.setSprGray(coinSpr, true);
    }
    else
    {
      this.getLabel.node.active = false;
      this.rewardLabel.node.active = true;
      coinSpr.spriteFrame = iconSpr;
      this.coinNode.scale = iconScale;
      FuncUtil.setSprGray(coinSpr, false);
    }
  }
  // 更新今天状态
  updateTodayState(state: boolean) {
    this._isToday = state;
    let bgSpr = this.bgNode.getComponent(cc.Sprite);
    if(this._isToday == true)
    {
      bgSpr.spriteFrame = this.todaySpr;
    }
    else
    {
      bgSpr.spriteFrame = this.nonTodaySpr;
    }

    if(this._signState == true)
    {
      bgSpr.spriteFrame = this.getedSpr;
    }
  }

  setItemCount(count:number){
    this.rewardLabel.string = count+"";
  }

  // LIFE-CYCLE CALLBACKS:
}
