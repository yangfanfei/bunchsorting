/*
 * @Author: jxgamestudio
 * @Description:  Setting View
 */


import { Global } from "../Global";
import { events } from "../enum/Enums";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass("SpriteFrameState")
export class SpriteFrameState {
  @property(cc.SpriteFrame)
  on: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  off: cc.SpriteFrame = null;
}

@ccclass
export default class SettingView extends BaseView {
  @property(SpriteFrameState)
  sound: SpriteFrameState = null;
  @property(cc.Sprite)
  soundSprite: cc.Sprite = null;
  start() {
    this.checkSpriteFrame();
  }
  checkSpriteFrame() {
      if (Global.sound == 1) {
        this.soundSprite.spriteFrame = this.sound.on;
      } else {
        this.soundSprite.spriteFrame = this.sound.off;
      }
  }
  changeSound() {
    Global.sound *= -1;
    this.checkSpriteFrame();
    cc.director.emit(events.ChangeSound, "sound");
  }
  close() {
    super.close()
    this.node.destroy();
  }
  // update (dt) {}
}
