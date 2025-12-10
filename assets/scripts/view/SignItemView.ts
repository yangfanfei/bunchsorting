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
  bgSpr:cc.Node = null;

  @property(cc.SpriteFrame)
  todaySpr:cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  nonTodaySpr:cc.SpriteFrame = null;

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
  // 遮罩是否展示
  setMaskState(state: boolean) {
    //this.maskNode.active = state;
  }

  //   更新签到状态
  updateSignState(state: boolean) {
    this._signState = state;
    if(this._signState == true)
    {
      this.getLabel.node.active = true;
      this.rewardLabel.node.active = false;
    }
    else
    {
      this.getLabel.node.active = false;
      this.rewardLabel.node.active = true;
    }
  }
  // 更新今天状态
  updateTodayState(state: boolean) {
    this._isToday = state;
    if(this._isToday == true)
    {

    }
    else
    {
      
    }
  }

  //   在content添加元素
  async addContentNode(oneInfo: signInInfo) {
    //let onePre = await ResMgr.ins.getUI(prop[oneInfo.key]);
    //let propBlockMgr = onePre.getComponent(PropBlockMgr);

    //propBlockMgr.setLabel(`${oneInfo.label}x${oneInfo.num}`);
    // propBlockMgr.label.node.color = cc.Color.WHITE;
    //onePre.parent = this.content;
    //propBlockMgr.setLabelColor(new cc.Color(0, 0, 0));
  } 
 
  /**
   * 补签状态及是否显示
   * @param state  补签类型
   * @param isShow  是否显示
   * @returns
   */
  updateMendSignState(state: AccessType, isShow: boolean) {
    /*this.signLayoutNode.active = !isShow;
    if (!this.mendSignNode) return;
    this.mendSignNode.active = isShow;

    switch (state) {
      case AccessType.Share:
        this.mendSignNode.getComponent(cc.Sprite).spriteFrame =
          this.mendSignSpriteFrames[0];
        break;
      case AccessType.Video:
        this.mendSignNode.getComponent(cc.Sprite).spriteFrame =
          this.mendSignSpriteFrames[1];
        break;
      default:
        break;
    }*/
  }
  // 补签点击事件
  mendSignClick() {
    console.log("补签");
    if (this.mendSignFn) this.mendSignFn();
  }
  // LIFE-CYCLE CALLBACKS:
}
