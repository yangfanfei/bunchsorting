/*
 * @Author: jxgamestudio
 * @Description: base view  Class 
 */
import { Global } from "../Global";
import { AdMgr } from "../ad/AdMgr";
import { Clips } from "../enum/Enums";
import { SoundMgr } from "../manager/SoundMgr";
import { PoolMgr } from "../manager/PoolMgr";
import { Tools } from "../utils/Tools";

const { ccclass, property } = cc._decorator;
// @ts-ignore
let old: Function = cc.Button.prototype._onTouchEnded;
// @ts-ignore
cc.Button.prototype._onTouchEnded = function (...args) {
  old.apply(this, args);
//  if(CC_WECHATGAME) wx.vibrateLong();
  SoundMgr.ins.playSound(Clips.Button_Click, 0.5);
}
@ccclass
export default class BaseView extends cc.Component {
  @property({})
  tweenView = true;

  @property({
    type: cc.Node,
    visible() {
      return this.tweenView;
    },
  })
  root: cc.Node = null;

  @property({
    visible() {
      return this.tweenView;
    },
  })
  tweenTime = 0.25;

  @property({})
  playBtnClip = true;

  onDisable() {

  }

  onLoad() {

  }

  onEnable() {
    this.playBtnClip && SoundMgr.ins.playSound(Clips.Button_Click, 0.5);

    if (this.tweenView) {
      if (!this.root) {
        this.root = this.node;
        this.scheduleOnce(() => {
          Tools.fadeIn(this.root);
        })
      } else {
        Tools.fadeIn(this.root);
      }

    }
  }

  close() {
    this.playBtnClip && SoundMgr.ins.playSound(Clips.Button_Click, 0.5);

    if (this.tweenView) {
      if (!this.root) this.root = this.node;
      // Tools.fadeOut(this.root, () => {
      //   PoolMgr.ins.putNode(this.node);
      // });
    } else {
      PoolMgr.ins.putNode(this.node);
    }
  }
}
